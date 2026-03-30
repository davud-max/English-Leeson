import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getGitHubAuthHeaders, getGitHubToken } from '@/lib/github';
import { normalizeAdminKey } from '@/lib/admin-key';

const GITHUB_TOKEN = getGitHubToken();
const GITHUB_REPO = 'davud-max/English-Leeson';
const GITHUB_BRANCH = 'main';
const MAX_ORDER = 23;

type RepairRequest = {
  adminKey?: string;
  orders?: number[];
  overwriteFromLegacy?: boolean;
};

type SlideLike = {
  audioUrl?: string;
  content?: string;
};

type FilePayload = {
  sha: string;
  content: string;
  path: string;
};

export async function POST(request: NextRequest) {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GITHUB_TOKEN is not configured' }, { status: 500 });
    }

    const body = (await request.json().catch(() => ({}))) as RepairRequest;
    const adminKey = normalizeAdminKey(body.adminKey);
    if (!adminKey || adminKey !== normalizeAdminKey(process.env.ADMIN_SECRET_KEY)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestedOrders = Array.isArray(body.orders)
      ? body.orders.filter((n) => Number.isInteger(n) && n >= 1 && n <= MAX_ORDER)
      : [];
    const overwriteFromLegacy = body.overwriteFromLegacy === true;

    const lessons = await prisma.lesson.findMany({
      where: {
        published: true,
        order: requestedOrders.length ? { in: requestedOrders } : { lte: MAX_ORDER },
      },
      orderBy: { order: 'asc' },
      select: { id: true, order: true, slides: true, content: true },
    });

    const results: Array<{
      order: number;
      lessonId: string;
      slides: number;
      copied: number;
      skipped: number;
      missing: number;
    }> = [];

    for (const lesson of lessons) {
      const slides = Array.isArray(lesson.slides) ? (lesson.slides as SlideLike[]) : [];
      const slideCount = slides.length > 0 ? slides.length : estimateSlidesFromContent(lesson.content || '');
      const stableFolder = `lesson-${lesson.id}`;
      const legacyFolder = `lesson${lesson.order}`;

      let copied = 0;
      let skipped = 0;
      let missing = 0;

      for (let i = 1; i <= slideCount; i++) {
        const targetPath = `public/audio/${stableFolder}/slide${i}.mp3`;
        const targetExists = await getFile(targetPath);

        const explicit = getRepoPathFromAudioUrl(slides[i - 1]?.audioUrl);
        const legacyPath = `public/audio/${legacyFolder}/slide${i}.mp3`;

        const sourceCandidates: string[] = [];
        if (explicit) sourceCandidates.push(explicit);
        sourceCandidates.push(legacyPath);
        if (!sourceCandidates.includes(targetPath)) {
          sourceCandidates.push(targetPath);
        }

        const sourcePath = overwriteFromLegacy
          ? legacyPath
          : await findFirstExistingPath(sourceCandidates);

        if (!sourcePath) {
          missing++;
          continue;
        }

        if (!overwriteFromLegacy && targetExists && sourcePath === targetPath) {
          skipped++;
          continue;
        }

        if (!overwriteFromLegacy && targetExists && sourcePath !== targetPath) {
          // Target already exists; do not overwrite unless explicitly requested.
          skipped++;
          continue;
        }

        const source = await getFile(sourcePath);
        if (!source?.content) {
          missing++;
          continue;
        }

        await putFile(
          targetPath,
          source.content,
          `Repair audio mapping: lesson ${lesson.order} slide ${i}`
        );
        copied++;
        await wait(120);
      }

      results.push({
        order: lesson.order,
        lessonId: lesson.id,
        slides: slideCount,
        copied,
        skipped,
        missing,
      });
    }

    return NextResponse.json({
      success: true,
      mode: overwriteFromLegacy ? 'overwrite_from_legacy' : 'copy_missing_only',
      lessons: results.length,
      totals: {
        copied: results.reduce((sum, r) => sum + r.copied, 0),
        skipped: results.reduce((sum, r) => sum + r.skipped, 0),
        missing: results.reduce((sum, r) => sum + r.missing, 0),
      },
      results,
    });
  } catch (error: any) {
    console.error('Repair audio error:', error);
    return NextResponse.json(
      { error: 'Failed to repair audio mapping', detail: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

function estimateSlidesFromContent(content: string): number {
  const chunks = content.split(/\n\n+/).filter((p) => p.trim().length > 0);
  return Math.max(1, chunks.length);
}

function getRepoPathFromAudioUrl(audioUrl?: string): string | null {
  if (!audioUrl || typeof audioUrl !== 'string') return null;
  const trimmed = audioUrl.trim();
  if (!trimmed) return null;

  const rawPrefix = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/`;
  if (trimmed.startsWith(rawPrefix)) {
    return trimmed.replace(rawPrefix, '');
  }
  if (trimmed.startsWith('/audio/')) {
    return `public${trimmed}`;
  }
  return null;
}

async function findFirstExistingPath(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    const file = await getFile(p);
    if (file?.content) return p;
  }
  return null;
}

async function getFile(path: string): Promise<FilePayload | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        ...getGitHubAuthHeaders(),
      },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return {
    sha: data.sha,
    content: typeof data.content === 'string' ? data.content.replace(/\n/g, '') : '',
    path: data.path,
  };
}

async function putFile(path: string, contentBase64: string, message: string) {
  const existing = await getFile(path);
  const body: Record<string, string> = {
    message,
    content: contentBase64,
    branch: GITHUB_BRANCH,
  };
  if (existing?.sha) body.sha = existing.sha;

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      ...getGitHubAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to upload ${path}: ${res.status} ${txt}`);
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

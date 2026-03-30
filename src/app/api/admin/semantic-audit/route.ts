import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeAdminKey } from '@/lib/admin-key';

const MAX_ORDER = 23;

type Finding = {
  lesson: number;
  severity: 'critical' | 'warning';
  code: string;
  message: string;
};

const STOPWORDS = new Set([
  'the', 'and', 'for', 'that', 'with', 'from', 'this', 'have', 'will', 'into', 'your', 'about',
  'through', 'what', 'when', 'where', 'which', 'while', 'there', 'their', 'than', 'then', 'also',
  'them', 'they', 'been', 'being', 'these', 'those', 'only', 'more', 'less', 'very', 'just',
  'between', 'toward', 'towards', 'course', 'lesson', 'algorithms', 'thinking', 'cognition',
]);

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

function tokenOverlapScore(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let common = 0;
  for (const item of setA) if (setB.has(item)) common++;
  return common / Math.min(setA.size, setB.size);
}

function hasPlaceholder(text: string): boolean {
  return /(lorem ipsum|todo|tbd|content here|new lesson|placeholder)/i.test(text);
}

function getSlidesText(slides: unknown): string {
  if (!Array.isArray(slides)) return '';
  return slides
    .map((s) => (s && typeof s === 'object' && 'content' in s ? String((s as any).content || '') : ''))
    .join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const adminKey = normalizeAdminKey(body?.adminKey);

    if (!adminKey || adminKey !== normalizeAdminKey(process.env.ADMIN_SECRET_KEY)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        published: true,
        order: { lte: MAX_ORDER },
      },
      orderBy: { order: 'asc' },
      select: {
        order: true,
        title: true,
        description: true,
        content: true,
        slides: true,
      },
    });

    const findings: Finding[] = [];
    const contentByOrder = new Map<number, string>();

    for (const lesson of lessons) {
      const slidesText = getSlidesText(lesson.slides);
      const contentText = (lesson.content || '').trim();
      const descriptionText = (lesson.description || '').trim();
      const unifiedText = [descriptionText, slidesText || contentText].filter(Boolean).join('\n\n').trim();

      contentByOrder.set(lesson.order, unifiedText);

      if (!unifiedText || unifiedText.length < 280) {
        findings.push({
          lesson: lesson.order,
          severity: 'critical',
          code: 'LOW_CONTENT',
          message: `Lesson content is too short (${unifiedText.length} chars).`,
        });
      }

      if (hasPlaceholder(`${lesson.title}\n${descriptionText}\n${contentText}\n${slidesText}`)) {
        findings.push({
          lesson: lesson.order,
          severity: 'critical',
          code: 'PLACEHOLDER',
          message: 'Placeholder text detected.',
        });
      }

      if (/[А-Яа-яЁё]/.test(`${lesson.title}\n${descriptionText}\n${unifiedText}`)) {
        findings.push({
          lesson: lesson.order,
          severity: 'warning',
          code: 'NON_ENGLISH',
          message: 'Cyrillic symbols detected in lesson text.',
        });
      }

      const titleTokens = normalizeWords(lesson.title || '');
      const bodyTokens = normalizeWords(`${descriptionText}\n${unifiedText}`);
      const overlap = tokenOverlapScore(titleTokens, bodyTokens);
      if (titleTokens.length > 0 && overlap < 0.08) {
        findings.push({
          lesson: lesson.order,
          severity: 'warning',
          code: 'TITLE_MISMATCH',
          message: 'Weak semantic overlap between title and body text.',
        });
      }

      if (Array.isArray(lesson.slides)) {
        const seen = new Set<string>();
        let duplicates = 0;
        for (const rawSlide of lesson.slides) {
          const slide = rawSlide && typeof rawSlide === 'object' ? rawSlide as any : {};
          const snippet = String(slide.content || '')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 180);
          if (!snippet) continue;
          if (seen.has(snippet)) duplicates++;
          seen.add(snippet);
        }
        if (duplicates > 0) {
          findings.push({
            lesson: lesson.order,
            severity: 'warning',
            code: 'DUPLICATE_SLIDES',
            message: `Detected ${duplicates} duplicated slide content fragment(s).`,
          });
        }
      }
    }

    const checked = [...contentByOrder.entries()];
    for (let i = 0; i < checked.length; i++) {
      for (let j = i + 1; j < checked.length; j++) {
        const [orderA, textA] = checked[i];
        const [orderB, textB] = checked[j];
        if (!textA || !textB) continue;
        const tokensA = normalizeWords(textA).slice(0, 250);
        const tokensB = normalizeWords(textB).slice(0, 250);
        const overlap = tokenOverlapScore(tokensA, tokensB);
        if (overlap >= 0.78) {
          findings.push({
            lesson: orderA,
            severity: 'warning',
            code: 'POSSIBLE_DUPLICATE',
            message: `Potential near-duplicate with lesson ${orderB} (token overlap ${(overlap * 100).toFixed(0)}%).`,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      auditedLessons: lessons.length,
      boundary: { min: 1, max: MAX_ORDER },
      summary: {
        critical: findings.filter((f) => f.severity === 'critical').length,
        warning: findings.filter((f) => f.severity === 'warning').length,
      },
      findings: findings.sort((a, b) => a.lesson - b.lesson),
    });
  } catch (error: any) {
    console.error('Semantic audit error:', error);
    return NextResponse.json(
      { error: 'Failed to run semantic audit', detail: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

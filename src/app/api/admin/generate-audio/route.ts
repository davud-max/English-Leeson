import { NextResponse } from 'next/server';

// ElevenLabs API через прокси
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274';
const PROXY_URL = 'https://elevenlabs-proxy-two.vercel.app/api/elevenlabs';

// Прямой API ElevenLabs (если прокси не работает)
const ELEVENLABS_DIRECT_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

interface GenerateAudioRequest {
  text: string;
  voiceId: string;
  slideNumber?: number;
  lessonId?: string;
}

export async function POST(request: Request) {
  try {
    const body: GenerateAudioRequest = await request.json();
    const { text, voiceId, slideNumber } = body;

    if (!text || !voiceId) {
      return NextResponse.json(
        { error: 'Text and voiceId are required' },
        { status: 400 }
      );
    }

    // Очищаем текст
    let cleanText = text.trim();
    
    // Удаляем маркеры слайдов если есть
    cleanText = cleanText.replace(/\[SLIDE:\d+\]\s*/g, '');
    
    // Удаляем Markdown разметку
    cleanText = cleanText
      .replace(/#{1,6}\s/g, '') // заголовки
      .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
      .replace(/\*([^*]+)\*/g, '$1') // italic
      .replace(/`([^`]+)`/g, '$1') // code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
      .replace(/^\s*[-*+]\s/gm, '') // lists
      .replace(/^\s*\d+\.\s/gm, ''); // numbered lists
    
    // Добавляем паузы для лучшей интонации
    cleanText = addPauses(cleanText);

    // Проверяем длину (максимум 5000 символов для ElevenLabs)
    if (cleanText.length > 5000) {
      return NextResponse.json(
        { error: 'Text is too long. Maximum 5000 characters.' },
        { status: 400 }
      );
    }

    if (cleanText.length < 10) {
      return NextResponse.json(
        { error: 'Text is too short. Minimum 10 characters.' },
        { status: 400 }
      );
    }

    console.log(`Generating audio for slide ${slideNumber}, text length: ${cleanText.length}`);

    // Пробуем сначала через прокси
    let audioBase64: string | null = null;
    
    try {
      audioBase64 = await generateViaProxy(cleanText, voiceId);
    } catch (proxyError) {
      console.log('Proxy failed, trying direct API...', proxyError);
      try {
        audioBase64 = await generateViaDirect(cleanText, voiceId);
      } catch (directError) {
        console.error('Direct API also failed:', directError);
        return NextResponse.json(
          { error: 'Failed to generate audio: ' + (directError as Error).message },
          { status: 500 }
        );
      }
    }

    if (!audioBase64) {
      return NextResponse.json(
        { error: 'Failed to generate audio - no data returned' },
        { status: 500 }
      );
    }

    // Возвращаем base64 аудио напрямую (Railway не позволяет записывать файлы)
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

    console.log(`Audio generated successfully, size: ${audioBase64.length} chars`);

    return NextResponse.json({
      success: true,
      audioUrl,
      audioBase64,
      textLength: cleanText.length,
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Генерация через прокси
async function generateViaProxy(text: string, voiceId: string): Promise<string> {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: ELEVENLABS_API_KEY,
      voiceId: voiceId,
      text: text,
      stability: 0.5,
      similarity_boost: 0.75,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Proxy error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.success || !data.audio) {
    throw new Error(data.error || 'No audio returned from proxy');
  }

  return data.audio;
}

// Генерация напрямую через ElevenLabs API
async function generateViaDirect(text: string, voiceId: string): Promise<string> {
  const response = await fetch(`${ELEVENLABS_DIRECT_URL}/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

// Добавление пауз для лучшей интонации
function addPauses(text: string): string {
  let result = text;
  
  // Пауза между абзацами
  result = result.replace(/\n\n+/g, '\n\n... ...\n\n');
  
  // Пауза после предложений (перед заглавной буквой)
  result = result.replace(/([.!?])(\s+)(?=[A-ZА-Я])/g, '$1 ...$2');
  
  // Пауза перед важными словами
  result = result.replace(/(\. )(So|Therefore|However|Now|Let's|This|That|First|Second|Third|Finally|Remember|Important)/gi, '$1... $2');
  
  // Убираем лишние паузы подряд
  result = result.replace(/(\.\.\.\s*){3,}/g, '... ... ');
  result = result.replace(/(\.\.\.\s*){2}/g, '... ');
  
  return result;
}

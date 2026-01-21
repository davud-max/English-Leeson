// Audio Generation Service for Lesson Narration
import axios from 'axios';

interface AudioGenerationConfig {
  provider: 'elevenlabs' | 'polly' | 'google' | 'azure';
  apiKey: string;
  voiceId?: string;
  text: string;
  lessonId: string;
}

class AudioGenerationService {
  private providers = {
    elevenlabs: {
      baseUrl: 'https://api.elevenlabs.io/v1',
      voicesEndpoint: '/voices',
      ttsEndpoint: '/text-to-speech'
    },
    // Другие провайдеры могут быть добавлены аналогично
  };

  async generateLessonAudio(config: AudioGenerationConfig): Promise<string> {
    try {
      switch (config.provider) {
        case 'elevenlabs':
          return await this.generateWithElevenLabs(config);
        default:
          throw new Error(`Provider ${config.provider} not implemented`);
      }
    } catch (error) {
      console.error('Audio generation failed:', error);
      throw error;
    }
  }

  private async generateWithElevenLabs(config: AudioGenerationConfig): Promise<string> {
    const response = await axios.post(
      `${this.providers.elevenlabs.baseUrl}${this.providers.elevenlabs.ttsEndpoint}/${config.voiceId || '21m00Tcm4TlvDq8ikWAM'}`,
      {
        text: config.text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': config.apiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );

    // Здесь можно сохранить аудио в файл или облачное хранилище
    const fileName = `lesson-${config.lessonId}.mp3`;
    // await this.saveAudioStream(response.data, fileName);
    
    return fileName;
  }

  // Получение списка доступных голосов
  async getVoices(provider: 'elevenlabs', apiKey: string) {
    if (provider === 'elevenlabs') {
      const response = await axios.get(
        `${this.providers.elevenlabs.baseUrl}${this.providers.elevenlabs.voicesEndpoint}`,
        {
          headers: {
            'xi-api-key': apiKey
          }
        }
      );
      return response.data.voices;
    }
  }
}

export const audioService = new AudioGenerationService();

// Пример использования для Урока 1
export async function generateLesson1Audio(apiKey: string) {
  const lesson1Text = `
    Terms and Definitions. How precise knowledge is born. 
    How observation is transformed into a word, and a word into an instrument of thought.
    
    Everything begins with observation. What is observed must be described in words 
    in such a way that the listener understands precisely what has been observed.
    
    The shortest possible description will be called a definition.
    A definition is the shortest description of what is observed, 
    sufficient for understanding by another person.
    
    A term is assigned to a definition. A term is a word assigned to a definition 
    for ease of use.
  `;

  return await audioService.generateLessonAudio({
    provider: 'elevenlabs',
    apiKey,
    text: lesson1Text,
    lessonId: '1',
    voiceId: '21m00Tcm4TlvDq8ikWAM' // Английский мужской голос
  });
}
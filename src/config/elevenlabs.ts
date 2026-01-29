// ElevenLabs Configuration for English Course
// Add this to your .env.local file:
// ELEVENLABS_API_KEY=sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274

export const ELEVENLABS_CONFIG = {
  apiKey: process.env.ELEVENLABS_API_KEY || '',
  
  // Voice IDs
  voices: {
    // Custom voices
    CUSTOM: 'kFVUJfjBCiv9orAbWhZN',  // Your custom voice ⭐
    DZULU: '8Hdxm8QJKOFknq47BhTz',   // dZulu custom voice
    DZULU2: 'ma4IY0Z4IUybdEpvYzBW',  // dZulu2 custom voice
    NEW: 'erDx71FK2teMZ7g6khzw',     // New voice
    
    // Built-in voices
    BELLA: 'EXAVITQu4vr4xnSDxMaL',   // Female Russian
    RACHEL: '21m00Tcm4TlvDq8ikWAM',  // Female calm
    DOMI: 'AZnzlk1XvdvUeBnXmlld',    // Female energetic
    ELLI: 'MF3mGyEYCl7XYWbV9V6O',    // Female young
    ADAM: 'pNInz6obpgDQGcFmaJgB',    // Male deep
    JOSH: 'TxGEqnHWrfWFTfGW9XjX',    // Male strong
    SAM: 'yoZ06aMxZJJ28mfd3POQ',     // Male low
    ANTONI: 'ErXwobaYiN019PkySvjV',  // Male soft
  },
  
  // Default settings
  defaultVoice: 'pNInz6obpgDQGcFmaJgB', // Adam - male deep voice
  model: 'eleven_multilingual_v2',
  
  // Voice settings
  stability: 0.5,
  similarityBoost: 0.75,
  
  // Proxy for geo-blocking bypass (if needed)
  proxy: 'https://elevenlabs-proxy-two.vercel.app/api/elevenlabs',
  
  // Fallback to Google TTS if ElevenLabs unavailable
  fallbackToGoogle: true,
}

export const VOICE_DESCRIPTIONS = {
  [ELEVENLABS_CONFIG.voices.CUSTOM]: 'Your Custom Voice (Male) ⭐',
  [ELEVENLABS_CONFIG.voices.DZULU]: 'dZulu Custom (Male)',
  [ELEVENLABS_CONFIG.voices.DZULU2]: 'dZulu2 Custom (Male)',
  [ELEVENLABS_CONFIG.voices.NEW]: 'New Voice (Male)',
  [ELEVENLABS_CONFIG.voices.BELLA]: 'Bella (Female, Russian)',
  [ELEVENLABS_CONFIG.voices.RACHEL]: 'Rachel (Female, Calm)',
  [ELEVENLABS_CONFIG.voices.DOMI]: 'Domi (Female, Energetic)',
  [ELEVENLABS_CONFIG.voices.ELLI]: 'Elli (Female, Young)',
  [ELEVENLABS_CONFIG.voices.ADAM]: 'Adam (Male, Deep)',
  [ELEVENLABS_CONFIG.voices.JOSH]: 'Josh (Male, Strong)',
  [ELEVENLABS_CONFIG.voices.SAM]: 'Sam (Male, Low)',
  [ELEVENLABS_CONFIG.voices.ANTONI]: 'Antoni (Male, Soft)',
}

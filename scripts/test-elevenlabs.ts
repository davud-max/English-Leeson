// Test ElevenLabs API access and get available voices
import axios from 'axios';

const ELEVENLABS_API_KEY = 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274';

async function testAPIAccess() {
  try {
    console.log('Testing ElevenLabs API access...');
    
    // Test getting voices
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });
    
    console.log('✅ API access successful!');
    console.log('Available voices:');
    response.data.voices.forEach((voice: any) => {
      console.log(`- ${voice.name} (${voice.voice_id})`);
    });
    
    return response.data.voices;
    
  } catch (error: any) {
    console.error('❌ API access failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.detail || error.message);
    
    if (error.response?.status === 401) {
      console.log('🔐 Invalid API key - please check your ElevenLabs API key');
    } else if (error.response?.status === 403) {
      console.log('🚫 Access forbidden - check your account status and subscription');
    }
    
    return null;
  }
}

async function generateSimpleTestAudio() {
  try {
    console.log('\nGenerating simple test audio...');
    
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
      {
        text: "This is a test of the ElevenLabs text to speech API.",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    
    console.log('✅ Test audio generated successfully!');
    console.log('Audio size:', response.data.byteLength, 'bytes');
    
    // Save test file
    const fs = require('fs');
    const path = require('path');
    
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const filePath = path.join(audioDir, 'test.mp3');
    fs.writeFileSync(filePath, Buffer.from(response.data));
    console.log('📁 Test audio saved to:', filePath);
    
  } catch (error: any) {
    console.error('❌ Test audio generation failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
  }
}

// Run tests
(async () => {
  const voices = await testAPIAccess();
  if (voices) {
    await generateSimpleTestAudio();
  }
})();
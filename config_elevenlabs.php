<?php
/**
 * config_elevenlabs.php - ElevenLabs Configuration
 * For English Course Site
 * Uses same API keys as Russian site (max2025.ru)
 */

// ElevenLabs API Key
define('ELEVENLABS_API_KEY', 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274');

// Voice IDs
define('ELEVENLABS_VOICE_BELLA', 'EXAVITQu4vr4xnSDxMaL');   // Female Russian
define('ELEVENLABS_VOICE_ADAM', 'pNInz6obpgDQGcFmaJgB');    // Male deep
define('ELEVENLABS_VOICE_ANTONI', 'ErXwobaYiN019PkySvjV');  // Male soft
define('ELEVENLABS_VOICE_DZULU', '8Hdxm8QJKOFknq47BhTz');   // Custom voice dZulu
define('ELEVENLABS_VOICE_DZULU2', 'ma4IY0Z4IUybdEpvYzBW');  // Custom voice dZulu2
define('ELEVENLABS_VOICE_CUSTOM', 'kFVUJfjBCiv9orAbWhZN');  // Custom voice ⭐
define('ELEVENLABS_VOICE_NEW', 'erDx71FK2teMZ7g6khzw');     // New voice

// English voices (native)
define('ELEVENLABS_VOICE_RACHEL', 'EXAVITQu4vr4xnSDxMaL');  // Rachel - Female English
define('ELEVENLABS_VOICE_JOSH', 'TxGEqnHWrfWFTfGW9XjX');    // Josh - Male English
define('ELEVENLABS_VOICE_ARNOLD', 'VR6AewLTigWG4xSOukaG');  // Arnold - Male English
define('ELEVENLABS_VOICE_ELLI', '21m00Tcm4TlvDq8ikWAM');    // Elli - Female English

// Default model
define('ELEVENLABS_MODEL', 'eleven_multilingual_v2');

// Default voice for quiz
define('ELEVENLABS_DEFAULT_VOICE', ELEVENLABS_VOICE_JOSH);

// Default voice for lessons (English)
define('ELEVENLABS_LESSON_VOICE', ELEVENLABS_VOICE_JOSH);

// Proxy for geo-blocking (if needed)
define('ELEVENLABS_PROXY', '');

// Fallback to Google TTS when ElevenLabs unavailable
define('ELEVENLABS_FALLBACK_TO_GOOGLE', true);
?>

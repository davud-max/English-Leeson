<?php
/**
 * ElevenLabs TTS API - Direct Call
 * For English Course Site
 * Can be used for quiz questions, short phrases, etc.
 */

require_once __DIR__ . '/config_elevenlabs.php';

/**
 * Generate speech from text using ElevenLabs
 * @param string $text Text to convert to speech
 * @param string $voiceId Voice ID (optional, uses default if not provided)
 * @return array ['success' => bool, 'audio' => binary data or 'error' => string]
 */
function elevenLabsTTS($text, $voiceId = null) {
    if (empty($text)) {
        return ['success' => false, 'error' => 'Empty text'];
    }
    
    $voiceId = $voiceId ?? ELEVENLABS_LESSON_VOICE;
    $apiKey = ELEVENLABS_API_KEY;
    
    // Use Vercel proxy for geo-blocking bypass
    $proxyUrl = 'https://elevenlabs-proxy-two.vercel.app/api/elevenlabs';
    
    $data = [
        'apiKey' => $apiKey,
        'voiceId' => $voiceId,
        'text' => strip_tags($text),
        'stability' => 0.5,
        'similarity_boost' => 0.75
    ];
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $proxyUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT => 60,
        CURLOPT_SSL_VERIFYPEER => false
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return ['success' => false, 'error' => "cURL: $error"];
    }
    
    if ($httpCode !== 200) {
        $errorData = json_decode($response, true);
        $errorMsg = $errorData['error'] ?? $errorData['message'] ?? "HTTP $httpCode";
        return ['success' => false, 'error' => $errorMsg];
    }
    
    $result = json_decode($response, true);
    
    if (isset($result['success']) && $result['success'] && isset($result['audio'])) {
        return ['success' => true, 'audio' => base64_decode($result['audio'])];
    } elseif (isset($result['audio_url'])) {
        // Fetch audio from URL
        $audioCh = curl_init($result['audio_url']);
        curl_setopt($audioCh, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($audioCh, CURLOPT_TIMEOUT, 30);
        $audioData = curl_exec($audioCh);
        curl_close($audioCh);
        
        return ['success' => true, 'audio' => $audioData];
    }
    
    return ['success' => false, 'error' => 'Unexpected response format'];
}

/**
 * Generate speech and save to file
 * @param string $text Text to convert
 * @param string $outputFile Path to save audio file
 * @param string $voiceId Voice ID (optional)
 * @return array ['success' => bool, 'file' => path or 'error' => string]
 */
function elevenLabsTTSToFile($text, $outputFile, $voiceId = null) {
    $result = elevenLabsTTS($text, $voiceId);
    
    if (!$result['success']) {
        return $result;
    }
    
    $dir = dirname($outputFile);
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }
    
    file_put_contents($outputFile, $result['audio']);
    
    return ['success' => true, 'file' => $outputFile, 'size' => strlen($result['audio'])];
}

// Direct API endpoint - return audio
if (basename($_SERVER['PHP_SELF']) === 'elevenlabs_tts.php' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    
    $input = json_decode(file_get_contents('php://input'), true);
    $text = $input['text'] ?? '';
    $voiceId = $input['voice_id'] ?? null;
    $returnBase64 = $input['base64'] ?? false;
    
    if (empty($text)) {
        echo json_encode(['success' => false, 'error' => 'No text provided']);
        exit;
    }
    
    $result = elevenLabsTTS($text, $voiceId);
    
    if ($result['success']) {
        if ($returnBase64) {
            echo json_encode([
                'success' => true,
                'audio' => base64_encode($result['audio']),
                'format' => 'mp3'
            ]);
        } else {
            header('Content-Type: audio/mpeg');
            header('Content-Length: ' . strlen($result['audio']));
            echo $result['audio'];
        }
    } else {
        echo json_encode($result);
    }
    exit;
}

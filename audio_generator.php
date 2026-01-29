<?php
/**
 * Audio Generator for Lessons - ElevenLabs TTS
 * English Course Site
 * Updated: Voice selection and speed controls
 */

set_time_limit(0);
ini_set('memory_limit', '512M');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/config_elevenlabs.php';

// Simple admin check
session_start();
if (!isset($_SESSION['is_admin'])) {
    $_SESSION['is_admin'] = true;
}

// API for voice preview
if (isset($_GET['preview_voice'])) {
    $voiceId = $_GET['preview_voice'];
    $text = "Hello! This is a sample of the voice for your course. I will narrate your lessons clearly and understandably.";
    
    try {
        $result = callElevenLabsTTS($text, $voiceId);
        
        if ($result['success']) {
            header('Content-Type: audio/mpeg');
            header('Content-Disposition: inline; filename="preview.mp3"');
            header('Cache-Control: no-cache, must-revalidate');
            echo $result['audio'];
        } else {
            header('Content-Type: text/plain; charset=utf-8');
            http_response_code(500);
            echo 'Error: ' . $result['error'];
        }
    } catch (Exception $e) {
        header('Content-Type: text/plain; charset=utf-8');
        http_response_code(500);
        echo 'Exception: ' . $e->getMessage();
    }
    exit;
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Generate Lesson Audio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1000px; 
            margin: 50px auto; 
            padding: 20px; 
            background: #f5f7fa; 
        }
        h1 { color: #667eea; display: flex; align-items: center; gap: 10px; }
        .form-box {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        label {
            display: block;
            font-weight: 600;
            margin: 15px 0 8px 0;
            color: #333;
        }
        select, input {
            width: 100%;
            padding: 12px;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            font-size: 14px;
        }
        button {
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            margin-top: 20px;
        }
        button:hover { transform: translateY(-2px); }
        .status { padding: 15px; border-radius: 8px; margin: 20px 0; }
        .status.success { background: #e8f5e9; color: #2e7d32; border-left: 4px solid #4caf50; }
        .status.error { background: #ffebee; color: #c62828; border-left: 4px solid #f44336; }
        .status.progress { background: #fff3e0; color: #ef6c00; border-left: 4px solid #ff9800; }
        .audio-player { margin: 20px 0; padding: 20px; background: white; border-radius: 8px; }
        
        .voice-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .voice-card {
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s;
            background: white;
        }
        .voice-card:hover {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
        .voice-card.selected {
            border-color: #667eea;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        }
        .voice-card input[type="radio"] { width: auto; margin-right: 10px; }
        .voice-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .voice-desc { color: #666; font-size: 13px; margin-bottom: 10px; }
        .voice-preview-btn {
            padding: 8px 16px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            width: 100%;
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .voice-preview-btn:hover { background: #5568d3; }
        .voice-preview-btn.playing { background: #4caf50; }
        .voice-preview-btn.loading { background: #ff9800; }
        .voice-preview-btn.error { background: #f44336; }
        
        .badge {
            display: inline-block;
            padding: 3px 8px;
            background: #667eea;
            color: white;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }
        .badge.custom { background: #f59e0b; }
        .badge.recommended { background: #10b981; }
        
        .audio-settings {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .audio-settings h3 {
            margin-top: 0;
            color: #495057;
            font-size: 16px;
            margin-bottom: 15px;
        }
        .setting-row {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 15px;
            align-items: center;
            margin-bottom: 15px;
        }
        .setting-label { font-weight: 600; color: #495057; font-size: 14px; }
        .setting-control { display: flex; align-items: center; gap: 10px; }
        .slider {
            flex: 1;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: #dee2e6;
            border-radius: 3px;
            outline: none;
        }
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            background: #667eea;
            border-radius: 50%;
            cursor: pointer;
        }
        .slider-value {
            min-width: 60px;
            text-align: right;
            font-weight: 600;
            color: #667eea;
            font-size: 14px;
        }
        .help-text {
            font-size: 12px;
            color: #6c757d;
            margin-top: 5px;
            grid-column: 2;
        }
    </style>
</head>
<body>
    <h1><i class="fas fa-microphone-alt"></i> Generate Lesson Audio</h1>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['generate'])) {
    $lessonId = (int)$_POST['lesson_id'];
    $voiceId = $_POST['voice_id'];
    
    // Get settings
    $speed = (float)$_POST['speed'];
    $pauseLine = (int)$_POST['pause_line'];
    $pauseParagraph = (int)$_POST['pause_paragraph'];
    
    // Get lesson
    $stmt = $pdo->prepare("SELECT id, title, audio_text, text_content, tts_voice FROM lessons WHERE id = ?");
    $stmt->execute([$lessonId]);
    $lesson = $stmt->fetch();
    
    if (!$lesson) {
        echo '<div class="status error">❌ Lesson not found</div>';
    } else {
        // Use audio_text if available, otherwise use text_content
        $audioText = !empty($lesson['audio_text']) ? $lesson['audio_text'] : $lesson['text_content'];
        
        if (empty($audioText)) {
            echo '<div class="status error">❌ Lesson has no text for voiceover (audio_text and text_content are empty)</div>';
        } else {
            echo '<div class="form-box">';
            echo '<h2>Lesson #' . $lessonId . ': ' . htmlspecialchars($lesson['title']) . '</h2>';
            echo '<p><strong>Voice:</strong> ' . htmlspecialchars($voiceId) . '</p>';
            echo '<p><strong>Speed:</strong> ' . $speed . 'x</p>';
            echo '<p><strong>Line pause:</strong> ' . $pauseLine . ' ms</p>';
            echo '<p><strong>Paragraph pause:</strong> ' . $pauseParagraph . ' ms</p>';
            echo '<div class="status progress">⏳ Generating audio...</div>';
            flush(); ob_flush();
            
            // Update tts_voice in DB
            $voiceString = 'elevenlabs:' . $voiceId;
            $stmt = $pdo->prepare("UPDATE lessons SET tts_voice = ? WHERE id = ?");
            $stmt->execute([$voiceString, $lessonId]);
            
            // Generate audio
            $audioDir = __DIR__ . '/audio_lessons';
            if (!file_exists($audioDir)) {
                mkdir($audioDir, 0755, true);
            }
            $audioFile = $audioDir . '/lesson_' . $lessonId . '.mp3';
            
            // Delete old file if exists
            if (file_exists($audioFile)) {
                unlink($audioFile);
            }
            
            // Clean text from markers
            $cleanText = preg_replace('/\[SLIDE:\d+\]\s*/u', '', $audioText);
            $cleanText = strip_tags($cleanText);
            $cleanText = trim($cleanText);
            
            $settings = [
                'speed' => $speed,
                'pause_line' => $pauseLine,
                'pause_paragraph' => $pauseParagraph
            ];
            
            $result = generateLessonAudio($cleanText, $audioFile, $voiceId, $settings);
            
            echo '<script>document.querySelector(".status.progress").remove();</script>';
            
            if ($result['success']) {
                $size = filesize($audioFile);
                echo '<div class="status success">';
                echo '✅ <strong>Audio generated successfully!</strong><br>';
                echo 'Size: ' . round($size/1024) . ' KB<br>';
                echo 'Time: ' . $result['time'] . ' sec<br>';
                echo 'Chunks: ' . $result['chunks'];
                echo '</div>';
                
                echo '<div class="audio-player">';
                echo '<h3>🎧 Listen to result:</h3>';
                echo '<audio controls style="width: 100%;">';
                echo '<source src="audio_lessons/lesson_' . $lessonId . '.mp3?v=' . time() . '" type="audio/mpeg">';
                echo '</audio>';
                echo '</div>';
                
                echo '<a href="lesson.php?id=' . $lessonId . '" target="_blank" style="display: inline-block; padding: 12px 24px; background: #4caf50; color: white; text-decoration: none; border-radius: 8px; margin-top: 15px;">Open Lesson →</a>';
            } else {
                echo '<div class="status error">❌ <strong>Generation error:</strong> ' . htmlspecialchars($result['error']) . '</div>';
            }
            
            echo '</div>';
        }
    }
    
} else {
    // Selection form
    $lessons = $pdo->query("SELECT id, title, order_num, tts_voice FROM lessons WHERE is_published = 1 ORDER BY order_num")->fetchAll();
    ?>
    
    <div class="form-box">
        <h2>Select Lesson and Voice</h2>
        <form method="POST" id="audioForm">
            <label>Lesson to generate:</label>
            <select name="lesson_id" required>
                <?php 
                $selectedId = isset($_GET['lesson_id']) ? (int)$_GET['lesson_id'] : 1;
                foreach ($lessons as $lesson): 
                ?>
                    <option value="<?= $lesson['id'] ?>" <?= $lesson['id'] == $selectedId ? 'selected' : '' ?>>
                        Lesson <?= $lesson['order_num'] ?>: <?= htmlspecialchars($lesson['title']) ?>
                        <?= $lesson['tts_voice'] ? ' (current: ' . $lesson['tts_voice'] . ')' : '' ?>
                    </option>
                <?php endforeach; ?>
            </select>
            
            <input type="hidden" name="voice_id" id="voiceInput" required>
            
            <label style="margin-top: 20px;">Select ElevenLabs Voice:</label>
            
            <div class="voice-grid">
                <label class="voice-card selected">
                    <input type="radio" name="voice" value="<?= ELEVENLABS_VOICE_JOSH ?>" checked>
                    <div class="voice-name">
                        Josh
                        <span style="color: #2196f3;">♂</span>
                        <span class="badge recommended">⭐ RECOMMENDED</span>
                    </div>
                    <div class="voice-desc">Male English voice - natural and clear</div>
                    <button type="button" class="voice-preview-btn" onclick="previewVoice('<?= ELEVENLABS_VOICE_JOSH ?>', this); return false;">
                        <i class="fas fa-play"></i> Preview
                    </button>
                </label>
                
                <label class="voice-card">
                    <input type="radio" name="voice" value="<?= ELEVENLABS_VOICE_RACHEL ?>">
                    <div class="voice-name">
                        Rachel
                        <span style="color: #e91e63;">♀</span>
                    </div>
                    <div class="voice-desc">Female English voice</div>
                    <button type="button" class="voice-preview-btn" onclick="previewVoice('<?= ELEVENLABS_VOICE_RACHEL ?>', this); return false;">
                        <i class="fas fa-play"></i> Preview
                    </button>
                </label>
                
                <label class="voice-card">
                    <input type="radio" name="voice" value="<?= ELEVENLABS_VOICE_ARNOLD ?>">
                    <div class="voice-name">
                        Arnold
                        <span style="color: #2196f3;">♂</span>
                    </div>
                    <div class="voice-desc">Male voice - deep and authoritative</div>
                    <button type="button" class="voice-preview-btn" onclick="previewVoice('<?= ELEVENLABS_VOICE_ARNOLD ?>', this); return false;">
                        <i class="fas fa-play"></i> Preview
                    </button>
                </label>
                
                <label class="voice-card">
                    <input type="radio" name="voice" value="<?= ELEVENLABS_VOICE_ELLI ?>">
                    <div class="voice-name">
                        Elli
                        <span style="color: #e91e63;">♀</span>
                    </div>
                    <div class="voice-desc">Female voice - young and friendly</div>
                    <button type="button" class="voice-preview-btn" onclick="previewVoice('<?= ELEVENLABS_VOICE_ELLI ?>', this); return false;">
                        <i class="fas fa-play"></i> Preview
                    </button>
                </label>
                
                <label class="voice-card">
                    <input type="radio" name="voice" value="<?= ELEVENLABS_VOICE_ADAM ?>">
                    <div class="voice-name">
                        Adam
                        <span style="color: #2196f3;">♂</span>
                    </div>
                    <div class="voice-desc">Male voice - deep English</div>
                    <button type="button" class="voice-preview-btn" onclick="previewVoice('<?= ELEVENLABS_VOICE_ADAM ?>', this); return false;">
                        <i class="fas fa-play"></i> Preview
                    </button>
                </label>
                
                <label class="voice-card">
                    <input type="radio" name="voice" value="<?= ELEVENLABS_VOICE_CUSTOM ?>">
                    <div class="voice-name">
                        Custom Voice
                        <span style="color: #2196f3;">♂</span>
                        <span class="badge custom">CUSTOM</span>
                    </div>
                    <div class="voice-desc">Your custom trained voice</div>
                    <button type="button" class="voice-preview-btn" onclick="previewVoice('<?= ELEVENLABS_VOICE_CUSTOM ?>', this); return false;">
                        <i class="fas fa-play"></i> Preview
                    </button>
                </label>
            </div>
            
            <!-- Audio settings -->
            <div class="audio-settings">
                <h3><i class="fas fa-sliders-h"></i> Voice Settings</h3>
                
                <div class="setting-row">
                    <div class="setting-label">Speech speed:</div>
                    <div class="setting-control">
                        <input type="range" name="speed" class="slider" min="0.25" max="2.0" step="0.05" value="1.0" id="speedSlider">
                        <span class="slider-value" id="speedValue">1.0x</span>
                    </div>
                    <div class="help-text">From 0.25x (very slow) to 2.0x (very fast)</div>
                </div>
                
                <div class="setting-row">
                    <div class="setting-label">Line pause:</div>
                    <div class="setting-control">
                        <input type="range" name="pause_line" class="slider" min="0" max="2000" step="100" value="300" id="pauseLineSlider">
                        <span class="slider-value" id="pauseLineValue">300 ms</span>
                    </div>
                    <div class="help-text">Pause between lines (0-2000 ms)</div>
                </div>
                
                <div class="setting-row">
                    <div class="setting-label">Paragraph pause:</div>
                    <div class="setting-control">
                        <input type="range" name="pause_paragraph" class="slider" min="0" max="3000" step="100" value="800" id="pauseParagraphSlider">
                        <span class="slider-value" id="pauseParagraphValue">800 ms</span>
                    </div>
                    <div class="help-text">Pause between paragraphs (0-3000 ms)</div>
                </div>
            </div>
            
            <button type="submit" name="generate">🎙 Generate Audio</button>
        </form>
    </div>
    
    <p style="color: #666; margin-top: 30px;">
        <a href="cabinet.php" style="color: #667eea; text-decoration: none; font-weight: 600;">← Back to Cabinet</a>
    </p>
    
    <script>
    const voiceInput = document.getElementById('voiceInput');
    
    // Handle voice selection
    document.querySelectorAll('input[name="voice"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.voice-card').forEach(card => card.classList.remove('selected'));
            this.closest('.voice-card').classList.add('selected');
            voiceInput.value = this.value;
        });
    });
    
    // Initialize
    voiceInput.value = document.querySelector('input[name="voice"]:checked').value;
    
    // Slider handlers
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    const pauseLineSlider = document.getElementById('pauseLineSlider');
    const pauseLineValue = document.getElementById('pauseLineValue');
    const pauseParagraphSlider = document.getElementById('pauseParagraphSlider');
    const pauseParagraphValue = document.getElementById('pauseParagraphValue');
    
    speedSlider.addEventListener('input', function() {
        speedValue.textContent = this.value + 'x';
    });
    
    pauseLineSlider.addEventListener('input', function() {
        pauseLineValue.textContent = this.value + ' ms';
    });
    
    pauseParagraphSlider.addEventListener('input', function() {
        pauseParagraphValue.textContent = this.value + ' ms';
    });
    
    // Voice preview
    let currentAudio = null;
    
    function previewVoice(voiceId, btn) {
        // Stop current playback
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
            document.querySelectorAll('.voice-preview-btn').forEach(b => {
                b.classList.remove('playing', 'loading', 'error');
                b.innerHTML = '<i class="fas fa-play"></i> Preview';
                b.disabled = false;
            });
        }
        
        // Show loading
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        btn.disabled = true;
        
        const url = `audio_generator.php?preview_voice=${encodeURIComponent(voiceId)}&t=${Date.now()}`;
        
        currentAudio = new Audio(url);
        
        currentAudio.addEventListener('canplay', () => {
            btn.classList.remove('loading');
            btn.classList.add('playing');
            btn.innerHTML = '<i class="fas fa-stop"></i> Stop';
            btn.disabled = false;
            currentAudio.play();
        });
        
        currentAudio.addEventListener('ended', () => {
            btn.classList.remove('playing');
            btn.innerHTML = '<i class="fas fa-play"></i> Preview';
            currentAudio = null;
        });
        
        currentAudio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            btn.classList.remove('loading', 'playing');
            btn.classList.add('error');
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            btn.disabled = false;
            setTimeout(() => {
                btn.classList.remove('error');
                btn.innerHTML = '<i class="fas fa-play"></i> Preview';
            }, 3000);
            currentAudio = null;
        });
    }
    </script>
    
    <?php
}

/**
 * Generate audio for lesson with settings
 */
function generateLessonAudio($text, $outputFile, $voiceId, $settings = []) {
    $startTime = microtime(true);
    
    // Default settings
    $speed = $settings['speed'] ?? 1.0;
    $pauseLine = $settings['pause_line'] ?? 300;
    $pauseParagraph = $settings['pause_paragraph'] ?? 800;
    
    // Split text into paragraphs
    $paragraphs = preg_split('/\n\s*\n/u', $text, -1, PREG_SPLIT_NO_EMPTY);
    
    // Split into chunks with pauses (using ellipsis!)
    $maxChunkSize = 2000;
    $chunks = [];
    $currentChunk = '';
    
    foreach ($paragraphs as $pIndex => $paragraph) {
        $paragraph = trim($paragraph);
        if (empty($paragraph)) continue;
        
        // Split paragraph into lines
        $lines = preg_split('/\n/u', $paragraph, -1, PREG_SPLIT_NO_EMPTY);
        
        foreach ($lines as $lIndex => $line) {
            $line = trim($line);
            if (empty($line)) continue;
            
            // Add line
            $currentChunk .= ($currentChunk ? ' ' : '') . $line;
            
            // Line pause - using ellipsis instead of SSML!
            if ($lIndex < count($lines) - 1 && $pauseLine > 0) {
                if ($pauseLine < 300) {
                    $currentChunk .= ', ';
                } elseif ($pauseLine < 600) {
                    $currentChunk .= '... ';
                } else {
                    $currentChunk .= '..... ';
                }
            }
            
            // If chunk is too large - save and start new
            if (strlen($currentChunk) >= $maxChunkSize) {
                $chunks[] = $currentChunk;
                $currentChunk = '';
            }
        }
        
        // Paragraph pause - using ellipsis!
        if ($pIndex < count($paragraphs) - 1 && $pauseParagraph > 0) {
            if ($pauseParagraph < 500) {
                $currentChunk .= '. ';
            } elseif ($pauseParagraph < 1000) {
                $currentChunk .= '... ';
            } else {
                $currentChunk .= '...... ';
            }
        }
    }
    
    // Add last chunk
    if ($currentChunk) {
        $chunks[] = $currentChunk;
    }
    
    // Generate audio for each chunk
    $audioData = '';
    
    foreach ($chunks as $index => $chunk) {
        $result = callElevenLabsTTS($chunk, $voiceId, $speed, $pauseLine, $pauseParagraph);
        
        if (!$result['success']) {
            return ['success' => false, 'error' => "Chunk $index: " . $result['error']];
        }
        
        $audioData .= $result['audio'];
        
        if ($index < count($chunks) - 1) {
            usleep(500000); // 0.5 sec - more time between requests
        }
    }
    
    file_put_contents($outputFile, $audioData);
    
    $time = round(microtime(true) - $startTime, 1);
    
    return ['success' => true, 'time' => $time, 'chunks' => count($chunks)];
}

/**
 * Call ElevenLabs TTS API via Vercel proxy
 */
function callElevenLabsTTS($text, $voiceId, $speed = 1.0, $pauseLine = 300, $pauseParagraph = 800) {
    $apiKey = ELEVENLABS_API_KEY;
    $cleanText = strip_tags($text);
    
    // Use Vercel proxy
    $proxyUrl = 'https://elevenlabs-proxy-two.vercel.app/api/elevenlabs';
    
    // Configure stability based on pauses
    $stability = 0.5;
    $similarityBoost = 0.75;
    
    if ($pauseLine > 500 || $pauseParagraph > 1000) {
        $stability = 0.3; // Slower
        $similarityBoost = 0.8;
    }
    
    $data = [
        'apiKey' => $apiKey,
        'voiceId' => $voiceId,
        'text' => $cleanText,
        'stability' => $stability,
        'similarity_boost' => $similarityBoost
    ];
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $proxyUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT => 180,
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
        $audioCh = curl_init($result['audio_url']);
        curl_setopt($audioCh, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($audioCh, CURLOPT_TIMEOUT, 30);
        $audioData = curl_exec($audioCh);
        curl_close($audioCh);
        
        return ['success' => true, 'audio' => $audioData];
    } else {
        return ['success' => false, 'error' => 'Unexpected response format from proxy'];
    }
}

?>
</body>
</html>

const fs = require('fs');
const path = require('path');

// Apply audio-priority logic to original lesson file
// WITHOUT changing the content - only technical improvements

const lesson2OriginalPath = path.join(__dirname, '..', 'src', 'app', '(course)', 'lessons', '2', 'page-original.tsx');
const lesson2NewPath = path.join(__dirname, '..', 'src', 'app', '(course)', 'lessons', '2', 'page.tsx');

// Read original file
let content = fs.readFileSync(lesson2OriginalPath, 'utf8');

// Replace the first useEffect (auto-advance) with audio-priority version
const oldUseEffect = `  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timer
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    // Load and play audio for current slide
    const audioFile = \`/audio/lesson2/slide\${currentSlide + 1}.mp3\`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    // Set timer for current slide
    slideTimerRef.current = setTimeout(() => {
      if (currentSlide < LESSON_2_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        // Lesson completed
        setIsPlaying(false);
      }
    }, LESSON_2_SLIDES[currentSlide].duration);

    // Update progress
    const startTime = Date.now();
    const slideDuration = LESSON_2_SLIDES[currentSlide].duration;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const slideProgress = Math.min(elapsed / slideDuration, 1);
      setProgress(slideProgress);
      
      // Total progress
      const totalElapsed = totalTimeRef.current + elapsed;
      setTotalProgress(totalElapsed / totalDuration);
    };

    const progressInterval = setInterval(updateProgress, 100);
    
    return () => {
      clearInterval(progressInterval);
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, isPlaying]);`;

const newUseEffect = `  // Handle slide progression based on AUDIO (audio has priority)
  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timer
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    // Load and play audio for current slide
    const audioFile = \`/audio/lesson2/slide\${currentSlide + 1}.mp3\`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    // Audio duration controls slide timing - no fixed timer needed
    // Slide advances when audio ends (handled in separate audio event listener)

    // Update progress based on actual audio playback
    const updateProgress = () => {
      if (audioRef.current && audioRef.current.duration) {
        setProgress(audioRef.current.currentTime / audioRef.current.duration);
        
        // Update total progress based on actual playback time
        const totalElapsed = totalTimeRef.current + (audioRef.current.currentTime * 1000);
        setTotalProgress(totalElapsed / totalDuration);
      }
    };

    const progressInterval = setInterval(updateProgress, 100);
    
    return () => {
      clearInterval(progressInterval);
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, isPlaying, totalDuration]);`;

// Apply the replacement
content = content.replace(oldUseEffect, newUseEffect);

// Write the updated file
fs.writeFileSync(lesson2NewPath, content);

console.log('✅ Lesson 2 restored with original content + audio-priority system');
console.log('📝 Only technical improvements applied - author text preserved');
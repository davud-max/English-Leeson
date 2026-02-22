#!/bin/bash
# Sync correct audio from ID-based folders to order-based folders
AUDIO_DIR="public/audio"

# Lesson 1: DB=20, lesson1/ has 24 — remove extras
echo "=== Lesson 1: removing extra audio (21-24) ==="
for i in 21 22 23 24; do
  rm -f "$AUDIO_DIR/lesson1/slide${i}.mp3"
done
echo "  Result: $(ls "$AUDIO_DIR/lesson1/"slide*.mp3 2>/dev/null | wc -l) files"

# Lesson 3: DB=11, lesson3/ has 14 (old), ID has 11 (correct)
echo "=== Lesson 3: copying 11 correct files from ID folder ==="
rm -f "$AUDIO_DIR/lesson3/"slide*.mp3
cp "$AUDIO_DIR/lesson-cmks5sag5000511nt31to9wor/"slide*.mp3 "$AUDIO_DIR/lesson3/"
echo "  Result: $(ls "$AUDIO_DIR/lesson3/"slide*.mp3 2>/dev/null | wc -l) files"

# Lesson 5: DB=21, lesson5/ has 13, ID has 21 (correct)
echo "=== Lesson 5: copying 21 correct files from ID folder ==="
rm -f "$AUDIO_DIR/lesson5/"slide*.mp3
cp "$AUDIO_DIR/lesson-cmks5sagq000911ntgmhf3vux/"slide*.mp3 "$AUDIO_DIR/lesson5/"
echo "  Result: $(ls "$AUDIO_DIR/lesson5/"slide*.mp3 2>/dev/null | wc -l) files"

# Lesson 19: DB=31, lesson19/ has 3, ID has 30 (correct)
echo "=== Lesson 19: copying correct files from ID folder ==="
rm -f "$AUDIO_DIR/lesson19/"slide*.mp3
cp "$AUDIO_DIR/lesson-cml3gks670003tvjhf8chtec4/"slide*.mp3 "$AUDIO_DIR/lesson19/"
echo "  Result: $(ls "$AUDIO_DIR/lesson19/"slide*.mp3 2>/dev/null | wc -l) files"

# Lesson 20: DB=18, lesson20/ has 30, ID has 18 (correct)
echo "=== Lesson 20: copying correct files from ID folder ==="
rm -f "$AUDIO_DIR/lesson20/"slide*.mp3
cp "$AUDIO_DIR/lesson-cml3gks6r0005tvjhvawycazw/"slide*.mp3 "$AUDIO_DIR/lesson20/"
echo "  Result: $(ls "$AUDIO_DIR/lesson20/"slide*.mp3 2>/dev/null | wc -l) files"

echo ""
echo "=== Verification ==="
for n in 1 2 3 4 5 19 20; do
  echo "  lesson${n}/: $(ls "$AUDIO_DIR/lesson${n}/"slide*.mp3 2>/dev/null | wc -l) files"
done

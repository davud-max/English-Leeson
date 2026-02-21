#!/bin/bash
# Sync correct audio from ID-based folders to order-based folders
AUDIO_DIR="public/audio"

# Lesson 3: DB=11, lesson3/ has 14 (old), ID has 11 (correct)
echo "=== Lesson 3: copying 11 correct files from ID folder ==="
rm -f "$AUDIO_DIR/lesson3/"slide*.mp3
cp "$AUDIO_DIR/lesson-cmks5sag5000511nt31to9wor/"slide*.mp3 "$AUDIO_DIR/lesson3/"
echo "  Result: $(ls "$AUDIO_DIR/lesson3/"slide*.mp3 | wc -l) files"

# Lesson 5: DB=21, lesson5/ has 13, ID has 21 (correct)
echo "=== Lesson 5: copying 21 correct files from ID folder ==="
rm -f "$AUDIO_DIR/lesson5/"slide*.mp3
cp "$AUDIO_DIR/lesson-cmks5sagq000911ntgmhf3vux/"slide*.mp3 "$AUDIO_DIR/lesson5/"
echo "  Result: $(ls "$AUDIO_DIR/lesson5/"slide*.mp3 | wc -l) files"

# Lesson 1: DB=20, lesson1/ has 24 — remove extras
echo "=== Lesson 1: removing extra audio (21-24) ==="
for i in 21 22 23 24; do
  rm -f "$AUDIO_DIR/lesson1/slide${i}.mp3"
done
echo "  Result: $(ls "$AUDIO_DIR/lesson1/"slide*.mp3 | wc -l) files"

echo ""
echo "=== Verification ==="
for n in 1 2 3 4 5; do
  echo "  lesson${n}/: $(ls "$AUDIO_DIR/lesson${n}/"slide*.mp3 | wc -l) files"
done

#!/usr/bin/env bash
set -euo pipefail

# Adds background music to all slide*.mp3 files of lesson 1.
# Default music file is the one provided by the user.
#
# Usage:
#   scripts/add-bg-music-lesson1.sh
#   scripts/add-bg-music-lesson1.sh "/absolute/path/to/music.mp3"
#
# Optional env vars:
#   SOURCE_DIR=public/audio/lesson1
#   OUTPUT_DIR=public/audio/lesson1_with_bg
#   BG_VOLUME=0.08
#   FADE_IN_SEC=1.2
#   FADE_OUT_SEC=1.5

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="${SOURCE_DIR:-$ROOT_DIR/public/audio/lesson1}"
OUTPUT_DIR="${OUTPUT_DIR:-$ROOT_DIR/public/audio/lesson1_with_bg}"
MUSIC_FILE="${1:-/Users/davudzulumkhanov/Downloads/Архив/фон.MP3}"
BG_VOLUME="${BG_VOLUME:-0.08}"
FADE_IN_SEC="${FADE_IN_SEC:-1.2}"
FADE_OUT_SEC="${FADE_OUT_SEC:-1.5}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg not found in PATH"
  exit 1
fi

if ! command -v ffprobe >/dev/null 2>&1; then
  echo "Error: ffprobe not found in PATH"
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: source dir not found: $SOURCE_DIR"
  exit 1
fi

if [[ ! -f "$MUSIC_FILE" ]]; then
  echo "Error: background music file not found: $MUSIC_FILE"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

shopt -s nullglob
slides=("$SOURCE_DIR"/slide*.mp3)

if [[ ${#slides[@]} -eq 0 ]]; then
  echo "Error: no slide*.mp3 found in $SOURCE_DIR"
  exit 1
fi

echo "Source dir : $SOURCE_DIR"
echo "Output dir : $OUTPUT_DIR"
echo "Music file : $MUSIC_FILE"
echo "Slides     : ${#slides[@]}"
echo

for input_file in "${slides[@]}"; do
  filename="$(basename "$input_file")"
  output_file="$OUTPUT_DIR/$filename"

  duration="$(ffprobe -v error -show_entries format=duration -of default=nokey=1:noprint_wrappers=1 "$input_file" || true)"
  if [[ -z "$duration" ]]; then
    echo "Skip $filename: cannot detect duration"
    continue
  fi

  fade_out_start="$(
    awk -v d="$duration" -v f="$FADE_OUT_SEC" 'BEGIN { s = d - f; if (s < 0) s = 0; printf "%.3f", s }'
  )"

  echo "Processing $filename (duration: ${duration}s)"
  ffmpeg -y \
    -i "$input_file" \
    -stream_loop -1 -i "$MUSIC_FILE" \
    -filter_complex "[1:a]volume=${BG_VOLUME},afade=t=in:st=0:d=${FADE_IN_SEC},afade=t=out:st=${fade_out_start}:d=${FADE_OUT_SEC}[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=2,alimiter=limit=0.95[out]" \
    -map "[out]" \
    -c:a libmp3lame -q:a 2 \
    "$output_file" \
    -loglevel error
done

echo
echo "Done. Files with background music are saved to:"
echo "  $OUTPUT_DIR"

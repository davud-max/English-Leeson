#!/usr/bin/env python3

# Read specific lines from lesson-editor page.tsx
# Lines 392-450 where generateAudio function is defined

file_path = "/Users/davudzulumkhanov/thinking-course-en/src/app/admin/lesson-editor/page.tsx"

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    print("🔍 Функция generateAudio (строки 392-450):")
    print("=" * 60)
    
    for i in range(391, min(450, len(lines))):
        print(f"{i+1:4d}: {lines[i]}", end='')
        
except FileNotFoundError:
    print(f"❌ Файл не найден: {file_path}")
except Exception as e:
    print(f"❌ Ошибка: {e}")

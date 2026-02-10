#!/usr/bin/env python3

file_path = "/Users/davudzulumkhanov/thinking-course-en/src/app/admin/lesson-editor/page.tsx"

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    print("🔍 Функция generateAudio ПРОДОЛЖЕНИЕ (строки 405-435):")
    print("=" * 60)
    
    for i in range(404, min(435, len(lines))):
        print(f"{i+1:4d}: {lines[i]}", end='')
        
except FileNotFoundError:
    print(f"❌ Файл не найден: {file_path}")
except Exception as e:
    print(f"❌ Ошибка: {e}")

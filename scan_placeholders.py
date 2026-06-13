import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

placeholders_found = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all img src attributes
    matches = re.findall(r'<img[^>]+src=[\'"]([^\'"]*)[\'"]', content)
    
    for match in matches:
        if not match or match == '#' or 'placeholder' in match.lower() or 'source.unsplash.com' in match or match.startswith('http'):
            print(f"File: {file} - Placeholder: {match}")
            placeholders_found += 1

print(f"Total placeholders found: {placeholders_found}")

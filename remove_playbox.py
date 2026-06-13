import os

files_to_check = [
    'explore.html',
    'feed.js',
    'style.css',
    'videos_data.js',
    'restore_curated.py',
    'implementation_plan.md',
    'task.md',
    'walkthrough.md'
]

# Ensure we also check all .html files just in case
for f in os.listdir('.'):
    if f.endswith('.html') and f not in files_to_check:
        files_to_check.append(f)

for filename in files_to_check:
    if not os.path.exists(filename):
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Replace occurrences
    content = content.replace('@Playbox', '@NextGenAI')
    content = content.replace('playbox-', 'nexa-')
    content = content.replace('Playbox', 'NextGen')
    
    if content != original:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned references in {filename}")

print("All Playbox references removed.")

import re

with open('explore.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all video data-src or src
videos = re.findall(r'data-src="([^"]+)"', content)
videos += re.findall(r'<source[^>]+src="([^"]+)"', content)

# Unique videos
videos = list(set(videos))

print(f"Found {len(videos)} unique videos.")
with open('extracted_videos.txt', 'w', encoding='utf-8') as f:
    for v in videos:
        f.write(v + '\n')

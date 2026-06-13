import json
import random

with open('extracted_videos.txt', 'r', encoding='utf-8') as f:
    videos = [line.strip() for line in f if line.strip()]

titles = ["Kissing", "Blowjob", "Nudify", "Edit Image", "POV Experience", "Girlfriend Vibes", "Woke Up Template", "Exclusive Render", "Neural Clone", "Behind the Scenes"]
actions = ["FREE TRIAL", "PICTURE", "VIP ONLY", "SUBSCRIBE"]

video_data = []
for i, v in enumerate(videos):
    # Randomly pick title, action, and a profile pic
    title = random.choice(titles)
    action = "FREE TRIAL" if "Blowjob" in title or "Kissing" in title else random.choice(actions)
    if "Nudify" in title or "Edit Image" in title:
        action = "PICTURE"
    
    # Profile pic from model_1 to model_8 or persona_*.png
    profile_pic = f"assets/model_{random.randint(1, 8)}.png"
    
    video_data.append({
        "id": f"vid_{i}",
        "src": v,
        "title": title,
        "action": action,
        "username": "@Playbox",
        "profile": profile_pic
    })

js_content = f"const exploreVideos = {json.dumps(video_data, indent=4)};\n"
with open('videos_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generated videos_data.js with {len(video_data)} items.")

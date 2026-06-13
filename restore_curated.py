import json

# Read the current videos_data.js
with open('videos_data.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Parse the JSON array
json_str = js_content.replace('const exploreVideos = ', '').replace(';', '').strip()
videos = json.loads(json_str)

# The curated top 8 videos that the user had originally
curated_videos = [
    {
        "id": "video1",
        "src": "assets/video_1.mp4",
        "title": "Kissing",
        "action": "FREE TRIAL",
        "username": "@NextGenAI",
        "profile": "assets/persona_soft.png"
    },
    {
        "id": "video2",
        "src": "assets/13186.mp4",
        "title": "Blowjob",
        "action": "FREE TRIAL",
        "username": "@NextGenAI",
        "profile": "assets/persona_provocative.png"
    },
    {
        "id": "video3",
        "src": "assets/20260217_162911545.mp4",
        "title": "Nudify",
        "action": "PICTURE",
        "username": "@NextGenAI",
        "profile": "assets/persona_naughty.png"
    },
    {
        "id": "video4",
        "src": "assets/video4c4c7265-1a6f-4bf2-9b7d-f1f8bc199bbe (1).mp4",
        "title": "Edit Image",
        "action": "PICTURE",
        "username": "@NextGenAI",
        "profile": "assets/persona_nerdy.png"
    },
    {
        "id": "video5",
        "src": "assets/videoe36f67a9-6722-456b-a63f-57de782224bd (1).mp4",
        "title": "Girlfriend Vibes",
        "action": "FREE TRIAL",
        "username": "@LunaLove",
        "profile": "assets/persona_modest.png"
    },
    {
        "id": "video6",
        "src": "assets/videoee0d5e03-1ad8-43d5-87ac-426c988f0587 (1).mp4",
        "title": "Woke Up Template",
        "action": "FREE TRIAL",
        "username": "@delulu",
        "profile": "assets/persona_topmodel.png"
    },
    {
        "id": "video7",
        "src": "assets/video8811ee00-a20b-4ab9-8d91-4d6fd5b4f5d4.mp4",
        "title": "POV Experience",
        "action": "VIP ONLY",
        "username": "@NextGenAI",
        "profile": "assets/persona_wild.png"
    },
    {
        "id": "video8",
        "src": "assets/videoef0b690d-adc0-494c-babf-61a98b01b72f.mp4",
        "title": "Neural Clone",
        "action": "FREE TRIAL",
        "username": "@NextGenAI",
        "profile": "assets/model_1.png"
    }
]

curated_srcs = [v['src'] for v in curated_videos]

# Remove the curated videos from the main array to avoid duplicates
filtered_videos = [v for v in videos if v['src'] not in curated_srcs]

# Prepend the curated videos
final_videos = curated_videos + filtered_videos

# Write back to videos_data.js
js_content_new = f"const exploreVideos = {json.dumps(final_videos, indent=4)};\n"
with open('videos_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content_new)

print("Restored curated videos to the top of the feed!")

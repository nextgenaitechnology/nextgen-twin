import os
import glob
import random

ROOT_DIR = r"c:\Github\NEXT GEN TWIN"
ASSETS_DIR = os.path.join(ROOT_DIR, "assets")
COMMUNITY_FILE = os.path.join(ROOT_DIR, "community.html")

img_patterns = [os.path.join(ASSETS_DIR, '**', '*.png'), os.path.join(ASSETS_DIR, '**', '*.jpg')]
all_images = []
for p in img_patterns:
    all_images.extend(glob.glob(p, recursive=True))

all_images = [img for img in all_images if "login-banner" not in img and "ui" not in img]

CREATORS = [
    ("Luna Love", "LunaLoveX", "#ff6b6b"), 
    ("Lexi Spark", "LexiSpark", "#4ecdc4"), 
    ("Goth Raven", "GothRaven", "#45b7d1"), 
    ("Ruby Rose", "RubyRose_OF", "#f7fff7"), 
    ("Mia Secret", "MiaSecret_", "#ffe66d"),
    ("Jade Fox", "JadeFox", "#845ec2"),
    ("Bella Thorn", "BellaT_OF", "#d65db1"),
    ("Chloe Star", "ChloeStar", "#ff9671"),
    ("Zoe Wild", "ZoeWild", "#ffc75f"),
    ("Aria Moon", "AriaMoon", "#f9f871")
]

# NEW SAFE BUT UNCENSORED TESTIMONIALS
TESTIMONIALS = [
    "While other platforms ban creators, NextGenTwin gives us the freedom to monetize our VERIFIED likeness safely. The NSFW capabilities are exactly what my fans asked for!",
    "Finally, an AI platform built FOR adult creators! We opt-in, we set the rules, and our fans get the high-quality customized content they desire. Safe, consensual, and highly profitable.",
    "The precision of this AI is groundbreaking. No more deformed hands or wasted credits! My fans love using my official, verified template to create custom scenarios.",
    "I was tired of getting banned on mainstream AI sites for creating artistic NSFW content. Here, my verified identity is protected, and my fans get what they want. Win-win!",
    "This is exactly what the creator economy needed. A secure place where we can offer consensual NSFW AI content without dealing with restrictive puritan filters.",
    "Stop wasting time with bots that don't understand context. NextGenTwin processes my authorized templates perfectly. Pure perfection and complete creative freedom.",
    "The fact that my fans can use my official template and it just WORKS without messing up my face... 🤯 Best passive income I've ever made. 100% creator controlled!",
    "Literally the only AI platform that supports adult creators instead of shadowbanning us. My subscribers are begging for more of these custom verified videos.",
    "I used to spend hours trying to get the right pose. With the prompt assist here, it's done in 5 seconds. And because I verified my identity, I know it's safe.",
    "Where others refuse to innovate, NextGenTwin embraces adult creators. It's so refreshing to offer explicit content that is 100% consensual and verified."
]

html_posts = []

for i in range(20):
    creator = random.choice(CREATORS)
    name, username, color = creator
    initial = name[0]
    time_ago = f"{random.randint(1, 23)} hours ago"
    text = random.choice(TESTIMONIALS)
    
    img_path = random.choice(all_images) if all_images else ""
    rel_path = os.path.relpath(img_path, ROOT_DIR)
    posix_rel = rel_path.replace('\\', '/')
    
    likes = f"{random.randint(1, 9)}.{random.randint(1, 9)}k" if random.random() > 0.5 else str(random.randint(300, 999))
    comments = str(random.randint(40, 450))
    
    post = f"""
        <!-- Generated Post {i+1} -->
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar" style="background: {color}; color: #000;">{initial}</div>
                <div class="post-user">
                    <div class="post-username">{name} <span style="color:#888; font-weight:400; font-size:13px;">@{username}</span> <span style="color:#3182ce;">✓</span></div>
                    <div class="post-time">{time_ago}</div>
                </div>
                <div class="vip-tag" style="background: rgba(49,130,206,0.2); color: #3182ce; border: 1px solid #3182ce; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 800;">VERIFIED OPT-IN CREATOR</div>
            </div>
            <div class="post-text">
                {text}
            </div>
            <div class="post-media">
                <img src="{posix_rel}" alt="Creator Content">
            </div>
            <div class="post-actions">
                <button class="action-btn liked"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> {likes}</button>
                <button class="action-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> {comments}</button>
                <button class="action-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> Share</button>
            </div>
        </div>"""
    html_posts.append(post)

with open(COMMUNITY_FILE, 'r', encoding='utf-8') as f:
    comm_content = f.read()

start_idx = comm_content.find('<!-- Generated Post 1 -->')
end_idx = comm_content.find('</div>\n</body>')

if start_idx != -1 and end_idx != -1:
    new_feed = "\n".join(html_posts)
    new_comm = comm_content[:start_idx] + new_feed + "\n    " + comm_content[end_idx:]
    with open(COMMUNITY_FILE, 'w', encoding='utf-8') as f:
        f.write(new_comm)
    print("Injected 20 CONSENSUAL community posts.")
else:
    print("Could not find insertion points in community.html")


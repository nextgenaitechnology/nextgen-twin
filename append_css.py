import os

css = """
/* =========================================
   PLAYBOX MASONRY GRID (EXPLORE FEED)
   ========================================= */

.playbox-masonry {
    column-count: 2;
    column-gap: 12px;
    padding: 0;
    width: 100%;
}

@media (min-width: 768px) {
    .playbox-masonry {
        column-count: 3;
        column-gap: 16px;
    }
}

@media (min-width: 1024px) {
    .playbox-masonry {
        column-count: 4;
        column-gap: 20px;
    }
}

.playbox-card {
    break-inside: avoid;
    margin-bottom: 12px;
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    background: #111;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transform: translateZ(0); /* Force hardware acceleration */
}

/* Stagger heights slightly for masonry effect if videos haven't loaded */
.playbox-card:nth-child(even) {
    min-height: 240px;
}
.playbox-card:nth-child(odd) {
    min-height: 300px;
}

.playbox-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
}

.playbox-author-thumb {
    position: absolute;
    top: 12px;
    left: 12px;
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    z-index: 2;
    border: 1px solid rgba(255,255,255,0.1);
}

.playbox-info-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 60px 12px 16px;
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 100%);
    text-align: center;
    z-index: 2;
    pointer-events: none; /* Let clicks pass through to overlay */
}

.playbox-title {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 2px 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.8);
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.5px;
}

.playbox-username {
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    margin: 0 0 12px 0;
    font-weight: 500;
}

.playbox-btn {
    display: inline-block;
    background: #1877f2; /* Exact blue from Playbox */
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    padding: 6px 16px;
    border-radius: 20px;
    text-transform: uppercase;
    border: none;
    letter-spacing: 0.5px;
    pointer-events: auto; /* Buttons should be clickable */
    box-shadow: 0 4px 12px rgba(24, 119, 242, 0.4);
}

.playbox-click-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
}

/* Fix mobile padding so cards aren't squished to screen edge */
@media (max-width: 767px) {
    .playbox-masonry {
        padding: 0 8px;
    }
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print("CSS appended to style.css")

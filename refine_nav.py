css = """
/* =========================================
   NAVIGATION REFINEMENTS
   ========================================= */

/* Top Navbar Glassmorphism */
.navbar {
    background: rgba(10, 11, 12, 0.8) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
}

/* Bottom Mobile Nav Glassmorphism */
.mobile-bottom-nav {
    background: rgba(10, 11, 12, 0.85) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.6) !important;
    padding-bottom: env(safe-area-inset-bottom, 16px) !important;
}

/* Nav Link Hover & Active Polish */
.mobile-nav-item {
    transition: all 0.3s ease !important;
}

.mobile-nav-item:active {
    transform: scale(0.9) !important;
}

.mobile-nav-item.active {
    color: #ff3366 !important;
    text-shadow: 0 0 10px rgba(255, 51, 102, 0.5) !important;
}

.mobile-nav-item.active svg {
    filter: drop-shadow(0 0 4px rgba(255, 51, 102, 0.5)) !important;
    transform: translateY(-2px) !important;
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print("Nav refinements injected!")

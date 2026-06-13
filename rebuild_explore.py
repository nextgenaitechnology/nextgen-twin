import re

# Read original explore.html
with open('explore.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the end of filters-container
match = re.search(r'(<div class="filters-container">.*?</button>\s*</div>\s*</div>)', html, re.DOTALL)
if match:
    header_part = html[:match.end()]
else:
    print("Could not find filters-container")
    exit(1)

# Read the end of explore.html to get the bottom nav
match_footer = re.search(r'(<nav class="mobile-bottom-nav">.*</html>)', html, re.DOTALL)
if match_footer:
    footer_part = match_footer.group(1)
else:
    # Fallback to standard footer if not found
    footer_part = """
    <nav class="mobile-bottom-nav">
        <a href="explore.html" class="mobile-nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            Explore
        </a>
        <a href="collection.html" class="mobile-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            Collection
        </a>
        <a href="studio.html" class="mobile-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            Studio
        </a>
        <a href="community.html" class="mobile-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Community
        </a>
    </nav>
    <script src="videos_data.js"></script>
    <script src="feed.js"></script>
    <script src="app.js"></script>
</body>
</html>
"""

new_explore = header_part + """
    <div style="max-width: 1400px; margin: 0 auto; padding: 16px;">
        <!-- Premium Adult Templates Section (Optional header, keeping it brief) -->
        <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div>
                    <h2 class="nexa-title" style="font-size: 24px; display: inline-flex; align-items: center; gap: 8px;">
                        🔥 Trending Templates
                    </h2>
                </div>
            </div>
        </div>

        <div class="playbox-masonry" id="exploreFeed">
            <!-- Dynamically injected by feed.js -->
        </div>
        
        <div id="loadingSpinner" style="text-align: center; padding: 40px; display: none;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #e60000; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
    </div>
""" + footer_part

# Ensure scripts are correct in the footer
new_explore = new_explore.replace('<script src="app.js"></script>', '<script src="videos_data.js"></script>\n    <script src="feed.js"></script>\n    <script src="app.js"></script>')

with open('explore.html', 'w', encoding='utf-8') as f:
    f.write(new_explore)

print("explore.html has been successfully rebuilt!")

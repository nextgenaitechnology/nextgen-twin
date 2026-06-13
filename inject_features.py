import glob
import re

html_files = glob.glob('c:\\Github\\NEXT GEN TWIN\\*.html')

# PWA meta tags to inject after <meta name="viewport"...>
pwa_tags = '''    <meta name="theme-color" content="#0a0b0c">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#0a0b0c">
    <link rel="manifest" href="manifest.json">'''

# Credit balance HTML to inject in nav-right
credit_html = '''<a href="daily-rewards.html" class="nav-link" style="color: #ffd700;">🎰</a>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); padding: 8px 14px; border-radius: 20px; font-weight: 700; font-size: 14px; color: #3182ce; cursor: pointer;" onclick="window.location.href='recharge.html'">
                ★ 450
            </div>'''

skip_files = ['daily-rewards.html', 'creator.html', 'queue.html', 'login.html', 'register.html', 'become-creator.html', 'index.html']

for f in html_files:
    basename = f.split('\\')[-1]
    if basename in skip_files:
        continue
    
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    modified = False
    
    # Add PWA meta tags if not present
    if 'manifest.json' not in content:
        content = content.replace('</head>', pwa_tags + '\n</head>')
        modified = True
    
    # Add credit balance to nav-right if nav-right exists and credit display not present
    if 'nav-right' in content and '★ 450' not in content and 'credit-display' not in content:
        # Insert credit display before profile-pic in nav-right
        content = content.replace(
            '<div class="nav-right">',
            '<div class="nav-right">\n            ' + credit_html
        )
        modified = True
    
    if modified:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Updated: {basename}')
    else:
        print(f'Skipped (already updated): {basename}')

print('\nDone! PWA + Credit Balance injected.')

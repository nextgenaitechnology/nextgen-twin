import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
assets = set(os.listdir('assets')) if os.path.exists('assets') else set()

if os.path.exists('assets/explore/4k'):
    for f in os.listdir('assets/explore/4k'):
        assets.add(f'explore/4k/{f}')

errors = {
    'broken_links': [],
    'missing_assets': [],
}

valid_htmls = set(html_files)

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Check links
        links = re.findall(r'href="([^"]+)"', content)
        for link in links:
            if link.startswith('http') or link.startswith('#') or link.startswith('mailto:') or '?' in link:
                continue
            if link.endswith('.css') or link.endswith('.json') or link.endswith('.png'):
                continue
            if link not in valid_htmls:
                errors['broken_links'].append(f"{html_file}: references missing file '{link}'")

        # Check sources
        srcs = re.findall(r'src="([^"]+)"', content)
        datasrcs = re.findall(r'data-src="([^"]+)"', content)
        for src in srcs + datasrcs:
            if src.startswith('http') or src.startswith('data:'):
                continue
            
            # e.g. assets/file.mp4
            if src.startswith('assets/'):
                asset_name = src[7:]
                # We don't have a perfect recursive check right now, but let's check basic existance
                if not os.path.exists(src):
                    errors['missing_assets'].append(f"{html_file}: missing asset '{src}'")
            elif not os.path.exists(src):
                errors['missing_assets'].append(f"{html_file}: missing asset '{src}'")

print("--- AUDIT RESULTS ---")
print(f"Checked {len(html_files)} HTML files.")
print(f"Broken Links: {len(errors['broken_links'])}")
for e in set(errors['broken_links']):
    print(e)
print(f"Missing Assets: {len(errors['missing_assets'])}")
for e in list(set(errors['missing_assets']))[:20]: # show top 20
    print(e)
if len(errors['missing_assets']) > 20:
    print(f"... and {len(errors['missing_assets']) - 20} more missing assets")

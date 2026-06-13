import os
import glob
import re

html_files = glob.glob('c:\\Github\\NEXT GEN TWIN\\*.html')

banner_regex = re.compile(r'<img src="assets/login-banner\.jpg"[^>]*>\n?', re.IGNORECASE)
old_logo_regex = re.compile(r'<div class="logo">.*?<svg[^>]*class="logo-icon">.*?</svg>.*?<div class="logo-text">.*?<span class="next">Next</span><span class="gen">Gen</span><br>.*?<span class="tech">Technology</span>.*?</div>.*?</div>', re.DOTALL)

new_logo = '''<a href="explore.html" class="logo" style="text-decoration: none;">
                <div class="logo-text" style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                    <span style="color: #fff;">Next</span><span style="color: #e60000;">Gen</span>
                </div>
            </a>'''

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = banner_regex.sub('', content)
    content = old_logo_regex.sub(new_logo, content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Done updating headers!")

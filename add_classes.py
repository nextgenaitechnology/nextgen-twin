import os
import re
import glob

def process_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the mapping of text words to classes
    # e.g., if button contains "Publish", add "publish-btn"
    mappings = [
        (r'\b(Publish)\b', 'publish-btn'),
        (r'\b(Download)\b', 'download-btn'),
        (r'\b(Save|Bookmark)\b', 'save-btn'),
        (r'\b(Subscribe)\b', 'subscribe-btn'),
        (r'\b(Train)\b', 'train-btn'),
        (r'\b(Generate)\b', 'generate-btn'),
        (r'\b(Share)\b', 'share-btn'),
        (r'\b(Follow)\b', 'follow-btn'),
        (r'\b(Withdraw)\b', 'withdraw-btn'),
        (r'\b(Support)\b', 'support-btn'),
        (r'\b(Connect)\b', 'connect-btn'),
        (r'\b(Retry)\b', 'retry-btn'),
        (r'\b(Like)\b', 'like-btn'),
        (r'\b(Comment)\b', 'comment-btn')
    ]

    def replacer(match):
        full_tag = match.group(0)
        inner_text = match.group(3)
        tag_type = match.group(1).lower()

        # Check if the tag already has the right class
        new_tag = full_tag
        added_classes = []
        for pattern, cls in mappings:
            if re.search(pattern, inner_text, re.IGNORECASE):
                if f'class=' in new_tag:
                    if cls not in new_tag:
                        # Append to existing class
                        new_tag = re.sub(r'class="([^"]*)"', f'class="\\1 {cls}"', new_tag)
                        added_classes.append(cls)
                else:
                    # Add class attribute
                    new_tag = re.sub(r'>(.*)$', f' class="{cls}">\\1', new_tag)
                    added_classes.append(cls)

        return new_tag

    # Match <button ...>Text</button> or <a ...>Text</a>
    # group 1: tag name
    # group 2: attributes
    # group 3: >
    # group 4: inner text (can contain other tags, but we'll do simple match)
    
    # Actually, a simpler way is just to regex replace button and a tags
    new_content = re.sub(r'<(button|a)([^>]*)>(.*?)</\1>', replacer, content, flags=re.IGNORECASE | re.DOTALL)
    
    # Also input type=button or type=submit
    def replacer_input(match):
        full_tag = match.group(0)
        value_attr = re.search(r'value="([^"]*)"', full_tag, re.IGNORECASE)
        if not value_attr:
            return full_tag
        inner_text = value_attr.group(1)
        new_tag = full_tag
        for pattern, cls in mappings:
            if re.search(pattern, inner_text, re.IGNORECASE):
                if f'class=' in new_tag:
                    if cls not in new_tag:
                        new_tag = re.sub(r'class="([^"]*)"', f'class="\\1 {cls}"', new_tag)
                else:
                    new_tag = new_tag.replace('/>', f' class="{cls}"/>').replace('>', f' class="{cls}">')
        return new_tag

    new_content = re.sub(r'<input[^>]*type="(button|submit)"[^>]*>', replacer_input, new_content, flags=re.IGNORECASE)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

for file in glob.glob('*.html'):
    process_html_file(file)

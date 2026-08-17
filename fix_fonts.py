import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove inline font-family
html = re.sub(r"font-family:\s*'Press Start 2P',\s*cursive;?\s*", "", html)

# Replace tiny fonts
html = html.replace('font-size: 8px;', 'font-size: 14px;')
html = html.replace('font-size: 9px;', 'font-size: 16px;')
html = html.replace('font-size: 18px;', 'font-size: 24px; font-weight: 700;')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated inline styles in index.html')

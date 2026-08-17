import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove inline font-family
css = re.sub(r"font-family:\s*'Press Start 2P',\s*cursive;?\s*", "", css)

# Replace tiny fonts
css = css.replace('font-size: 8px;', 'font-size: 14px;')
css = css.replace('font-size: 10px;', 'font-size: 14px;')

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated inline styles in style.css')

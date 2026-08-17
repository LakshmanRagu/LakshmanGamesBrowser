import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

style_match = re.search(r'<style>([\s\S]*?)</style>', html, re.IGNORECASE)
if style_match:
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(style_match.group(1).strip())

script_matches = re.findall(r'<script>([\s\S]*?)</script>', html)
if script_matches:
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(script_matches).strip())

new_html = re.sub(r'<style>[\s\S]*?</style>', '<link rel="stylesheet" href="css/style.css">', html, count=1, flags=re.IGNORECASE)
new_html = re.sub(r'<script>[\s\S]*?</script>', '', new_html)
new_html = new_html.replace('</body>', '    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js"></script>\n    <script src="js/app.js"></script>\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print('Done splitting!')

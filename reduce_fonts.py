import re

def reduce_fonts(text):
    def replacer(match):
        size = int(match.group(1))
        # Reduction logic for Press Start 2P
        if size >= 24: new_size = 14
        elif size >= 20: new_size = 12
        elif size >= 16: new_size = 10
        elif size >= 14: new_size = 9
        elif size >= 12: new_size = 8
        else: new_size = size
        return f"font-size: {new_size}px"
        
    return re.sub(r'font-size:\s*(\d+)px', replacer, text)

# Process style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()
with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(reduce_fonts(css))

# Process index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(reduce_fonts(html))

print("Fonts scaled down successfully.")

import urllib.request
import re
import os

urls = [
    'https://insideoyo.com/12-things-you-may-not-know-about-lamidi-adedibu/',
    'https://oyoinsight.com/adedibu-12-years-after-by-dare-adeniran/'
]

os.makedirs('public/assets/downloads', exist_ok=True)
downloaded = []

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            imgs = re.findall(r'https?://[^\s"\'<>]+\.(?:jpg|png|jpeg)', html)
            for img in imgs:
                img_lower = img.lower()
                if 'adedibu' in img_lower:
                    fn = os.path.basename(img.split('?')[0])
                    dest = os.path.join('public/assets/downloads', fn)
                    try:
                        print(f"Downloading {img} -> {dest}")
                        img_req = urllib.request.Request(img, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(img_req, timeout=10) as ir, open(dest, 'wb') as out:
                            out.write(ir.read())
                        downloaded.append(dest)
                    except Exception as de:
                        print(f"Error downloading {img}: {de}")
    except Exception as e:
        print(f"Error reading {url}: {e}")

print("Downloaded:", downloaded)

#!/usr/bin/env python3
"""
Automated Archival Imagery & Transparent Cutout Fetcher
Pulls public domain, historical, and transparent PNG cutout assets
from Wikimedia Commons and Wikipedia APIs (100% free, no API key).
"""

import os
import sys
import re
import argparse
import urllib.request
import urllib.parse
import json
from PIL import Image

USER_AGENT = "MotionGraphicsProductionStudio/1.0 (educational-documentary-tool)"

def has_transparency(img_path):
    """Checks if an image has an alpha channel with actual transparent pixels."""
    try:
        with Image.open(img_path) as im:
            if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
                alpha = im.convert('RGBA').split()[-1]
                # Check if any pixel has alpha < 250
                extrema = alpha.getextrema()
                return extrema[0] < 250
    except Exception:
        pass
    return False

def search_wikipedia_lead(topic):
    """Fetches high-res lead biographical/historical photo from Wikipedia."""
    endpoint = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "prop": "pageimages|extracts",
        "titles": topic,
        "pithumbsize": 1600,
        "exintro": True,
        "explaintext": True,
        "redirects": 1
    }
    url = f"{endpoint}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
        pages = data.get("query", {}).get("pages", {})
        for _, pdata in pages.items():
            thumb = pdata.get("thumbnail")
            if thumb:
                return {
                    "title": pdata.get("title"),
                    "url": thumb.get("source"),
                    "width": thumb.get("width"),
                    "height": thumb.get("height"),
                    "type": "biographical_lead"
                }
    except Exception as e:
        print(f"⚠️ Wikipedia query warning: {e}")
    return None

def search_commons(query, is_cutout=False, limit=5):
    """Searches Wikimedia Commons File namespace for media items."""
    endpoint = "https://commons.wikimedia.org/w/api.php"
    search_term = f"{query} png" if is_cutout else query
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": search_term,
        "gsrnamespace": 6,  # File namespace
        "gsrlimit": limit * 2,
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "iiurlwidth": 1400
    }
    url = f"{endpoint}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    results = []
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
        pages = data.get("query", {}).get("pages", {})
        for _, pdata in pages.items():
            imageinfo = pdata.get("imageinfo", [{}])[0]
            thumb_url = imageinfo.get("thumburl") or imageinfo.get("url")
            mime = imageinfo.get("mime", "")
            if not thumb_url:
                continue
            if is_cutout and "png" not in mime.lower():
                continue
            results.append({
                "title": pdata.get("title", "").replace("File:", ""),
                "url": thumb_url,
                "width": imageinfo.get("thumbwidth") or imageinfo.get("width"),
                "height": imageinfo.get("thumbheight") or imageinfo.get("height"),
                "mime": mime
            })
            if len(results) >= limit:
                break
    except Exception as e:
        print(f"⚠️ Commons search warning: {e}")
    return results

def download_asset(url, save_path):
    """Downloads an image from URL and saves locally."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req) as resp, open(save_path, "wb") as f:
        f.write(resp.read())

def fetch_assets(query, mode="all", limit=4, output_dir="public/assets/downloads"):
    os.makedirs(output_dir, exist_ok=True)
    clean_query = re.sub(r'[^a-zA-Z0-9\s]', '', query).strip()
    slug = re.sub(r'[^a-zA-Z0-9_\-]', '', clean_query.lower().replace(" ", "-"))[:25]
    if not slug:
        slug = "archive-asset"
    print(f"🔍 Searching archival & cutout assets for: \"{clean_query}\" (mode: {mode})...")
    
    candidates = []
    
    # 1. Grab Wikipedia lead portrait/photo
    if mode in ("archival", "all"):
        lead = search_wikipedia_lead(query)
        if lead:
            candidates.append(lead)
            
    # 2. Commons historical/archival photos
    if mode in ("archival", "all"):
        photos = search_commons(query, is_cutout=False, limit=limit)
        candidates.extend(photos)
        
    # 3. Transparent PNG cutouts / isolated items
    if mode in ("cutout", "all"):
        cutouts = search_commons(f"{query} transparent", is_cutout=True, limit=limit)
        if not cutouts:
            cutouts = search_commons(f"{query} isolated", is_cutout=True, limit=limit)
        candidates.extend(cutouts)
        
    downloaded = []
    for idx, item in enumerate(candidates):
        if len(downloaded) >= limit:
            break
        url = item.get("url")
        if not url:
            continue
        ext = ".png" if "png" in item.get("mime", "").lower() or ".png" in url.lower() else ".jpg"
        filename = f"{slug}-{idx + 1}{ext}"
        filepath = os.path.join(output_dir, filename)
        
        try:
            download_asset(url, filepath)
            is_alpha = has_transparency(filepath) if ext == ".png" else False
            remotion_path = f"/assets/downloads/{filename}"
            downloaded.append({
                "title": item.get("title", f"Asset {idx+1}"),
                "localPath": remotion_path,
                "diskPath": filepath,
                "isCutout": is_alpha,
                "width": item.get("width"),
                "height": item.get("height"),
                "sourceUrl": url
            })
            tag = "✂️ TRANSPARENT CUTOUT" if is_alpha else "📷 ARCHIVAL PHOTO"
            print(f"  + Downloaded: {filename} [{tag}]")
        except Exception as e:
            print(f"  x Failed downloading {url}: {e}")
            
    manifest_path = os.path.join(output_dir, f"{slug}-manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(downloaded, f, indent=2)
        
    print(f"\n✅ Fetched {len(downloaded)} assets saved to: {output_dir}")
    print(f"📄 Manifest written to: {manifest_path}\n")
    return downloaded

def main():
    parser = argparse.ArgumentParser(description="Fetch Archival & Transparent Cutouts")
    parser.add_argument("query", type=str, help="Search query or historical entity")
    parser.add_argument("--mode", type=str, default="all", choices=["archival", "cutout", "all"])
    parser.add_argument("--limit", type=int, default=3)
    parser.add_argument("--output", type=str, default="public/assets/downloads")
    
    args = parser.parse_args()
    fetch_assets(args.query, mode=args.mode, limit=args.limit, output_dir=args.output)

if __name__ == "__main__":
    main()

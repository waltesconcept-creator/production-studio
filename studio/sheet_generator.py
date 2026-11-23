#!/usr/bin/env python3
"""
High-Resolution Production Sheet Generator (Nano Banana 2 Pipeline)
Generates high-fidelity Character Consistency Sheets and Scene Environment Sheets
incorporating reference imagery, lighting swatches, multi-view layout, and production metadata.
"""

import sys
import os
import json
import argparse
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Canvas Dimensions (16:9 1080p Master Production Sheet)
WIDTH = 1920
HEIGHT = 1080

# Dark Production Theme
BG_COLOR = (12, 14, 18)        # Deep matte studio obsidian
PANEL_BG = (20, 24, 30)        # Panel dark grey
BORDER_COLOR = (45, 55, 72)    # Subtle boundary lines
ACCENT_ORANGE = (255, 85, 0)   # Production Electric Orange
ACCENT_CYAN = (0, 229, 255)    # Tech Cyan
TEXT_WHITE = (255, 255, 255)
TEXT_MUTED = (160, 174, 192)

def get_font(size=20, bold=False):
    # Try common Windows fonts or fall back to default
    font_names = ["segoeui.ttf", "arial.ttf", "calibri.ttf"]
    if bold:
        font_names = ["segouib.ttf", "arialbd.ttf", "calibrib.ttf"]
    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            continue
    return ImageFont.load_default()

def draw_header(draw, title, subtitle, doc_code="DOC // NANO-BANANA-2.1"):
    font_title = get_font(36, bold=True)
    font_sub = get_font(18, bold=False)
    font_code = get_font(16, bold=True)

    # Top border strip
    draw.rectangle([(0, 0), (WIDTH, 4)], fill=ACCENT_ORANGE)

    # Title & Subtitle
    draw.text((60, 30), title.upper(), fill=TEXT_WHITE, font=font_title)
    draw.text((60, 75), subtitle, fill=TEXT_MUTED, font=font_sub)

    # Tech Doc Code right-aligned
    draw.rectangle([(WIDTH - 360, 30), (WIDTH - 60, 70)], fill=(24, 28, 36), outline=BORDER_COLOR)
    draw.text((WIDTH - 340, 42), doc_code, fill=ACCENT_CYAN, font=font_code)

def draw_palette_swatches(draw, x, y, colors, label="COLOR HARMONY / WARDROBE PALETTE"):
    font_label = get_font(14, bold=True)
    draw.text((x, y), label, fill=TEXT_MUTED, font=font_label)
    
    swatch_size = 40
    gap = 12
    for i, hex_code in enumerate(colors):
        sx = x + i * (swatch_size + gap)
        sy = y + 26
        # Parse hex
        h = hex_code.lstrip('#')
        rgb = tuple(int(h[j:j+2], 16) for j in (0, 2, 4))
        draw.rectangle([(sx, sy), (sx + swatch_size, sy + swatch_size)], fill=rgb, outline=(80, 90, 105))
        draw.text((sx, sy + swatch_size + 4), f"#{h[:4]}", fill=TEXT_MUTED, font=get_font(11))

def generate_character_sheet(name, role, traits, clothing, ref_image_path, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    canvas = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(canvas)

    # 1. Header
    draw_header(
        draw,
        title=f"CHARACTER CONSISTENCY MODEL SHEET: {name}",
        subtitle=f"Role: {role}  |  Identity Lock Engine: Google Nano Banana 2",
        doc_code=f"CHAR-ID // {name[:6].upper()}-01"
    )

    # 2. Main Reference Frame or Portrait
    ref_loaded = False
    ref_img = None
    if ref_image_path and os.path.exists(ref_image_path):
        try:
            ref_img = Image.open(ref_image_path).convert("RGB")
            ref_loaded = True
        except Exception as e:
            print(f"Warning: could not open {ref_image_path}: {e}")

    # Panel Layout:
    # Left: Master Anchor Portrait (480 x 780)
    # Center: Multi-Angle Perspectives (Front, 3/4 View, Profile)
    # Right: Specifications, Expression Matrix & Color Swatches

    # Left Anchor Panel
    p1_box = (60, 130, 560, 980)
    draw.rectangle([p1_box[0]-1, p1_box[1]-1, p1_box[2]+1, p1_box[3]+1], outline=BORDER_COLOR, fill=PANEL_BG)
    draw.rectangle([p1_box[0], p1_box[1], p1_box[2], p1_box[1] + 36], fill=(30, 36, 46))
    draw.text((p1_box[0] + 16, p1_box[1] + 8), "ANCHOR IDENTITY (PRIMARY KEYFRAME)", fill=ACCENT_ORANGE, font=get_font(14, bold=True))

    if ref_loaded and ref_img:
        # Resize to fit inside box
        target_w = p1_box[2] - p1_box[0] - 20
        target_h = p1_box[3] - p1_box[1] - 60
        img_copy = ref_img.copy()
        img_copy.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
        paste_x = p1_box[0] + 10 + (target_w - img_copy.width) // 2
        paste_y = p1_box[1] + 48 + (target_h - img_copy.height) // 2
        canvas.paste(img_copy, (paste_x, paste_y))
    else:
        # Placeholder silhouette
        draw.text((p1_box[0] + 40, p1_box[1] + 200), "NO SEED IMAGE PROVIDED", fill=TEXT_MUTED, font=get_font(18))

    # Center Panel: Multi-Angle Projections (3 Sub-panels)
    center_x = 590
    center_w = 780
    c_panel_box = (center_x, 130, center_x + center_w, 980)
    draw.rectangle([c_panel_box[0]-1, c_panel_box[1]-1, c_panel_box[2]+1, c_panel_box[3]+1], outline=BORDER_COLOR, fill=PANEL_BG)
    draw.rectangle([c_panel_box[0], c_panel_box[1], c_panel_box[2], c_panel_box[1] + 36], fill=(30, 36, 46))
    draw.text((c_panel_box[0] + 16, c_panel_box[1] + 8), "PERSPECTIVE ROTATION & FACIAL CONTINUITY", fill=ACCENT_CYAN, font=get_font(14, bold=True))

    # Sub-projections: 3 views
    sub_w = 230
    sub_h = 420
    sub_titles = ["FRONT ELEVATION", "3/4 PERSPECTIVE", "PROFILE VIEW"]
    sub_angles = [0, 25, 80]

    for idx, (title, angle) in enumerate(zip(sub_titles, sub_angles)):
        sx = center_x + 20 + idx * (sub_w + 25)
        sy = 190
        draw.rectangle([(sx, sy), (sx + sub_w, sy + sub_h)], fill=(15, 18, 24), outline=BORDER_COLOR)
        draw.text((sx + 10, sy + 10), title, fill=TEXT_MUTED, font=get_font(12, bold=True))
        
        # If reference image exists, crop face/upper body with perspective variations
        if ref_loaded and ref_img:
            crop_copy = ref_img.copy()
            # Crop upper region
            cw, ch = crop_copy.size
            crop_box = (0, 0, cw, int(ch * 0.85))
            cropped = crop_copy.crop(crop_box)
            # Apply slight perspective or flip for profile/3/4 illusion
            if idx == 1:
                # 3/4 turn representation
                cropped = ImageEnhance.Contrast(cropped).enhance(1.08)
            elif idx == 2:
                # Profile representation
                cropped = cropped.transpose(Image.FLIP_LEFT_RIGHT)
            cropped.thumbnail((sub_w - 20, sub_h - 60), Image.Resampling.LANCZOS)
            cx = sx + (sub_w - cropped.width) // 2
            cy = sy + 40 + (sub_h - 50 - cropped.height) // 2
            canvas.paste(cropped, (cx, cy))

    # Expression Row below
    exp_y = 660
    draw.text((center_x + 20, exp_y), "EXPRESSION MATRIX (NEUTRAL / INTENSE FOCUS / EMOTIONAL)", fill=TEXT_WHITE, font=get_font(14, bold=True))
    exp_w = 230
    exp_h = 240
    exp_labels = ["NEUTRAL AUTHORITY", "HIGH-STAKES FOCUS", "SUBTLE SMIRK / DETERMINATION"]
    for idx, elabel in enumerate(exp_labels):
        ex = center_x + 20 + idx * (exp_w + 25)
        ey = exp_y + 30
        draw.rectangle([(ex, ey), (ex + exp_w, ey + exp_h)], fill=(15, 18, 24), outline=BORDER_COLOR)
        draw.text((ex + 10, ey + 10), elabel, fill=TEXT_MUTED, font=get_font(11, bold=True))
        if ref_loaded and ref_img:
            # Face crop
            fw, fh = ref_img.size
            face_box = (int(fw * 0.15), 0, int(fw * 0.85), int(fh * 0.55))
            face_crop = ref_img.crop(face_box)
            if idx == 1:
                face_crop = ImageEnhance.Color(face_crop).enhance(1.2)
            elif idx == 2:
                face_crop = ImageEnhance.Brightness(face_crop).enhance(1.1)
            face_crop.thumbnail((exp_w - 20, exp_h - 40), Image.Resampling.LANCZOS)
            canvas.paste(face_crop, (ex + (exp_w - face_crop.width) // 2, ey + 32))

    # Right Panel: Specifications & Prompts
    right_x = 1400
    right_w = 460
    r_panel_box = (right_x, 130, right_x + right_w, 980)
    draw.rectangle([r_panel_box[0]-1, r_panel_box[1]-1, r_panel_box[2]+1, r_panel_box[3]+1], outline=BORDER_COLOR, fill=PANEL_BG)
    draw.rectangle([r_panel_box[0], r_panel_box[1], r_panel_box[2], r_panel_box[1] + 36], fill=(30, 36, 46))
    draw.text((r_panel_box[0] + 16, r_panel_box[1] + 8), "DIRECTOR SPECIFICATIONS", fill=TEXT_WHITE, font=get_font(14, bold=True))

    # Spec details
    specs_y = 190
    font_spec_title = get_font(14, bold=True)
    font_spec_val = get_font(14, bold=False)

    specs = [
        ("CHARACTER NAME", name),
        ("ROLE & ARCHETYPE", role),
        ("FACIAL TRAITS", traits or "Sculpted features, intense gaze, cinematic realism"),
        ("SKIN FIDELITY", "Authentic pores, epidermal peach-fuzz, natural SSS, zero plastic filter"),
        ("PHYSICS & COLLISION", "Rigid solid bounds, zero noclip, true weight transfer"),
        ("COSTUME / ATTIRE", clothing or "Tailored cinematic wardrobe with tactile fabric"),
        ("LIGHTING DIRECTIVE", "3-Point Key Rim + Volumetric Soft Fill"),
        ("CONSISTENCY ENGINE", "Nano Banana 2 (Flash Image Fusion)"),
        ("SEED CONDITIONING", "LOCKED // IDENTITY VERIFIED")
    ]

    for stitle, sval in specs:
        draw.text((right_x + 20, specs_y), stitle, fill=ACCENT_ORANGE, font=font_spec_title)
        # Word wrap sval
        words = sval.split()
        line = ""
        lines = []
        for w in words:
            if len(line + " " + w) < 38:
                line += " " + w if line else w
            else:
                lines.append(line)
                line = w
        if line:
            lines.append(line)
        for li, ltext in enumerate(lines):
            draw.text((right_x + 20, specs_y + 20 + li * 20), ltext, fill=TEXT_WHITE, font=font_spec_val)
        specs_y += 35 + len(lines) * 20

    # Draw color swatches
    draw_palette_swatches(
        draw,
        x=right_x + 20,
        y=specs_y + 10,
        colors=["#0c0e12", "#ff5500", "#1e242e", "#d4af37", "#ffffff", "#3b82f6"]
    )

    # Save output
    canvas.save(output_path, quality=95)
    print(f"✅ Character sheet generated at: {output_path}")
    return output_path

def generate_scene_sheet(location, time_of_day, atmosphere, architecture, ref_image_path, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    canvas = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(canvas)

    # 1. Header
    draw_header(
        draw,
        title=f"ENVIRONMENT & SCENE SHEET: {location}",
        subtitle=f"Time: {time_of_day}  |  Atmosphere: {atmosphere}  |  Google Flow Ready",
        doc_code=f"SCENE-ID // {location[:6].upper()}-LOC"
    )

    ref_loaded = False
    ref_img = None
    if ref_image_path and os.path.exists(ref_image_path):
        try:
            ref_img = Image.open(ref_image_path).convert("RGB")
            ref_loaded = True
        except Exception as e:
            print(f"Warning: could not open scene ref {ref_image_path}: {e}")

    # Layout:
    # Top Left: Master Establishing Wide (1000 x 480)
    # Bottom Left: Medium / Detail Angles (2 panels, 480 x 320 each)
    # Right: Lighting Blueprint, Color Temperature, Cinematography tags

    # Top Left Panel: Establishing Wide
    w_box = (60, 130, 1200, 580)
    draw.rectangle([w_box[0]-1, w_box[1]-1, w_box[2]+1, w_box[3]+1], outline=BORDER_COLOR, fill=PANEL_BG)
    draw.rectangle([w_box[0], w_box[1], w_box[2], w_box[1] + 36], fill=(30, 36, 46))
    draw.text((w_box[0] + 16, w_box[1] + 8), "MASTER ESTABLISHING PERSPECTIVE (WIDE 35MM ANAMORPHIC)", fill=ACCENT_CYAN, font=get_font(14, bold=True))

    if ref_loaded and ref_img:
        tw = w_box[2] - w_box[0] - 20
        th = w_box[3] - w_box[1] - 50
        w_copy = ref_img.copy()
        w_copy.thumbnail((tw, th), Image.Resampling.LANCZOS)
        canvas.paste(w_copy, (w_box[0] + 10 + (tw - w_copy.width)//2, w_box[1] + 44 + (th - w_copy.height)//2))
    else:
        draw.text((w_box[0] + 40, w_box[1] + 180), "ENVIRONMENT REFERENCE AWAITING UPLOAD", fill=TEXT_MUTED, font=get_font(18))

    # Bottom Row: 2 Detail Panels
    b_panel_w = 550
    b_panel_h = 360
    b_titles = ["MEDIUM SPATIAL DEPTH & BLOCKING", "TACTILE MATERIALS & ARCHITECTURAL TEXTURES"]
    for i, btitle in enumerate(b_titles):
        bx = 60 + i * (b_panel_w + 40)
        by = 620
        draw.rectangle([(bx, by), (bx + b_panel_w, by + b_panel_h)], fill=PANEL_BG, outline=BORDER_COLOR)
        draw.rectangle([(bx, by), (bx + b_panel_w, by + 32)], fill=(30, 36, 46))
        draw.text((bx + 14, by + 8), btitle, fill=TEXT_WHITE, font=get_font(13, bold=True))
        if ref_loaded and ref_img:
            # Crop a region
            rw, rh = ref_img.size
            if i == 0:
                crop = ref_img.crop((int(rw * 0.2), int(rh * 0.2), int(rw * 0.8), int(rh * 0.8)))
            else:
                crop = ref_img.crop((int(rw * 0.5), int(rh * 0.3), rw, rh))
            crop.thumbnail((b_panel_w - 20, b_panel_h - 50), Image.Resampling.LANCZOS)
            canvas.paste(crop, (bx + (b_panel_w - crop.width)//2, by + 40 + (b_panel_h - 45 - crop.height)//2))

    # Right Panel: Lighting Specs & Cinematography Data
    r_box = (1230, 130, 1860, 980)
    draw.rectangle([r_box[0]-1, r_box[1]-1, r_box[2]+1, r_box[3]+1], outline=BORDER_COLOR, fill=PANEL_BG)
    draw.rectangle([r_box[0], r_box[1], r_box[2], r_box[1] + 36], fill=(30, 36, 46))
    draw.text((r_box[0] + 16, r_box[1] + 8), "LIGHTING & CINEMATOGRAPHY BLUEPRINT", fill=ACCENT_ORANGE, font=get_font(14, bold=True))

    specs_y = 190
    scene_specs = [
        ("LOCATION", location),
        ("TIME OF DAY", time_of_day or "Golden Hour Sunset"),
        ("ATMOSPHERE", atmosphere or "Cinematic haze, soft dust motes, warm glow"),
        ("ARCHITECTURE", architecture or "Industrial brutalist modernism with brushed steel"),
        ("KEY LIGHT", "Low warm angle (3200K) with rim separation"),
        ("FILL LIGHT", "Cool ambient bounce (5600K)"),
        ("RECOMMENDED LENS", "Panavision C-Series 35mm / 50mm Anamorphic"),
        ("GOOGLE FLOW TAG", "--camera-movement slow-dolly-in --motion-strength 5")
    ]

    for stitle, sval in scene_specs:
        draw.text((r_box[0] + 20, specs_y), stitle, fill=ACCENT_CYAN, font=get_font(13, bold=True))
        draw.text((r_box[0] + 20, specs_y + 18), sval, fill=TEXT_WHITE, font=get_font(13))
        specs_y += 50

    draw_palette_swatches(
        draw,
        x=r_box[0] + 20,
        y=specs_y + 20,
        colors=["#0a0b0e", "#ff8c00", "#1e3a5f", "#8b5a2b", "#dcdcdc", "#f59e0b"]
    )

    canvas.save(output_path, quality=95)
    print(f"✅ Scene sheet generated at: {output_path}")
    return output_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", choices=["character", "scene"], required=True)
    parser.add_argument("--name", default="Lead Subject")
    parser.add_argument("--role", default="Protagonist")
    parser.add_argument("--traits", default="")
    parser.add_argument("--clothing", default="")
    parser.add_argument("--location", default="Urban Cinematic Stage")
    parser.add_argument("--time", default="Dusk / Golden Hour")
    parser.add_argument("--atmosphere", default="Volumetric smoke & dramatic lighting")
    parser.add_argument("--architecture", default="Modern Architectural")
    parser.add_argument("--ref", default=None)
    parser.add_argument("--output", required=True)

    args = parser.parse_args()

    if args.type == "character":
        generate_character_sheet(
            name=args.name,
            role=args.role,
            traits=args.traits,
            clothing=args.clothing,
            ref_image_path=args.ref,
            output_path=args.output
        )
    else:
        generate_scene_sheet(
            location=args.location,
            time_of_day=args.time,
            atmosphere=args.atmosphere,
            architecture=args.architecture,
            ref_image_path=args.ref,
            output_path=args.output
        )

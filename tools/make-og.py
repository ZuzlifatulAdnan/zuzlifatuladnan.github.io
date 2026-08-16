# -*- coding: utf-8 -*-
"""
Generator gambar Open Graph (1200x630 PNG).

Kenapa perlu: WhatsApp, Facebook, LinkedIn, dan Twitter TIDAK merender og:image
berformat SVG. Preview link jadi kosong dan CTR dari share hilang.

Jalankan:  python tools/make-og.py
Output:    assets/img/og-image.png  +  assets/img/og/<project-id>.png
"""

import io
import json
import os
import re
import subprocess
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "img")
OG_DIR = os.path.join(OUT_DIR, "og")

W, H = 1200, 630
BG = (10, 10, 11)
BG2 = (16, 17, 22)
BRAND = (91, 140, 255)
WHITE = (245, 247, 250)
MUTED = (150, 157, 172)
CHIP_BG = (26, 28, 35)
CHIP_TX = (198, 205, 220)

FONT_DIR = r"C:\Windows\Fonts"
F_BLACK = os.path.join(FONT_DIR, "seguibl.ttf")
F_BOLD = os.path.join(FONT_DIR, "segoeuib.ttf")
F_SEMI = os.path.join(FONT_DIR, "seguisb.ttf")
F_REG = os.path.join(FONT_DIR, "segoeui.ttf")


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def text_w(draw, s, f):
    return draw.textbbox((0, 0), s, font=f)[2]


def wrap(draw, text, f, max_w):
    """Bungkus teks ke beberapa baris agar muat dalam max_w piksel."""
    words, lines, cur = text.split(), [], ""
    for word in words:
        trial = (cur + " " + word).strip()
        if text_w(draw, trial, f) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def base_canvas():
    """Latar gelap dengan gradasi diagonal + glow warna brand."""
    grad = Image.new("RGB", (W, H))
    gd = ImageDraw.Draw(grad)
    for y in range(H):
        t = y / H
        gd.line(
            [(0, y), (W, y)],
            fill=tuple(int(BG[i] + (BG2[i] - BG[i]) * t) for i in range(3)),
        )

    # Glow warna brand di pojok kanan atas, digabung secara aditif.
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    ImageDraw.Draw(glow).ellipse([W - 430, -230, W + 210, 410], fill=(40, 60, 125))
    glow = glow.filter(ImageFilter.GaussianBlur(140))
    img = ImageChops.add(grad, glow)

    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 8], fill=BRAND)          # garis aksen atas
    d.rectangle([0, H - 3, W, H], fill=(30, 32, 40))
    return img


def draw_chip(d, x, y, label, f):
    pad_x, h = 18, 40
    w = text_w(d, label, f) + pad_x * 2
    d.rounded_rectangle([x, y, x + w, y + h], radius=12, fill=CHIP_BG,
                        outline=(46, 49, 60))
    d.text((x + pad_x, y + h / 2), label, font=f, fill=CHIP_TX, anchor="lm")
    return w + 12


def draw_logo(d, x, y):
    d.rounded_rectangle([x, y, x + 64, y + 64], radius=18, fill=BRAND)
    d.text((x + 32, y + 33), "ZA", font=font(F_BLACK, 30), fill=(8, 12, 26),
           anchor="mm")


def render(path, eyebrow, title, subtitle, chips):
    img = base_canvas()
    d = ImageDraw.Draw(img)

    f_eyebrow = font(F_SEMI, 24)
    f_sub = font(F_REG, 28)
    f_chip = font(F_SEMI, 22)
    f_foot = font(F_SEMI, 24)

    x = 82
    draw_logo(d, x, 74)
    d.text((x + 84, 106), "Zuzlifatul Adnan", font=font(F_BOLD, 30), fill=WHITE,
           anchor="lm")
    d.text((x + 84, 138), eyebrow, font=f_eyebrow, fill=BRAND, anchor="lm")

    # Judul: kecilkan ukuran sampai muat maksimal 3 baris
    size = 68
    while size > 34:
        f_title = font(F_BLACK, size)
        lines = wrap(d, title, f_title, W - x * 2)
        if len(lines) <= 3:
            break
        size -= 5
    f_title = font(F_BLACK, size)
    lines = wrap(d, title, f_title, W - x * 2)[:3]

    y = 232
    for line in lines:
        d.text((x, y), line, font=f_title, fill=WHITE)
        y += int(size * 1.2)

    y += 8
    for line in wrap(d, subtitle, f_sub, W - x * 2)[:2]:
        d.text((x, y), line, font=f_sub, fill=MUTED)
        y += 38

    cx, cy = x, H - 132
    for chip in chips[:5]:
        cx += draw_chip(d, cx, cy, chip, f_chip)

    d.text((x, H - 58), "zuzlifatuladnan.github.io", font=f_foot, fill=MUTED,
           anchor="lm")
    d.text((W - x, H - 58), "Lampung, Indonesia", font=f_foot, fill=(90, 96, 110),
           anchor="rm")

    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print("  ->", os.path.relpath(path, ROOT).replace("\\", "/"))


def load_projects():
    """Ambil array PROJECTS dari data.js lewat Node supaya tetap satu sumber data."""
    script = (
        "import {loadData} from './tools/load-data.mjs';"
        "process.stdout.write(JSON.stringify(loadData().PROJECTS));"
    )
    out = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=ROOT, capture_output=True, text=True, check=True,
    )
    return json.loads(out.stdout)


def render_icon(path, size, radius_ratio=0.22):
    """Ikon kotak dengan logo ZA — dipakai untuk apple-touch-icon & favicon PNG."""
    scale = 4  # gambar besar lalu perkecil, supaya sudut membulatnya halus
    big = size * scale
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(
        [0, 0, big - 1, big - 1], radius=int(big * radius_ratio), fill=BRAND
    )
    d.text(
        (big / 2, big / 2 + big * 0.02),
        "ZA",
        font=font(F_BLACK, int(big * 0.42)),
        fill=(8, 12, 26),
        anchor="mm",
    )
    img = img.resize((size, size), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print("  ->", os.path.relpath(path, ROOT).replace("\\", "/"))


def main():
    print("Membuat ikon aplikasi...")
    render_icon(os.path.join(OUT_DIR, "apple-touch-icon.png"), 180)
    render_icon(os.path.join(OUT_DIR, "icon-192.png"), 192)
    render_icon(os.path.join(OUT_DIR, "icon-512.png"), 512)
    render_icon(os.path.join(OUT_DIR, "favicon-32.png"), 32, radius_ratio=0.18)

    print("Membuat OG image utama...")
    render(
        os.path.join(OUT_DIR, "og-image.png"),
        "Full-Stack Web & Mobile Developer",
        "Jasa Pembuatan Website & Aplikasi Mobile",
        "Laravel, Flutter, dan Kotlin. Source code milik klien, harga transparan, 4+ tahun pengalaman.",
        ["Laravel", "Flutter", "Kotlin", "REST API"],
    )

    print("Membuat OG image per proyek...")
    for p in load_projects():
        render(
            os.path.join(OG_DIR, p["id"] + ".png"),
            "Studi Kasus / Portofolio",
            p["title"],
            p.get("desc_id") or p.get("desc_en", ""),
            p.get("tags", []),
        )

    print("Selesai.")


if __name__ == "__main__":
    main()

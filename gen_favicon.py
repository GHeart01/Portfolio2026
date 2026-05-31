#!/usr/bin/env python3
"""
gen_favicon.py — generate portfolio favicon assets using only Python stdlib.

Outputs:
  static/favicon_io/favicon-16x16.png
  static/favicon_io/favicon-32x32.png
  static/favicon_io/favicon.ico

Design: ✦ 4-pointed star (the portfolio's signature glyph) in #00ffaa
        on a dark rounded-corner square (#0a0a14), with a soft glow halo.
"""
import struct, zlib, math, os

# ── Palette ───────────────────────────────────────────────────────────────────
BG = (10,  10,  20 )   # #0a0a14 — dark background
SC = ( 0, 255, 170 )   # #00ffaa — accent green

# ── PNG writer ────────────────────────────────────────────────────────────────

def make_png(w, h, pixels):
    """Encode RGBA pixel list as a valid PNG bytestring."""
    def chunk(tag, data):
        body = tag + data
        return struct.pack('>I', len(data)) + body + struct.pack('>I', zlib.crc32(body) & 0xffffffff)

    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
    # One filter-type byte (0 = None) per row, then raw RGBA bytes
    raw  = b''.join(
        b'\x00' + bytes(c for px in pixels[y * w : (y + 1) * w] for c in px)
        for y in range(h)
    )
    idat = chunk(b'IDAT', zlib.compress(raw, 9))
    iend = chunk(b'IEND', b'')
    return b'\x89PNG\r\n\x1a\n' + ihdr + idat + iend

# ── ICO writer ────────────────────────────────────────────────────────────────

def make_ico(png_list, size_list):
    """Embed PNG bytestrings into a multi-resolution .ico file."""
    n = len(png_list)
    header    = struct.pack('<HHH', 0, 1, n)
    dir_bytes = 16 * n
    offset    = 6 + dir_bytes
    entries   = b''
    for png, (sw, sh) in zip(png_list, size_list):
        entries += struct.pack('<BBBBHHII',
            sw if sw < 256 else 0,
            sh if sh < 256 else 0,
            0, 0, 1, 32, len(png), offset
        )
        offset += len(png)
    return header + entries + b''.join(png_list)

# ── Geometry helpers ──────────────────────────────────────────────────────────

def in_rounded_rect(px, py, w, h, r):
    """True if (px,py) is inside the rounded-corner rectangle."""
    if not (0 <= px <= w and 0 <= py <= h):
        return False
    cx = max(r, min(w - r, px))
    cy = max(r, min(h - r, py))
    return (px - cx) ** 2 + (py - cy) ** 2 <= r * r

def in_poly(px, py, poly):
    """Ray-casting point-in-polygon test."""
    inside = False
    j = len(poly) - 1
    for i, (xi, yi) in enumerate(poly):
        xj, yj = poly[j]
        if (yi > py) != (yj > py):
            if px < (xj - xi) * (py - yi) / (yj - yi) + xi:
                inside = not inside
        j = i
    return inside

# ── Render a single size ──────────────────────────────────────────────────────

def render(size):
    cx = cy   = size / 2
    corner_r  = size * 0.22     # rounded corner radius

    # ✦ 4-pointed star: alternating outer tips and inner waist corners
    outer_r = size * 0.39
    inner_r = size * 0.13
    star = []
    for i in range(8):
        a = (math.pi * i / 4) - math.pi / 2   # tip 0 = top
        r = outer_r if i % 2 == 0 else inner_r
        star.append((cx + math.cos(a) * r, cy + math.sin(a) * r))

    # Inflated copy of the star for a soft glow halo
    glow_scale = 1.45
    glow = [(cx + (x - cx) * glow_scale, cy + (y - cy) * glow_scale) for x, y in star]

    SSAA = 6           # sub-samples per axis (6×6 = 36 total per pixel)
    N    = SSAA * SSAA
    pixels = []

    for y in range(size):
        for x in range(size):
            bg_n = star_n = glow_n = 0
            for sy in range(SSAA):
                for sx in range(SSAA):
                    fx = x + (sx + 0.5) / SSAA
                    fy = y + (sy + 0.5) / SSAA
                    if not in_rounded_rect(fx, fy, size, size, corner_r):
                        continue
                    bg_n += 1
                    if in_poly(fx, fy, star):
                        star_n += 1
                    elif in_poly(fx, fy, glow):
                        glow_n += 1

            if bg_n == 0:
                pixels.append((0, 0, 0, 0))   # transparent outside rounded corners
                continue

            star_c = star_n / N                # star coverage  0..1
            glow_c = (glow_n / N) * 0.30       # glow at 30% strength
            bg_c   = bg_n   / N                # AA edge coverage

            # Composite: background → glow → star
            r = BG[0] + (SC[0] - BG[0]) * glow_c
            g = BG[1] + (SC[1] - BG[1]) * glow_c
            b = BG[2] + (SC[2] - BG[2]) * glow_c

            r = r + (SC[0] - r) * star_c
            g = g + (SC[1] - g) * star_c
            b = b + (SC[2] - b) * star_c

            pixels.append((
                min(255, max(0, int(r))),
                min(255, max(0, int(g))),
                min(255, max(0, int(b))),
                min(255, int(bg_c * 255)),
            ))

    return pixels

# ── Main ──────────────────────────────────────────────────────────────────────

out = 'static/favicon_io'
os.makedirs(out, exist_ok=True)

px16 = render(16)
px32 = render(32)

png16 = make_png(16, 16, px16)
png32 = make_png(32, 32, px32)
ico   = make_ico([png16, png32], [(16, 16), (32, 32)])

with open(f'{out}/favicon-16x16.png', 'wb') as f: f.write(png16)
with open(f'{out}/favicon-32x32.png', 'wb') as f: f.write(png32)
with open(f'{out}/favicon.ico',       'wb') as f: f.write(ico)

print(f'✦  Wrote favicon assets → {out}/')
print()

# Terminal preview (32×32, 2 chars per pixel, 2 rows collapsed into 1)
print('32×32 preview:')
for y in range(0, 32, 2):
    row = ''
    for x in range(32):
        r, g, b, a = px32[y * 32 + x]
        if a < 30:
            row += '  '
        elif g > 150 and r < 50:   # greenish → star / glow
            row += '██' if r < 10 else '▓▓'
        else:
            row += '░░'            # dark background
    print(row)

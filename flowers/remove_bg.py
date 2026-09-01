"""
Remove grey/white backgrounds from flower images using flood-fill + color keying.
Outputs transparent PNGs to public/flowers/processed/
"""
import os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
from pathlib import Path
from PIL import Image
import numpy as np

SRC = Path("C:/Users/Pc/basant-portfolio/flowers")
OUT = Path("C:/Users/Pc/basant-portfolio/public/flowers/processed")
OUT.mkdir(parents=True, exist_ok=True)

# Files to process: all images in the source directory
TARGETS = [p.name for p in SRC.glob("*.*") if p.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp', '.jfif')]

def remove_bg(img_path: Path, out_path: Path, tolerance=32):
    """
    Remove background using flood-fill from the 4 corners + edge sampling.
    Works for uniform grey or white backgrounds.
    """
    img = Image.open(img_path).convert("RGBA")
    arr = np.array(img, dtype=np.float32)
    h, w = arr.shape[:2]

    # Sample background color only from top corners to avoid bottom grass/flowers
    corners = [arr[0,0,:3], arr[0,w-1,:3]]
    bg_color = np.mean(corners, axis=0)
    
    # If it's pure white or close to it, just force white
    if np.all(bg_color > 240):
        bg_color = np.array([255, 255, 255])
    
    print(f"  {img_path.name}: bg≈{bg_color.astype(int).tolist()}, size={w}x{h}")

    rgb = arr[:,:,:3]
    # Color distance from background
    dist = np.sqrt(np.sum((rgb - bg_color)**2, axis=2))
    
    # Create mask: 1 = foreground (flower), 0 = background
    fg_mask = (dist > tolerance).astype(np.float32)

    # Feather the edges slightly for nicer compositing
    from PIL import ImageFilter
    mask_img = Image.fromarray((fg_mask * 255).astype(np.uint8), "L")
    mask_img = mask_img.filter(ImageFilter.GaussianBlur(1.5))
    mask_arr = np.array(mask_img, dtype=np.float32) / 255.0

    # Apply mask as alpha
    result = arr.copy()
    result[:,:,3] = (mask_arr * 255).astype(np.uint8)
    
    out_img = Image.fromarray(result.astype(np.uint8), "RGBA")
    
    # Crop to content
    bbox = out_img.getbbox()
    if bbox:
        out_img = out_img.crop(bbox)
    
    # Max 900px on longest side
    mx = 900
    if max(out_img.width, out_img.height) > mx:
        s = mx / max(out_img.width, out_img.height)
        out_img = out_img.resize(
            (max(1, int(out_img.width * s)), max(1, int(out_img.height * s))),
            Image.LANCZOS
        )
    
    # Change suffix to .png
    out_path = out_path.with_suffix('.png')
    out_img.save(out_path, "PNG", optimize=True)
    print(f"    -> {out_path.name} ({out_img.width}x{out_img.height})")
    return True

ok = fail = 0
for name in TARGETS:
    src = SRC / name
    if not src.exists():
        src = SRC / "processed" / name
    if not src.exists():
        print(f"  MISSING: {name}")
        fail += 1
        continue
    dst = OUT / Path(name).with_suffix('.png')
    try:
        remove_bg(src, dst)
        ok += 1
    except Exception as e:
        print(f"  FAIL {name}: {e}")
        fail += 1

print(f"\n{ok} OK, {fail} FAIL")

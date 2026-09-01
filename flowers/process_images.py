"""
Process flower/leaf images: u2net background removal via onnxruntime.
Input: image files in C:/Users/Pc/basant-portfolio/flowers/
Output: <source>_clean.png (RGBA, transparent bg, cropped, max 800px) in flowers/processed/
Required: onnxruntime, numpy, PIL
"""
from pathlib import Path
import sys, urllib.request, numpy as np
from PIL import Image, ImageFilter
import onnxruntime as ort

SRC = Path("C:/Users/Pc/basant-portfolio/flowers")
MODEL_URL = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx"
MODEL = Path.home() / ".u2net" / "u2net.onnx"

def get_model():
    if MODEL.exists() and MODEL.stat().st_size > 1_000_000:
        return str(MODEL)
    print(f"Downloading u2net (~176 MB)...", file=sys.stderr)
    MODEL.parent.mkdir(parents=True, exist_ok=True)
    try:
        urllib.request.urlretrieve(MODEL_URL, str(MODEL))
        print(f"OK {MODEL.stat().st_size} bytes", file=sys.stderr)
        return str(MODEL)
    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        return None

model_path = get_model()
if model_path is None:
    sys.exit("FATAL: no model")
print("Session...", file=sys.stderr)
session = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])

def u2net_mask(img: Image.Image) -> np.ndarray:
    rgb = img.convert("RGB").resize((320, 320), Image.LANCZOS)
    x = np.array(rgb, dtype=np.float32) / 255.0
    x = np.expand_dims(x.transpose(2,0,1), 0)              # (1,3,320,320)
    o = session.run(None, {session.get_inputs()[0].name: x})[0][0,0]   # (320,320)
    o = 1.0 / (1.0 + np.exp(-o))                           # sigmoid
    m = Image.fromarray((o*255).astype(np.uint8)).resize(img.size, Image.LANCZOS)
    return np.array(m, dtype=np.float32) / 255.0

def process(inpath: Path, outdir: Path):
    try:
        im = Image.open(inpath).convert("RGBA")
    except Exception as e:
        print(f"  SKIP {inpath.name}: {e}", file=sys.stderr); return False
    if im.width < 64 or im.height < 64:
        print(f"  SKIP {inpath.name}: too small", file=sys.stderr); return False

    print(f"  {inpath.name} ({im.width}x{im.height})...", file=sys.stderr)
    arr = np.array(im)                                       # (h,w,4)
    h, w = arr.shape[:2]
    # ensure 4 channels (RGBA)
    if arr.ndim == 3 and arr.shape[2] == 3:
        arr = np.dstack([arr, np.full((h,w), 255, dtype=np.uint8)])

    mask = u2net_mask(im)                                   # (h,w) float 0..1
    # feather alpha
    ma = Image.fromarray((mask*255).astype(np.uint8))
    ma = ma.filter(ImageFilter.GaussianBlur(1.2))
    a = np.array(ma, dtype=np.float32) / 255.0
    out = arr.copy()
    out[:,:,3] = (a*255).astype(np.uint8)
    out_img = Image.fromarray(out.astype(np.uint8), "RGBA")
    # crop to content
    bb = out_img.getbbox()
    if bb: out_img = out_img.crop(bb)
    # max 800 on longest side
    mx = 800
    if max(out_img.width, out_img.height) > mx:
        s = mx / max(out_img.width, out_img.height)
        out_img = out_img.resize(
            (max(1,int(out_img.width*s)), max(1,int(out_img.height*s))),
            Image.LANCZOS)

    stem = inpath.stem
    if stem.endswith("_clean"):
        stem = stem[:-6]
    outpath = outdir / f"{stem}_clean.png"
    out_img.save(outpath, "PNG", optimize=True)
    print(f"    -> {outpath} ({out_img.width}x{out_img.height})", file=sys.stderr)
    return True

if __name__ == "__main__":
    outd = SRC / "processed"; outd.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in SRC.iterdir()
                   if p.suffix.lower() in {".png",".jpg",".jpeg",".jfif",".avif",".webp"}
                   and p.name != "process_images.py")
    print(f"{len(files)} imgs", file=sys.stderr)
    ok=fail=0
    for f in files:
        if process(f, outd): ok+=1
        else: fail+=1
    print(f"\n{ok} OK, {fail} FAIL, {len(files)} total", file=sys.stderr)

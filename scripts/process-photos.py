#!/usr/bin/env python3
"""
Build public/photos + app/photos.json from a folder of source photos.

  - skips 0-byte placeholders (half of jupiter-pics is ghost copies)
  - drops exact content duplicates by sha1
  - honours EXIF orientation so phone photos aren't sideways on the TV
  - resamples to one uniform height so the marquee rows line up
  - emits a manifest with real dimensions (no layout shift, no client probing)

Usage: python3 scripts/process-photos.py [SOURCE_DIR]
"""
import hashlib
import json
import pathlib
import sys

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path.home() / "Downloads" / "jupiter-pics")
OUT = ROOT / "public" / "photos"
MANIFEST = ROOT / "app" / "photos.json"

HEIGHT = 900   # covers a 3-row layout on a 4K panel without upscaling
QUALITY = 72

for old in OUT.glob("*.jpg"):
    old.unlink()
OUT.mkdir(parents=True, exist_ok=True)

sources = sorted(p for p in SRC.iterdir() if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".heic"})
seen: set[str] = set()
manifest: list[dict] = []
skipped_empty = skipped_dupe = failed = 0

for path in sources:
    if path.stat().st_size == 0:
        skipped_empty += 1
        continue
    digest = hashlib.sha1(path.read_bytes()).hexdigest()
    if digest in seen:
        skipped_dupe += 1
        continue
    seen.add(digest)

    try:
        with Image.open(path) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            if im.height > HEIGHT:
                im = im.resize((round(im.width * HEIGHT / im.height), HEIGHT), Image.LANCZOS)
            name = f"p{len(manifest) + 1:03d}.jpg"
            im.save(OUT / name, "JPEG", quality=QUALITY, optimize=True, progressive=True)
            manifest.append({"src": f"/photos/{name}", "w": im.width, "h": im.height})
    except Exception as exc:  # unreadable source, not worth failing the build over
        failed += 1
        print(f"  ! skipped {path.name}: {exc}", file=sys.stderr)

MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")

total = sum(p.stat().st_size for p in OUT.glob("*.jpg"))
print(f"scanned {len(sources)} files")
print(f"  {skipped_empty} empty placeholders, {skipped_dupe} duplicates, {failed} unreadable")
print(f"  wrote {len(manifest)} photos -> {OUT}  ({total / 1e6:.1f} MB)")
print(f"  manifest -> {MANIFEST}")

"""Pixel comparison of exact-size references and UE captures; requires Pillow."""
import argparse
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageEnhance, ImageStat

parser = argparse.ArgumentParser()
parser.add_argument("package", type=Path)
parser.add_argument("--tolerance", type=int, default=0)
parser.add_argument("--max-fraction", type=float, default=0)
parser.add_argument("--modes", nargs="+", choices=("umg", "react", "native"), default=["umg", "react", "native"])
args = parser.parse_args()
assert 0 <= args.tolerance <= 255 and 0 <= args.max_fraction <= 1
root = args.package.resolve(strict=True)
reference = Image.open(root / "reference.png").convert("RGBA")
report = {"reference": str(root / "reference.png"), "size": reference.size,
          "tolerance": args.tolerance, "maxFraction": args.max_fraction, "captures": {}, "ok": True}
for mode in args.modes:
    capture = Image.open(root / ("ue-" + mode + ".png")).convert("RGBA")
    assert capture.size == reference.size, mode + " screenshot dimensions differ"
    difference = ImageChops.difference(reference, capture)
    pixels = list(difference.get_flattened_data() if hasattr(difference, "get_flattened_data") else difference.getdata())
    count = sum(max(pixel) > args.tolerance for pixel in pixels)
    fraction = count / len(pixels)
    ok = fraction <= args.max_fraction
    report["captures"][mode] = {"ok": ok, "differentPixels": count, "fraction": fraction,
                                "meanAbsoluteErrorRGBA": ImageStat.Stat(difference).mean,
                                "maxChannelError": max(max(pixel) for pixel in pixels)}
    report["ok"] = report["ok"] and ok
    ImageEnhance.Brightness(difference.convert("RGB")).enhance(4).save(root / ("diff-" + mode + ".png"))
    Image.blend(reference, capture, .5).save(root / ("overlay-" + mode + ".png"))
(root / "visual-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, indent=2))
raise SystemExit(0 if report["ok"] else 1)

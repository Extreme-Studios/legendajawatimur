"""Create web-optimised cover assets and the catalogue used by the webbook."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "EBOOK_OUTPUT" / "DATA" / "legenda_database.json"
PUBLIC = ROOT / "webbook"
COVERS = PUBLIC / "covers"
DATA = PUBLIC / "data"


def clean_name(value: str) -> str:
    return "".join(ch.lower() if ch.isalnum() else "-" for ch in value).strip("-")


def make_cover(source: Path, destination: Path) -> None:
    if destination.exists() and destination.stat().st_mtime >= source.stat().st_mtime:
        return
    with Image.open(source) as raw:
        image = ImageOps.exif_transpose(raw).convert("RGB")
        image.thumbnail((1100, 1600), Image.Resampling.LANCZOS)
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, "WEBP", quality=78, method=6)


def main() -> None:
    source_data = json.loads(SOURCE.read_text(encoding="utf-8"))
    regions = []
    for region_name, region in source_data.items():
        legends = []
        for entry in region["legenda"]:
            origin = Path(entry["gambar"])
            filename = f"{clean_name(region_name)}-{entry['episode']:02d}.webp"
            make_cover(origin, COVERS / filename)
            legends.append({
                "episode": entry["episode"],
                "title": entry["judul"],
                "cover": f"/covers/{filename}",
            })
        regions.append({
            "name": region_name,
            "subtitle": region.get("subjudul", "JAWA TIMUR"),
            "legends": legends,
        })
    DATA.mkdir(parents=True, exist_ok=True)
    (DATA / "legends.json").write_text(
        json.dumps({"title": "Legenda Jawa Timur", "byline": "By PARFI Jawa Timur", "regions": regions}, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"Prepared {sum(len(region['legends']) for region in regions)} covers across {len(regions)} regions.")


if __name__ == "__main__":
    main()

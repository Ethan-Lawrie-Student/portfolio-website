"""Generate the portfolio's 1200 x 630 social preview image."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "meta" / "social-preview.png"

TEAL = "#1c3d46"
CREAM = "#fdefd4"
SALMON = "#fc967d"
INK = "#242322"


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    """Load deterministic Windows fallbacks for the generated bitmap."""
    return ImageFont.truetype(Path("C:/Windows/Fonts") / name, size)


image = Image.new("RGB", (1200, 630), CREAM)
draw = ImageDraw.Draw(image)

# Swiss cover bars and registration rules.
draw.rectangle((0, 0, 71, 629), fill=TEAL)
draw.rectangle((72, 0, 89, 159), fill=SALMON)
for y in (64, 458, 520, 582):
    draw.line((120, y, 1144, y), fill=INK, width=2)

mono = font("consola.ttf", 18)
draw.text((120, 27), "SOFTWARE ENGINEER", fill=INK, font=mono)

display = font("arialbd.ttf", 168)
draw.text((112, 85), "ETHAN", fill=INK, font=display)
draw.text((112, 237), "LAWRIE", fill=INK, font=display)
draw.rectangle((775, 367, 798, 390), fill=SALMON)

# Restrained colour fields balance the name without adding unsupported copy.
draw.rectangle((988, 112, 1143, 267), fill=TEAL)
draw.rectangle((988, 286, 1143, 391), fill=SALMON)

label = font("consola.ttf", 16)
body = font("arialbd.ttf", 26)
draw.text((120, 475), "EXPERIENCE", fill=TEAL, font=label)
draw.text((360, 473), "CMV GROUP / MICROSOFT", fill=INK, font=body)
draw.text((120, 537), "WORK", fill=TEAL, font=label)
draw.text((360, 535), "WORD LAWRIE", fill=INK, font=body)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT, optimize=True)
print(OUTPUT)

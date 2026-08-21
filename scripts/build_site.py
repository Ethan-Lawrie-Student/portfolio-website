"""Build the framework-free portfolio for Cloudflare Worker hosting."""

from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
DIST = (ROOT / "dist").resolve()
CLIENT = DIST / "client"
SERVER = DIST / "server"

ROOT_FILES = (
    "index.html",
    "404.html",
    "main.js",
    "style.css",
    "robots.txt",
    "sitemap.xml",
)
ROOT_DIRECTORIES = ("assets", "work")


def build() -> None:
    if DIST.parent != ROOT.resolve() or DIST.name != "dist":
        raise RuntimeError(f"Refusing to replace unexpected build path: {DIST}")

    if DIST.exists():
        shutil.rmtree(DIST)

    CLIENT.mkdir(parents=True)
    SERVER.mkdir(parents=True)

    for relative in ROOT_FILES:
        source = ROOT / relative
        if not source.is_file():
            raise FileNotFoundError(source)
        shutil.copy2(source, CLIENT / relative)

    for relative in ROOT_DIRECTORIES:
        source = ROOT / relative
        if not source.is_dir():
            raise FileNotFoundError(source)
        shutil.copytree(source, CLIENT / relative)

    worker = ROOT / "worker" / "index.js"
    if not worker.is_file():
        raise FileNotFoundError(worker)
    shutil.copy2(worker, SERVER / "index.js")

    print(f"Built static assets in {CLIENT}")
    print(f"Built worker entry in {SERVER}")


if __name__ == "__main__":
    build()

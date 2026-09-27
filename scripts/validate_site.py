"""Small dependency-free validator for the portfolio's static HTML surface."""

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / "index.html", ROOT / "404.html", *sorted((ROOT / "work").glob("*.html"))]


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.refs: list[tuple[str, str]] = []
        self.headings: list[int] = []
        self.title_count = 0
        self.description_count = 0
        self.canonical_count = 0
        self.blank_links: list[tuple[str, set[str]]] = []
        self.json_ld: list[str] = []
        self._json_buffer: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {name: value or "" for name, value in attrs}
        if values.get("id"):
            self.ids.append(values["id"])
        for name in ("href", "src"):
            if values.get(name):
                self.refs.append((name, values[name]))
        if re.fullmatch(r"h[1-6]", tag):
            self.headings.append(int(tag[1]))
        if tag == "title":
            self.title_count += 1
        if tag == "meta" and values.get("name", "").lower() == "description":
            self.description_count += 1
        if tag == "link" and values.get("rel", "").lower() == "canonical":
            self.canonical_count += 1
        if tag == "a" and values.get("target", "").lower() == "_blank":
            self.blank_links.append((values.get("href", ""), set(values.get("rel", "").lower().split())))
        if tag == "script" and values.get("type", "").lower() == "application/ld+json":
            self._json_buffer = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._json_buffer is not None:
            self.json_ld.append("".join(self._json_buffer))
            self._json_buffer = None

    def handle_data(self, data: str) -> None:
        if self._json_buffer is not None:
            self._json_buffer.append(data)


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def local_target(page: Path, ref: str) -> tuple[Path, str] | None:
    parsed = urlsplit(ref)
    if parsed.scheme or parsed.netloc or ref.startswith(("mailto:", "tel:", "data:")):
        return None
    fragment = unquote(parsed.fragment)
    if not parsed.path:
        return page, fragment
    clean_path = unquote(parsed.path)
    target = ROOT / clean_path.lstrip("/") if clean_path.startswith("/") else page.parent / clean_path
    return target.resolve(), fragment


def main() -> int:
    errors: list[str] = []
    parsed_pages = {page.resolve(): parse_page(page) for page in PAGES}

    for page, parser in parsed_pages.items():
        label = page.relative_to(ROOT)
        # Public copy includes metadata/JSON-LD, not only rendered paragraphs.
        source = page.read_text(encoding="utf-8")
        private_details = (
            "script.google.com/macros/", "multi-handler", "2,000+", "day-plus",
            "non-exclusive", "paid distribution", "deployment filters",
            "Architecture prepared", "Implementation ahead", "4.2/5",
        )
        for detail in private_details:
            if detail.casefold() in source.casefold():
                errors.append(f"{label}: obsolete or restricted public detail: {detail}")
        if re.search(r"<form\b", source, re.IGNORECASE):
            errors.append(f"{label}: contact must use links, not a submission form")
        duplicate_ids = [item for item, count in Counter(parser.ids).items() if count > 1]
        if duplicate_ids:
            errors.append(f"{label}: duplicate IDs: {', '.join(duplicate_ids)}")
        if parser.headings.count(1) != 1:
            errors.append(f"{label}: expected one h1, found {parser.headings.count(1)}")
        for previous, current in zip(parser.headings, parser.headings[1:]):
            if current > previous + 1:
                errors.append(f"{label}: heading level jumps h{previous} to h{current}")
        if parser.title_count != 1 or parser.description_count != 1:
            errors.append(f"{label}: expected one title and one description")
        if page.name != "404.html" and parser.canonical_count != 1:
            errors.append(f"{label}: expected one canonical link")
        for href, rel in parser.blank_links:
            if not {"noopener", "noreferrer"}.issubset(rel):
                errors.append(f"{label}: target=_blank link lacks noopener noreferrer: {href}")
        for payload in parser.json_ld:
            try:
                json.loads(payload)
            except json.JSONDecodeError as exc:
                errors.append(f"{label}: invalid JSON-LD: {exc}")

        for kind, ref in parser.refs:
            resolved = local_target(page, ref)
            if resolved is None:
                continue
            target, fragment = resolved
            if not target.exists():
                errors.append(f"{label}: missing local {kind} target: {ref}")
                continue
            if fragment and target.suffix.lower() in {".html", ""}:
                target_page = target
                if target.is_dir():
                    target_page = target / "index.html"
                target_parser = parsed_pages.get(target_page.resolve())
                if target_parser is None and target_page.exists():
                    target_parser = parse_page(target_page)
                if target_parser is not None and fragment not in target_parser.ids:
                    errors.append(f"{label}: missing fragment #{fragment} in {target_page.relative_to(ROOT)}")

    if errors:
        print("Static validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Validated {len(PAGES)} HTML routes: structure, metadata, links, fragments, and JSON-LD.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

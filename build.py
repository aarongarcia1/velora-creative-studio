#!/usr/bin/env python3
"""
VELORA Creative Studio — static page builder (no dependencies).

Generates one HTML page per language from a single template:

    src/template.html  +  src/i18n/es.json  ->  index.html      (Spanish, default)
    src/template.html  +  src/i18n/en.json  ->  en/index.html   (English)

Also regenerates sitemap.xml with hreflang alternates.

Usage (from this folder):   python3 build.py

Placeholders in the template look like {{key}}. Every key must exist in the
language file, otherwise the build stops and tells you which one is missing.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
SITE_URL = "https://aarongarcia1.github.io/velora-creative-studio/"  # change if the URL changes

LANGS = {
    # code: (output file, relative path to site root, public URL)
    "es": ("index.html", "", SITE_URL),
    "en": ("en/index.html", "../", SITE_URL + "en/"),
}

# Short hash of the CSS/JS files, appended as ?v=... so browsers always load
# the latest version after a change (otherwise they may keep an old cached copy).
ASSETS = ["assets/css/styles.css", "assets/js/config.js", "assets/js/main.js"]
ASSET_V = hashlib.sha1(b"".join((ROOT / a).read_bytes() for a in ASSETS)).hexdigest()[:8]

PLACEHOLDER = re.compile(r"\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}")


def build_page(template: str, lang: str) -> str:
    data = json.loads((SRC / "i18n" / f"{lang}.json").read_text(encoding="utf-8"))
    out_file, base, url = LANGS[lang]
    data.update({
        "lang": lang,
        "base": base,
        "site_url": SITE_URL,
        "asset_v": ASSET_V,
        "page_url": url,
        "url_es": LANGS["es"][2],
        "url_en": LANGS["en"][2],
        "href_es": base or "./",
        "href_en": base + "en/",
        "current_es": 'aria-current="page"' if lang == "es" else "",
        "current_en": 'aria-current="page"' if lang == "en" else "",
    })

    missing = []

    def replace(match):
        key = match.group(1)
        if key not in data:
            missing.append(key)
            return match.group(0)
        return str(data[key])

    html = PLACEHOLDER.sub(replace, template)
    if missing:
        sys.exit(f"[{lang}] missing translation keys: {', '.join(sorted(set(missing)))}")
    return html


def build_sitemap() -> str:
    alternates = "\n".join(
        f'    <xhtml:link rel="alternate" hreflang="{code}" href="{info[2]}"/>'
        for code, info in LANGS.items()
    ) + f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{LANGS["es"][2]}"/>'
    urls = "\n".join(
        f"  <url>\n    <loc>{info[2]}</loc>\n{alternates}\n  </url>" for info in LANGS.values()
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        f"{urls}\n</urlset>\n"
    )


def main():
    template = (SRC / "template.html").read_text(encoding="utf-8")
    for lang, (out_file, _, _) in LANGS.items():
        target = ROOT / out_file
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(build_page(template, lang), encoding="utf-8")
        print(f"built {out_file}")
    (ROOT / "sitemap.xml").write_text(build_sitemap(), encoding="utf-8")
    print("built sitemap.xml")


if __name__ == "__main__":
    main()

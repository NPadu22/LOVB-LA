#!/usr/bin/env python3
"""Build index.html (GitHub Pages) from the app source file.

The source file is the Claude-artifact version: its head tags sit after <body>,
which Claude's artifact wrapper tolerates. Phones only read the app icon, name and
full-screen settings from a real <head>, so this script moves them there, points
the icons at PNG files, and adds a web manifest and link-preview tags.

Run after every change to the source:  python3 scripts/build-pages.py
"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "LA Orbit Nutrition.html"
OUT = ROOT / "index.html"
PAGES_URL = "https://npadu22.github.io/LOVB-LA/"
NAME = "LA Orbit Sports Performance"
SHORT = "LA Orbit"
DESC = "Fuel, recovery, travel and nutrition education for the LA Orbit."

s = SRC.read_text(encoding="utf-8")

# 1. Split off the loose head tags that follow <body> (title, icons, metas, fonts).
first_line, rest = s.split("\n", 1)
assert first_line.startswith("<!doctype html>") and first_line.endswith("<body>"), "unexpected first line"
loose, body = rest.split('<style id="af-style">', 1)
body = '<style id="af-style">' + body

# 2. Drop embedded-icon and title lines from the loose tags; we write our own.
keep = [ln for ln in loose.splitlines()
        if ln.strip() and not re.search(r"<title>|rel=\"(apple-touch-icon|icon)\"|apple-mobile-web-app-title", ln)]

head = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{NAME}</title>
<meta name="description" content="{DESC}">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="icon-180.png">
<link rel="manifest" href="manifest.webmanifest">
<meta name="apple-mobile-web-app-title" content="{SHORT}">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta property="og:type" content="website">
<meta property="og:title" content="{NAME}">
<meta property="og:description" content="{DESC}">
<meta property="og:url" content="{PAGES_URL}">
<meta property="og:image" content="{PAGES_URL}icon-512.png">
<meta property="og:image:width" content="512">
<meta property="og:image:height" content="512">
<meta name="twitter:card" content="summary">
{chr(10).join(keep)}
</head>
<body>
"""

# 3. Pages has no Claude editor; point the share link at the Pages address.
body = re.sub(r'appLink: "[^"]*"', f'appLink: "{PAGES_URL}"', body, count=1)

OUT.write_text(head + body, encoding="utf-8")
print(f"wrote {OUT.name} ({OUT.stat().st_size:,} bytes)")

#!/usr/bin/env python3
"""Smoke: build offline file, assert structure + key public facts."""
import os, subprocess, sys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(HERE)
subprocess.check_call([sys.executable, "build.py"])
path = os.path.join(HERE, "dist/ravens-gameday.html")
html = open(path, encoding="utf-8").read()
assert len(html) > 20000, "dist too small"
needles = [
    "Ravens Game Day HQ", "8:20 PM EDT", "Mercedes-Benz Stadium",
    "Tennessee Titans", "Atlanta Falcons", "98 Rock", "WBAL",
    "Simmons Sunday", "body {", "RG =", "4281",
    "41-23", "17-24", "34-31", "24-18",
    "Cleveland Browns", "Buffalo Bills", "localStorage",
]
for needle in needles:
    assert needle in html, f"missing: {needle}"
assert "/*__CSS__*/" not in html and "/*__APP__*/" not in html
print("OK smoke", path, len(html), "bytes")

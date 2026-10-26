#!/usr/bin/env python3
"""Build Teatro's registered /teatro WLAN overlay from the canonical site tree."""
from pathlib import Path
import argparse
import re
import shutil

TEXT_SUFFIXES={".html",".css",".js",".mjs",".json",".svg",".xml",".webmanifest"}
PATH=re.compile(r'(["\'`])/(assets|editions|scenarios|media)/')
PREFIX={"assets":"/teatro/first-hearing-assets/",
        "editions":"/teatro/editions/",
        "scenarios":"/teatro/scenarios/",
        "media":"/teatro/media/"}

def main(source:Path, output:Path):
    source=source.resolve(); output=output.resolve()
    if not (source/"index.html").is_file():
        raise SystemExit("canonical Teatro site index is missing")
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)
    for item in source.iterdir():
        target=output/("first-hearing-assets" if item.name=="assets" else item.name)
        if item.is_dir(): shutil.copytree(item,target)
        elif item.is_file(): shutil.copyfile(item,target)
    replacements=0
    for path in output.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES: continue
        try: text=path.read_text(encoding="utf-8")
        except UnicodeDecodeError: continue
        rewritten,n=PATH.subn(lambda m:m.group(1)+PREFIX[m.group(2)],text)
        if n:
            path.write_text(rewritten,encoding="utf-8")
            replacements+=n
    required=[output/"index.html",output/"editions/first-hearing/index.html",
      output/"editions/stage/index.html",output/"editions/stage/embed/index.html",
      output/"scenarios/satzfunk-player/ear-wind/index.html",
      output/"scenarios/satzfunk-player/ear-wind/runner.mjs",
      output/"scenarios/satzfunk-player/ear-wind/scenario.json",
      output/"first-hearing-assets/index-BYTRORXG.js",
      output/"first-hearing-assets/linotype/satzfunk-player/teatro-scenario-runtime.mjs",
      output/"first-hearing-assets/linotype/ear-original.js"]
    missing=[str(p.relative_to(output)) for p in required if not p.is_file()]
    if missing: raise SystemExit("overlay is incomplete: "+", ".join(missing))
    runner=(output/"scenarios/satzfunk-player/ear-wind/runner.mjs").read_text(encoding="utf-8")
    if 'media: "/teatro/media/' not in runner or "fetch(track.media" not in runner or "mediaBasePrefix" in runner:
        raise SystemExit("staged SatzfunkPlayer route must fetch its already-rewritten same-origin media path exactly once")
    for path in output.rglob("*"):
        if path.is_file() and path.suffix.lower() in TEXT_SUFFIXES:
            text=path.read_text(encoding="utf-8")
            if PATH.search(text): raise SystemExit("unprefixed Teatro root URL remains: "+str(path))
    print("TEATRO_WLAN_OVERLAY",len([p for p in output.rglob("*") if p.is_file()]),
      "files",replacements,"route and asset URL rewrites",output)

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--source",type=Path,required=True)
    parser.add_argument("--output",type=Path,required=True)
    args=parser.parse_args();main(args.source,args.output)

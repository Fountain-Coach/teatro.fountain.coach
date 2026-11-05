#!/usr/bin/env python3
"""Route-scoped private staging handoff; preserve the current Linotype reader."""
from pathlib import Path
import sys
original=Path(sys.argv[1]).read_text()
destination=Path(sys.argv[2])
start='<template data-reader-volume="first-readings">'
assert original.count(start)==1, "Expected exactly one original First Readings volume"
i=original.index(start)
j=original.index("</template>",i)
fragment=original[i:j]
marker="</figure></article>"
assert fragment.count(marker)==1, "First Readings end-anchor changed"
addition=('<p class="teatro-interlude-entry"><a href="/teatro/interludes/kino/" '
          'aria-label="Open Kino After Dark, the Teatro dance interlude">'
          'Interlude · Kino After Dark — a dance between readings</a></p>')
if addition not in fragment:
    fragment=fragment.replace(marker,"</figure>"+addition+"</article>",1)
    result=original[:i]+fragment+original[j:]
else:
    result=original
assert result.count(addition)==1
assert original[:i]==result[:i] and original[j:]==result[result.index("</template>",i):], "Unexpected changes outside First Readings"
destination.parent.mkdir(parents=True,exist_ok=True)
destination.write_text(result)
print("Stage-only First Readings handoff:",destination,len(result),"bytes")

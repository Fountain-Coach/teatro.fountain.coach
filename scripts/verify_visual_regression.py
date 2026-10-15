#!/usr/bin/env python3
"""Pixel VRT against a provisional candidate golden and the rejected v31 frame."""
from pathlib import Path
import re
import subprocess

ROOT=Path(__file__).resolve().parents[1]
QA=ROOT/'docs/qa/r32'
TEST=Path('/tmp/teatro-v32-iPad-portrait.png')
GOLD=QA/'score-identity-v32-ipad-portrait.png'
REJECTED=QA/'previous-v31-ipad-portrait.png'

def relative_rmse(before,after):
    p=subprocess.run(['magick','compare','-metric','RMSE',str(before),str(after),'null:'],capture_output=True,text=True)
    if p.returncode not in (0,1):raise RuntimeError(p.stderr[-1000:])
    match=re.search(r'\((0(?:\.\d+)?|1(?:\.0+)?)\)',p.stderr)
    if not match:raise RuntimeError('No RMSE '+p.stderr[:400])
    return float(match.group(1))

def main():
    for p in [TEST,GOLD,REJECTED]:
        assert p.is_file() and p.stat().st_size>15000,p
    baseline_change=relative_rmse(REJECTED,GOLD)
    candidate_change=relative_rmse(GOLD,TEST)
    assert baseline_change>0.045,('v31 and v32 appear nearly identical',baseline_change)
    assert candidate_change<0.012,('candidate drifted from provisional VRT witness',candidate_change)
    print('VISUAL_REGRESSION_ACCEPTED',dict(rejected_v31_to_candidate_rmse=round(baseline_change,6),current_to_provisional_r32_rmse=round(candidate_change,6),viewport='820x1180',capture='Chromium CDP; not native iPad Safari',golden='candidate requiring author visual acceptance'))

if __name__=='__main__':main()

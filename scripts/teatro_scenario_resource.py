"""Render the inspectable, non-admitted SatzfunkPlayer Teatro resource route."""
from pathlib import Path
import hashlib
import json


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def render_scenario_resource(scenario):
    if scenario.get("scenarioID") != "teatro.satzfunk-player-ear-wind.01":
        raise ValueError("Unexpected Teatro scenario identity")
    if scenario.get("status") != "candidate-unadmitted":
        raise ValueError("Resource route only renders an unadmitted candidate")
    return """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>SatzfunkPlayer · Ear → Csound | Teatro</title><style>body{max-width:760px;margin:8vh auto;padding:0 22px;background:#f5f0e6;color:#211e1a;font:18px/1.6 Georgia,serif}h1{font-size:clamp(32px,6vw,54px);line-height:1.05}code,pre{font:13px/1.5 ui-monospace,monospace}pre{overflow:auto;padding:18px;background:#eae3d7}a{color:inherit;text-underline-offset:4px}.status{padding:12px 14px;border-left:3px solid #916c3b;background:#eee5d7}nav{font:13px/1.5 ui-monospace,monospace}</style></head>
<body><nav><a href="/editions/first-hearing/">← First Hearing book</a></nav><main><p>TEATRO SCENARIO · CSOUND DSL 0.1</p><h1>SatzfunkPlayer, heard by Ear, shaping wind</h1><p>This resource describes one bounded live patch: SatzfunkPlayer's live PCM feeds Ear; Ear's measured RMS maps to the Csound FIELD control <code>wind_mix</code>. The Player owns playback, admission, and start/stop runtime. Teatro owns this semantic scenario.</p><p class="status"><strong>Candidate · not admitted · not live-accepted.</strong> The route exposes the versioned scenario and its Player runtime contract. A secure same-origin released track and a witnessed staging run are still required for live acceptance. Nothing starts automatically.</p><h2>Declared control path</h2><pre>SatzfunkPlayer.01.audio → Ear.Player.01.audio
Ear.Player.01.rms → Wind.Field.01.wind_mix
Wind.Field.01.audio → Ear.Wind.01.audio</pre><p>The mapping clamps RMS 0–0.20 to <code>wind_mix</code> 0.25–1.0, with a minimum 75 ms interval. The scenario does not claim a MIDI 2.0 Player operation; its audio path is local Web Audio and Csound host routing.</p><p><a href="scenario.json" type="application/json">Read the Csound Teatro Scenario JSON 0.1</a></p><p><a href="/editions/first-hearing/">Return to the book</a></p></main></body></html>
"""


def write_scenario_resource(site, scenario, scenario_bytes=None, route_source=None):
    site = Path(site)
    scenario_bytes = scenario_bytes or (json.dumps(scenario, indent=2, ensure_ascii=False) + "\n").encode()
    if json.loads(scenario_bytes) != scenario:
        raise ValueError("Scenario resource bytes do not match the parsed source")
    route = render_scenario_resource(scenario)
    route_dir = site / "scenarios/satzfunk-player/ear-wind"
    route_dir.mkdir(parents=True, exist_ok=True)
    (route_dir / "scenario.json").write_bytes(scenario_bytes)
    if route_source is not None:
        route_source = Path(route_source)
        page_source = route_source / "index.html"
        runner_source = route_source / "runner.mjs"
        if not page_source.is_file() or not runner_source.is_file():
            raise ValueError("Executable Scenario route requires source-owned index.html and runner.mjs")
        page_bytes = page_source.read_bytes()
        runner_bytes = runner_source.read_bytes()
        (route_dir / "index.html").write_bytes(page_bytes)
        (route_dir / "runner.mjs").write_bytes(runner_bytes)
        route_digest = sha(page_bytes)
    else:
        (route_dir / "index.html").write_text(route)
        route_digest = sha(route.encode())
    return sha(scenario_bytes), route_digest

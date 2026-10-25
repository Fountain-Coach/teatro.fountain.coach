# SatzfunkPlayer → Ear → Csound: WLAN candidate v37

## Result

The candidate scenario is available through the existing registered WLAN staging service. It is a static, inspectable Linotype book and scenario resource. It is **not live-accepted** and has not been published to production.

- Stage entry: `http://benedikt-Macmini.local:8200/teatro/`
- Book: `http://benedikt-Macmini.local:8200/teatro/editions/first-hearing/`
- Scenario resource: `http://benedikt-Macmini.local:8200/teatro/scenarios/satzfunk-player/ear-wind/`
- Machine-readable DSL: `http://benedikt-Macmini.local:8200/teatro/scenarios/satzfunk-player/ear-wind/scenario.json`
- Active release: `shared-shell-20261025-v37-satzfunk-player-scenario-1e8315b`
- Predecessor retained for rollback: `shared-shell-20261025-v36-composing-by-ear-mobile-0efbd70`
- Teatro source: `Fountain-Coach/teatro.fountain.coach@1e8315b82dde5890f98b39026e5afe830943f17b`
- Runtime owner: `Fountain-Coach/SatzfunkPlayer@376747d96f0df9e0b95f43ab35114a4a8c88f33c`
- Scenario: `teatro.satzfunk-player-ear-wind.01`, Csound Teatro DSL/schema 0.1, `candidate-unadmitted`

## Stage readback

The existing `fountain-shell-acceptance-preview.service` serves the v37 release from the registered Ubuntu WLAN host. After the atomic `current` symlink change, the already-running process initially returned 404 for the new paths. Restarting that same user service loaded the new release. Final readback returned HTTP 200 for the book, scenario route, JSON, Player runtime module, and Teatro stage entrance. The 17 same-origin resources linked from the book all returned 200.

The previous v36 release remains intact. The v37 source lock records the managed Teatro entrance link and all new paths. The copied book and scenario assets use an isolated `/teatro/first-hearing-assets/` base to avoid collisions with existing stage assets.

The direct First Hearing production route returned HTTP 404 during this check. No public production files, DNS, or Caddy configuration changed.

## Acceptance boundary

The stage origin is HTTP. It does not provide a secure context for the Csound AudioWorklet. No released same-origin track was admitted for this Player scenario, so no Player → Ear → Csound live run or live-output receipt was produced. The route says this explicitly and does not claim a MIDI 2.0 Player operation. The active stage remains a candidate; the audio DoD is still open.

A headless Chrome 155 view on the stage host confirmed the book toolbar exposes the Scenario route and the resource displays the candidate state and declared routing. Native iPad Safari acceptance was not performed.

## Checks

- `python3 scripts/verify_first_hearing.py` — passed; all 22 original source paragraphs retained.
- `npm test` in SatzfunkPlayer — 107 passed, 0 failed.
- Stage route/resource readback — book, scenario HTML, scenario JSON, and Player runtime module returned 200.
- Book-linked same-origin resource sweep — 17 checked, 0 failed.

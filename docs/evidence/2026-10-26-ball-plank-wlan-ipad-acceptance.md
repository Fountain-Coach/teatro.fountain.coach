# Ball / Plank / Impulse — WLAN HTTPS acceptance and physical-iPad boundary

**Observed 2026-10-26 (Europe/Berlin).** This record continues the [source and Mac-browser evidence](2026-10-26-ball-plank-impulse-browser-rehearsal.md). Claims distinguish a source candidate, browser runtime, private staging and physical-device acceptance. **No production effect.**

## Exact identities

- **Scenario:** `teatro.ball-plank-impulse-synth-ab.rehearsal.01`; `Fountain-Coach/teatro.fountain.coach@14a82523aa9c0368857669481c876e851ac57e62`, `scenarios/csound-teatro/ball-plank-impulse-synth.live.json`, status `candidate-unadmitted`.
- **Web implementation:** `Fountain-Coach/midi2-gpu-fabric@48d316a623f94902b289302288b9067d9a097531`, `apps/teatro-stage-web`.
- **Staging release:** `teatro-ball-plank-impulse-v51-20261026-48d316a`, built from a clean detached Git worktree with `npm ci` and `vite build`, plus the exact Scenario source.
- **Owner-controlled WLAN HTTPS:** `https://192.168.8.11:8443/teatro.fountain.coach/experiments/ball-plank-impulse/`.
- **Immutable manifest SHA-256:** `71f2eb3afea21d1dc1a2fdddf71c2813f840738932ab09d47c9f4f4f3d6dc1e9`.
- **Release storage:** `/home/benedikt/estate-wlan-staging/20260926-semantic/teatro.fountain.coach/experiments/_releases/teatro-ball-plank-impulse-v51-20261026-48d316a`, source-addressed via a new sibling `ball-plank-impulse` symlink under `experiments`. The existing older synth and all public production routes remain unchanged. The already-running owner-WLAN TLS gateway was reused, not reconfigured.

## Staging and build checks

1. Exact clean-web-source build: **PASS**, 57 Vite modules, 4 generated web files; focused `vitest`: **13/13 PASS** (impact mapping 4, synth model 6, existing Csound 3).
2. Remote candidate manifest: **PASS**, SHA-256 and file sizes all match `release.json`; six files including Scenario and release receipt. The candidate was promoted to a new *private immutable experiment route* only. Existing classic-techno-deck HTTPS URL still returned 200.
3. TLS gateway independent `curl` readback: new index, `scenario.json`, `release.json`, and JS artifact all **HTTP 200**; `ssl_verify_result=0` on the Mac's configured curl trust environment. This alone is **not** browser trust on all clients.
4. Headless Google Chrome without certificate override: **FAILED** `net::ERR_CERT_AUTHORITY_INVALID`; the gateway presents a Fountain Coach local-WLAN-CA-issued certificate which this Chrome environment does not trust. Do not assert globally trusted HTTPS.
5. Separate controlled macOS Chrome **diagnostic** using `ignoreHTTPSErrors:true`: the page reported a secure context and AudioWorklet support, and the original actual Csound PCM path ran. This deliberately bypassed the test browser's CA validation and **is not evidence of trusted iPad TLS**.

## Real browser signal witness (diagnostic certificate exception)

| Assertion | Observation |
| --- | --- |
| First stage view | One WebGL canvas, `BALL / PLANK` heading, contact count 0 |
| Camera orbit | Contact count remained 0 |
| Start | `CSOUND ACTIVE` |
| Ball A drop | Actual Cannon receipt `collision.a.1`; real Ear RMS **0.0964**, peak **0.2269** |
| A/B crossfade and Ball B drop | Crossfader at **100 (B)**; actual `collision.b.1`; real Ear RMS **0.0574**, peak **0.2075** |
| Stop | Real Ear RMS **0.0000**, peak **0.0000**; no uncaught browser exceptions or 4xx/5xx assets |

A screenshot is retained only as diagnostic material on the authorized Mac at `/tmp/teatro-ball-plank-wlan-20261026.png`. Do not treat it as a physical iPad capture, AX witness, or public publication.

## Physical iPad acceptance attempt

- Xcode/CoreDevice detected the **paired iPad Pro (11-inch, third generation), iPadOS 26.6.2**.
- Apple `devicectl device process launch --payload-url` successfully launched `com.apple.mobilesafari` with the staging URL on that physical device. **Launch success does not prove page rendering, certificate trust, gestures, Csound PCM or Ear readings.**
- Apple's stock `safaridriver` `platformName=iOS` / physical-iPad WebDriver session was refused with the exact message: **`Web Inspector is not enabled on device`**.
- An isolated XCUITest harness was created outside any Reframe checkout with a distinct app bundle ID. Its native iOS build-for-testing succeeded with existing developer credentials; it did **not** replace Reframe or mutate the staged app.
- Xcode physical test execution stopped before any AX action: **`Unlock iPadPro (3) to Continue`**. The paired device was locked. The waiting Xcode test was interrupted; no bypass, passcode collection, device setting mutation, or false success. Consequently there is **no physical-device AX/audio/visual acceptance receipt**.

## Native Csound Teatro Scenario admission

Still **not established**. `Fountain-Coach/domain-reasoning/ReasoningHost/Sources/ScreenplayComposition/CsoundTeatroBoundary.swift` provides typed request/receipt boundaries and the fail-closed `UnconnectedCsoundTeatroDriver`. `FountainScenarioKit`'s generic scenario lifecycle and a browser-local Csound Start do **not** perform the Chapter 151 Csound Teatro 0.1 native-binding admission. The stage retains `candidate-unadmitted`; there are no FountainStore terminal receipts for this native Scenario. This remains separate from the observed real macOS browser synthesis.

## Disposition

**Complete within this phase:** staged private source-pinned HTTPS route; verified exact transferred bytes; running two-world browser Csound/Ear with bounded Stop; user-copyable route; preserved predecessor/public production.

**Open acceptance facts:** trusted iPad certificate, live physical iPad Stage/audio/Stop, native Csound Teatro admission and Store-backed lifecycle evidence. They cannot be inferred from web simulation or the WebDriver/XCTest attempts. N.'s *Outside Has No ViewBox* and public edition remain untouched. The separately authored [Teatro Insert proposal](../proposals/2026-10-26-ball-plank-outside-inserts.md) is still a future source-addressed handoff, not a published interactive story.

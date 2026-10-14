# teatro.fountain.coach - owning Git source

GitHub source authority for teatro.fountain.coach and its site/ publishing tree.
Role: Teatro performance and executable score; one of three front-door identities

Status: verified-live-publication-baseline

The former midi2-gpu-fabric/estate/sites/teatro.fountain.coach is a downstream integration copy, not an independent editor. Git source is not a public deployment. Source review, a pinned derived checkout, separate EstatePublisher authorization, release receipt and live HTTPS read-back are required.

The editorial estate has only three public fronts: Fountain Coach, First Reading and Teatro. Other domains remain supporting, legal, reference or archival surfaces. No GitHub CI, raw host deployment or secrets.

## Teatro is a book first — First Hearing

The editorial entrance to teatro.fountain.coach is a real source-owned
Linotype book, also available as /editions/first-hearing/ — not the exposed
3D stage. The book contains the complete 22-paragraph essay
Teatro — An Unfinished Composition, its original authored score plate
and an exact-source provenance receipt pinned to Fountain-Coach/fountain.coach.

The pagination runtime is the accepted First Reading/Fountain Press engine
with preserved iPad facing-spread, portrait single leaf and phone page atlas.
The original text and illustration bytes are not rewritten.

Satzfunk First Hearing is a quiet Hear control on the manuscript. It
consults author-approved, source-matched released media and chapter transcript
only. No narrated edition is yet approved; the rail must say so, and cannot
replace narration with unrelated audio or initiate unauthorized voice synthesis.

The existing Teatro Stage Web — its 3.4 MB compiled runtime and interactive
browser-Csound environment — remains preserved at /editions/stage/, linked
from the book and returning to it. Activating the actual stage sound is
not evidence of a released narrated edition, Reframe First Reading receipt,
MIDI 2.0 native performance or Ear witness.

Build from neighboring independent GitHub owning checkouts with npm run build;
run npm run check and npm run browser. Edition provenance is pinned in
site/editions/first-hearing/edition.json, and site/ is inventoried by
publication-files.sha256. This is a Git source candidate and WLAN staging
edition. Live production HTTPS requires separate publishing authorization.


## The executable plate belongs in the book

The second plate of **Teatro — An Unfinished Composition** is a page inside
the measured Linotype book, not a link out to the standalone Stage edition.
The **Scene** rail takes the reader to that typeset leaf. The original compiled
WebGL/Csound stage runtime loads only while the leaf is visible; leaving the
leaf unloads its frame and releases its media/graphics lifetime. Audio remains
explicitly user-activated, not an approved spoken recording.

Runtime owner: `site/assets/index-CY5_5ULO.js`. The embedded chrome-free route
`/editions/stage/embed/` is internal to the interactive plate. The full Stage
edition survives at `/editions/stage/` for separate development. If WebGL
is unavailable, the original runtime displays its moving isometric SVG
fallback; the browser acceptance test reports which path was exercised.
Build authoring is in `scripts/integrate_interactive_plate.py`.

## The current page is not yet the final Teatro / Reframe UX

Author-observed WLAN v6 on 14 October 2026 is **UX rejected**, even though
the original WebGL runtime is embedded, responsive page-count tests pass,
and the SVG fallback animates. A large frame and inconsistent running
matter are not literary composition. The governing next product journey
is [Reframe Scenario 012](https://github.com/Fountain-Coach/Reframe/blob/main/scenarios/012-linotype-book-as-reframe-workspace.md):
actual text, scene, score and editorial margin become one paginated,
source-addressed working book. Fountain Press owns paper composition;
Reframe owns writer identity, revisions and persistence; Teatro owns its
original scene runtime and instruments. No writer UX acceptance is claimed.


## R12 Slice A — semantic mixed-media book candidate

The rejected v6 full-leaf embed has been superseded **in source** by an
illustration attached to the exact authorial paragraph beginning
“This is an old knowledge of theatre.” The original paragraph and scene
occupy one typeset leaf. Fountain Press owns the measured
`data-press-media` composition and Teatro's original compiled WebGL/Csound
runtime is mounted only when the actual leaf is visible. Edition-specific
Teatro running matter replaces the inherited Solstice/Essays folio.
The browser proof verifies source/element IDs, complete 22-paragraph
manuscript, ratio/overflow, clipped diagnostic HUD, animated fallback
and resource release. **The actual iPad Safari GPU result and writer
approval remain pending**; the R12 product checker must still report blocked.

## R12 puppet fallback, source-authority witness (v8)

The earlier original compiled Teatro stage switches to `EmptyStageView`
when a WebGL context cannot be created. Consequently an iPad could show
only an empty geometric room indefinitely, even though the canonical
StageEngine continued producing puppet snapshots. R12 v8 adds a *book-only*
renderer-independent projection of the **original StageEngine and StageView**
owned by midi2-gpu-fabric source branch
`codex/teatro-r12-moving-puppet-fallback-20261014` (commit `30565d1`).
The original WebGL/Csound runtime and separately accessible Stage edition
remain byte-preserved. On failed WebGL initialization the book element's
fallback renders the actual controller, suspended strings, moving torso,
head, hands and feet; it never invents performance speech or sound.
On working WebGL the overlay is not mounted. Leaving the book leaf unloads
both the original scene iframe and the fallback rig. Generated fallback
assets are pinned by SHA-256 and the upstream source Git commit.

Automated browser acceptance now checks that the fallback puppet **exists
and moves**, rather than counting a static SVG or empty Stage as success.
Chrome's headless GPU still cannot prove real iPad Safari WebGL, and this
remains a candidate until writer approval.

## R12: one player, MIDI2 book, Ear (staging candidate)

The reader's former Scene and Hear controls, plus the oversized empty
Satzfunk hearing rail, are replaced by **one small media transport**.
Its disclosure shows four existing Csound-derived instrument channels
(wind, turbulence, head motion, resonance) and an Ear meter. The
original 22 paragraphs and spatial puppet remain attached to their
authored sources. No recorded spoken edition is asserted.

Fountain Press owns the reusable shell and bounded local MIDI2 Universal
MIDI Packet event plane (commit 476ab2b). Every page change emits MIDI2
Channel Voice 64-bit CC values for position/focus, and book transport,
parameters and measured Ear signal publish their own declared controllers.
The book accepts explicit local MIDI2 UMP input for pagination,
transport and parameters. This is a browser-local MIDI2 message plane,
NOT proof of a physical MIDI2 input/output port or a Store receipt.
The stage may send bounded motion observations to the book across the
same-origin iframe boundary.

On HTTPS or localhost a user gesture attempts the real
`BrowserCsoundRuntime` and its explicit `EarAudioTap`, owned in
midi2-gpu-fabric source branch
`codex/teatro-r12-moving-puppet-fallback-20261014`.
On the HTTP WLAN staging host, where Csound's AudioWorklet cannot start,
an explicitly identified **Web Audio instrument preview** produces actual
sound. Ear measures its real analyser samples and emits bounded UMP
observations only for witnessed output. This preview is not Csound, a
narration, or a surrogate approval of canonical Csound/MIDI2 execution.
The source Csound host is still a development branch; release to mainline,
secure-origin evidence, hardware bridges and author iPad proof remain open.

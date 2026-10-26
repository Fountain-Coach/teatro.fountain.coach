# Reciprocal Teatro <-> Linotype workflow

The companion ChatGPT skill is `linotype-estate-template` (Linotype Estate Template). Invoke it when the observable request crosses from a canonical Teatro Scenario/Stage into a **book folio, source-addressed reading, edition, Bookshelf, static estate shell, staging or publication**. Conversely, a Linotype request that needs a *new/changed executable Teatro Scenario or native Stage projection* should invoke this Teatro Scenario Composer skill. Do not force both skills for isolated tasks.

| Teatro Scenario Composer owns | Linotype Estate Template owns |
| --- | --- |
| Versioned Csound Teatro DSL, relations, typed ports, participant identities, accepted mappings | Book/folio composition and source-addressed reading order |
| Reuse of TeatroStageEngine, live or deterministic scene projection, MIDI 2.0 and Csound/Ear runtime evidence | Cover, mixed-media leaf, Bookshelf placement, measured Linotype reader, estate navigation |
| Instrument discovery/CI, resolved bindings, Scenario admission and Stop | Publisher preview/check-in, provenance/right checks, Git-to-WLAN staging and authorized public release |
| Source stage/score identity and runtime evidence handed over | Publication identity and public route handed back when separately authorized |

The current First Hearing includes a Linotype reader that embeds a Teatro Stage element. That is an **integration boundary**; the iframe, folio and source quote do not re-own the live Stage or authorize sound. Keep only the source-appropriate visual projection in the page and make source identity, canvas dimensions, lifecycle, audio ownership, focus and exit/Stop behavior explicit. Never publish the unadmitted `composing-by-ear.live.json` as a proven performance.

## Minimal handoff record

For Teatro -> Linotype, provide:

- canonical Scenario ID, grammar/schema versions, source repository path and exact commit;
- stable score/stage entity identity, source address and provenance;
- declared available projection(s), interactive entry/exit and publication rights;
- live-run status (`candidate`, `admitted`, `observed`, etc.) and actual evidence; no guessed runtime claims;
- requested edition/folio/Bookshelf destination, if any, without fabricating a new public route.

For Linotype -> Teatro, provide:

- exact source anchor/folio and event or musical intention;
- desired spatial/sonic relation and expected user-visible interaction;
- existing stage source/Scenario IDs, if present;
- limit of publication request (preview only, WLAN stage, or separately authorized public release).

## Example

"Show the live *Composing by Ear* composition while reading First Hearing" is a composed task: Teatro verifies/adapts the actual Scenario and stage projection; Linotype anchors that projection in the accepted reader and preserves navigation, source text and publication controls. Both use the same canonical Scenario identity. Neither writes a second interpreter or presents a static diagram as a live patch.

**If the companion skill is not installed**, do not pretend to invoke it. Use these documented boundaries, deliver the bounded part of the work, and identify missing publication-specific instructions rather than inventing another workflow.

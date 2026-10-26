# Possible Teatro Inserts for N.'s *Outside Has No ViewBox*

**Review date:** 26 October 2026  
**Source inspected:** User-provided 14 rasterized PDF page images in `N_Outside_Has_No_ViewBox_page_images.zip`. These pages establish visible folio order and words. They do **not** provide the canonical editable manuscript, registered passage/paragraph IDs, original SVG source bytes, or an admitted published edition.

**Disposition:** source-addressing **proposal only**. No book was changed. No sound was added to the PDF. No rights, publication, live playback or native Scenario admission is implied. Instrument remains autonomous: [Ball / Plank / Impulse](../../scenarios/csound-teatro/ball-plank-impulse-synth.live.json).

## Compositional decision

The original instrument has no tram stops, words or 72-second timer. It is physics-excited sound. The story can *invite* the reader to enter that same stage at four dramatically precise positions. A stop is a reader-authorized instance/preset of an already-admitted instrument, not a new FCIS instrument and not a substitute for Linotype's prose composition.

The book remains readable without sound, a browser, network access or any live effect. The performance cannot autonomously advance the page or overwrite N.'s writing. A tactile Play / End is optional; return to the exact source address after End.

## Possible insert placements and sonic situations

| Source location in supplied raster edition | Invitation and situation | Teatro transformation | Constraint |
| --- | --- | --- | --- |
| p. 04 — **Haltestelle eins.** / *The veil* | An optional sounding surface beside the pause at the first stop | One ball held above a glass-like plank. Its landing is reader-caused; the stage may rotate even when nothing sounds | Do not emit an arrival cue automatically. Waiting is not a metronome |
| p. 07 — **Haltestelle zwei.** / *The table / distance* | Two ball/plank worlds placed with audible separation | A/B crossfade spans the gap. Tilting one plank can postpone or miss an impact; reader may clone a material state, not an elapsed contact | Preserve the printed **no tempo correction** instruction and the missed-gesture dramaturgy |
| p. 10 — **Haltestelle drei.** / *The crown / two points* | A split sounding plank with two distinct contact positions | Contact near either end changes strike-position brightness of existing Csound voices; no identity is imposed on a person | Do not make a broken crown into a puppet, named actor, or narrated role |
| p. 11 — **Yellow is not an answer.** / *The field / the last stop* | A stage that rotates as sound decays | Reader can release a final ball; Ear reports the real sound decay; allow at least eight seconds of silent yellow field in the story-specific projection | Silence is a meaningful state. Do not force a closing note or resolution |

Other source-bearing places:

- p. 03, opening **Das Fenster ist keine Tür.** introduces the stage metaphor; should remain pure reading rather than an autoplay prelude.
- p. 06, **Schnippel.svg**, explicitly presents SVG code as an inspectable actor/path. Preserve the actual SVG source; do not turn its snippet into a raster illustration or claim the ball/plank physics replaces it.
- p. 08, **Über den Wolken**, names Reinhard Mey as remembered musical reference. Per the imprint on p. 14, the edition does not reproduce lyrics, score, song audio or recording. The proposed impulse instrument generates entirely original Csound sound, never the referenced recording.
- p. 12, **Four things to try**, declares the original four stop intervals (0–16 s, 16–32 s, 32–48 s and 48–72 s). These are an *optional* rehearsal view of the story, not the native instrument's triggering clock.
- p. 13, **A path without Z.**, is a coda; prefer allowing the reader to return to the page from a stopped instrument rather than inventing a fifth sound movement.
- p. 14, imprint says the PDF is unpublished and has **no embedded recording or audible performance**. Treat that as a hard present-edition fact, not a defect to silently rewrite.

## Proposed Linotype–Teatro handoff contract

A later source-admitted insert would carry:
```
sourceWorkIdentity:   must be resolved from original manuscript owner
sourceEditionRevision: must be verified before any mutation
sourcePassageAddress:  must be resolved from canonical Linotype source
TeatroScenarioID:     teatro.ball-plank-impulse-synth-ab.rehearsal.01
TeatroScenarioVersion: grammar 0.1; exact admitted commit/hash required
TeatroScenePreset:    one of stop-1 / stop-2 / stop-3 / stop-4 derived from story edition
Start:                explicit reader gesture and permitted local audio host
Stop:                 silent audio, closed context, Ear terminal observation
Fallback:             stable source-addressed image and accessible semantic description
Return:               restore exact source folio + reading position + focus
PublicationAuthority: Linotype/Press/Edition -> EstatePublisher, independent of this rehearsal
```

The four stop presets belong to the edition projection, not inside the generic instrument source. Later, if a writer authorizes an actual **interactive First Hearing** edition, source ownership must first bind the exact manuscript/folio IDs. The PDF page PNGs cannot substitute for that. No new site, runtime or default audio tracks are needed to author these ideas.

## Reading experience to preserve

The stage should feel like a small physical recess within the book rather than a separate DAW. A brief gesture creates a material consequence. When the reader returns to the text, the story has not advanced on their behalf. Most importantly, **the fourth stop must be allowed not to answer**.

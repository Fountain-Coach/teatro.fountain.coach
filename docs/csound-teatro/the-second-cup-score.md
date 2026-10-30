# The Second Cup — Teatro rehearsal score

An original Teatro composition after **Teatro — An Unfinished Composition**, from the Fountain Coach **First Readings** collection.

The precise source observation: “Put an empty chair on a stage and wait long enough. It ceases to be furniture. Attention changes it.”

**Authored source:** [First Readings essay](https://github.com/Fountain-Coach/fountain.coach/blob/af2b33cd978a71c621c0ce042743dc2720ed3e01/site/essays/teatro-an-unfinished-composition/index.html). The kitchen and hallway actions are new compositions, not factual claims about the essay or the writer.

## A. The Second Cup · 80 seconds

One person in a kitchen, two chairs, a table, two cups, a sink and a window. The second chair is not occupied. The score does not say who might have occupied it.

| Movement | Time | Stage | Sound |
| --- | --- | --- | --- |
| I · Habit | 00–20 | The person places two cups on the table. | Coffee brewing; two distinct porcelain contacts. |
| II · Attention | 20–40 | Only the first cup is filled. A hand approaches the second cup and stops without pouring. | A single pour. Nothing is added at the withheld gesture. |
| III · Outside | 40–60 | No one enters. The person remains alone. | Bicycle passing; downstairs door; spoon touching porcelain. |
| IV · Decision | 60–80 | The second cup moves toward the sink, but returns to the table. It stays. | Brief scrape and contact; kettle switches off; quiet ending. |

**The score's decisive event is the ordinary action that does not complete.** Neither an imaginary second person nor their reason for absence may be added. No sentimental melody, disembodied narration, dramatic resolution or unrequested person enters.

## B. The Empty Hook · 60 seconds (independent transfer)

One person comes home, hangs one coat, reaches toward the adjacent unused hook, and withdraws the hand. A stairwell footstep and a key's small contact are heard. The empty hook remains empty. No second coat or visitor is invented.

The acoustic vocabulary must differ: latch, fabric, distant footstep, keys — not kitchen sounds.

## FCIS learning question

Can an agent transfer the verified compositional procedure **“make an unoccupied place perceptible through a withheld everyday action, without inventing a missing person's story”** across two distinct situations and sound environments?

An automatic Skill update is **not authorized by a source candidate alone**. The source tests check only structure and negative constraints. Native Teatro acceptance still requires owner-backed grammar and source binding, admitted Csound execution, output witnessed by Ear, canonical Stage state/snapshot evidence, a bounded Stop, and distinct real-run proof for both scenarios. Human editorial review then assesses whether the intended restrained dramatic result was achieved.

## Sources and tests

- Scenario source: scenarios/csound-teatro/the-second-cup.candidate.json
- Transfer source: scenarios/csound-teatro/the-empty-hook.transfer.candidate.json
- Source checker: scripts/csound-teatro/check-second-cup.mjs
- Regression suite: scripts/csound-teatro/second-cup.test.mjs
- Run from repository root: node --test scripts/csound-teatro/second-cup.test.mjs

Both files are CsoundTeatroScenario grammar/schema 0.1 **candidate-unadmitted**. The existing generic runtime's actual capability bindings are unresolved; the older source validator is explicitly for a different Sing/wind fixture. Passing this test does not grant native admission. The separately supplied audio rehearsals are original offline syntheses, not Csound or Ear measurements. No First Hearing publication or FCIS learning promotion is claimed.

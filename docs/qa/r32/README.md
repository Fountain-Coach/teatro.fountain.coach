# R32 — Score identity visual and end-to-end evidence

**Status:** technically verified candidate, awaiting author review on actual iPad Safari. Source remains unchanged. This is not proof of native Safari rendering.

## Failure reproduced, before the fix

The v31 WLAN Bookshelf could enter Teatro and produce a correctly ordered original Score, yet it still appeared inside an inherited Linotype paper leaf with running title, folio and portrait presentation. The newly introduced end-to-end test fails v31 explicitly: the first source Score is under `book-flow`, its rendered container is a `.linotype-sheet`, and no independent editorial-entry state exists. Hence its previous “DoD met” claim was not justified.

- [Rejected v31 iPad portrait screenshot](previous-v31-ipad-portrait.png)
- [R32 iPad portrait screenshot](score-identity-v32-ipad-portrait.png)
- [Side-by-side visual comparison](before-after-ipad.png)
- [Pixel difference map](visual-difference-v31-to-v32.png)
- [R32 iPad landscape](score-identity-v32-ipad-landscape.png) / [desktop](score-identity-v32-desktop.png) / [phone](score-identity-v32-phone.png)

These PNGs are captured from browser automation at 820×1180, 1180×820, 1366×768 and 390×844 CSS viewport sizes. The visual comparison is *not* a new authored Teatro plate.

## Acceptance checks

- The genuine source-digest-attested Score is presented once in its own editorial entry surface (directly under `#book-pages`), **outside** the paginated `#book-flow`.
- Its outer entrance is not a paper page: the Linotype sheet and folio have no visible client rectangles, and the Score occupies at least 72% of iPad portrait viewport width, 54% for wide viewports.
- No clipping or horizontal viewport overflow; image is loaded, not cropped or recreated.
- The Score's admitted sixth movement is a real, focusable region centered about 75% across the original image, plus an ordinary text link. No imaginary links for the other six movements.
- Pointer and keyboard activation enter exactly the admitted source paragraph. Explicit Score return and browser history both recover the Score, without a generic cover.
- Deep-link navigation, stale/unknown trace refusal, four-viewports rendering, 22 verbatim paragraphs and genuine user-activated audio are tested.
- Independent `npm run check`, `npm run browser`, `npm run browser:navigation` and `npm run browser:visual` checks must all pass.

A deterministic ImageMagick comparison on the 820×1180 viewport recorded **normalized RMSE 0.071286** between v31 and the first R32 candidate, and **0.000000** between the provisional R32 witness and its repeat capture. The provisional witness is a technical baseline only. It has not been approved by the human editor.

**This does not certify:** an actual iPad Safari run, all seven movements, general scored-navigation graph support, any production deployment, or that aesthetic author acceptance is complete.

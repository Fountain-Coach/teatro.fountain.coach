# First Reading cover drawing (alpha derivative)

`first-reading-ink.png` is derived from the authored Solstice image
`site/assets/edition/post-2025-12-22-b0e6cf8252aca0da.jpg` in
`Fountain-Coach/solstice.fountain.coach` (SHA-256
`b0e6cf8252aca0da83a9b0bfbdbb3f57b88c826e8b85ac5a89f43b23bad98876`).

The original JPEG and its published first-reading edition are unchanged.
For the bookshelf only, its nearly white paper was converted to image alpha
using grayscale inversion and a small levels threshold. Original linework,
lettering, crop, and 1024x1536 proportions are retained. The new PNG is an
asset, not CSS mix-blend-mode; it is hashed and admitted by the Teatro build.

Recreation (ImageMagick, only when intentionally changing this committed asset):

```sh
magick SOURCE.jpg -colorspace gray -negate -level 2%,100% -write mpr:ink +delete -size 1024x1536 xc:black mpr:ink -compose CopyOpacity -composite first-reading-ink.png
```

# Brianna & Jupiter — engagement wall

A single full-screen page built to run on a TV for the length of a party.
185 photos drift past in three horizontal rows, endlessly. Nothing scrolls,
nothing needs clicking, and there is no second screen.

## Running it

```bash
pnpm install
pnpm build && pnpm start      # http://localhost:3000
```

Open it on the TV, click once (or press <kbd>F</kbd>) to go fullscreen. That
click also grants the screen wake lock, so the TV won't blank mid-evening.

`pnpm dev` works too, but use the production build for the actual party — the
page is fully static, so after the first load it runs with no server work at all.

## The photos

`public/photos/` is generated, not hand-managed. To rebuild it from the source
folder:

```bash
pnpm photos                   # reads ~/Downloads/jupiter-pics
pnpm photos /path/to/folder   # or point it somewhere else
```

[`scripts/process-photos.py`](scripts/process-photos.py) skips 0-byte
placeholder files, drops exact duplicates by hash, applies EXIF rotation, and
resamples everything to one uniform height so the marquee rows line up. It
writes [`app/photos.json`](app/photos.json) with real dimensions, which is what
the layout reads — no image is ever measured in the browser.

The original 410 files reduced to **185 unique photos, 19 MB**: half the folder
was 0-byte ghost copies and another 20 were true duplicates.

## Editing the text

Everything that isn't a photo lives in [`app/event.ts`](app/event.ts).

## How the motion works

Each row's photos are laid out twice in one flex track, and the track slides by
exactly `-50%` on a linear infinite loop — so copy two lands precisely where
copy one began and the wrap is invisible. The transform resets to zero every
cycle instead of growing without bound, which is what keeps it stable over
hours rather than minutes.

The three rows loop in 430s / 497s / 571s. Those numbers are deliberately not
multiples of each other: the rows fall out of phase and the screen never
returns to an arrangement anyone has already seen. The middle row runs the
opposite direction from the other two, which gives the wall depth and keeps the
eye moving.

Row durations are CSS variables in [`app/globals.css`](app/globals.css)
(`--row-1`, `--row-2`, `--row-3`) — raise them to slow the wall down.

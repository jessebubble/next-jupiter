import photos from "../photos.json";

type Photo = { src: string; w: number; h: number };

/**
 * Deterministic shuffle. A seeded PRNG rather than Math.random so the wall is
 * identical on every render — the order is varied, but it is the *same* varied
 * order each time, which keeps the server output stable.
 */
function shuffled(items: Photo[], seed: number): Photo[] {
  const out = [...items];
  let s = seed;
  const next = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const ROWS = [
  { dir: "track-left", dur: "var(--row-1)" },
  { dir: "track-right", dur: "var(--row-2)" },
  { dir: "track-left", dur: "var(--row-3)" },
];

// Dealt round-robin off one shuffle, so each row draws a different slice of the
// set and no two rows ever show the same picture at the same moment. Each row
// is then doubled: the second pass is what the first wraps into.
const deck = shuffled(photos as Photo[], 20260919);
const rows = ROWS.map((row, i) => {
  const slice = deck.filter((_, index) => index % ROWS.length === i);
  return { ...row, photos: [...slice, ...slice], half: slice.length };
});

export function PhotoWall() {
  return (
    <div
      className="grid h-dvh w-screen grid-rows-3 gap-[0.5vh] p-[0.5vh]"
      style={{ ["--gap" as string]: "0.5vh" }}
    >
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="relative overflow-hidden">
          <div className={`track ${row.dir}`} style={{ animationDuration: row.dur }}>
            {row.photos.map((photo, i) => (
              <div
                key={i}
                className="frame"
                style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
              >
                {/* Plain <img>, not next/image: process-photos.py already
                    resampled every file to the one height this layout uses, so
                    the optimizer would re-encode 370 already-correct images for
                    nothing and put a server in front of a page that is
                    otherwise pure static files. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt=""
                  width={photo.w}
                  height={photo.h}
                  decoding="async"
                  /* The first handful of each row is on screen at t=0 and must
                     not pop in; the rest stream in as they approach. */
                  loading={i < 6 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import { event } from "../event";

export function TitleCard() {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      {/* Vignette: darkens the photos drifting behind the card so the type
          always has contrast, whatever happens to be passing underneath. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 45% at 50% 50%, rgb(0 0 0 / 0.72) 0%, rgb(0 0 0 / 0.45) 45%, transparent 75%)",
        }}
      />

      <div className="card relative rounded-[3px] px-[5vw] py-[4.5vh] text-center text-ink">
        <p className="font-display text-[3.6vh] font-light tracking-[0.02em] text-ink/75">
          {event.announcement}
        </p>

        <div className="mt-[2.5vh] font-display leading-[0.95]">
          <p className="text-[8.5vh] font-normal tracking-[0.18em]">
            {event.one.toUpperCase()}
          </p>
          <p className="my-[0.8vh] text-[4vh] font-light italic text-blush-deep">&amp;</p>
          <p className="text-[8.5vh] font-normal tracking-[0.18em]">
            {event.two.toUpperCase()}
          </p>
        </div>

        <div className="mx-auto mt-[3.5vh] h-px w-[40%] bg-ink/25" />

        <p className="mt-[2.5vh] text-[1.7vh] font-light uppercase tracking-[0.34em] text-ink/70">
          {event.invitation}
        </p>
      </div>
    </div>
  );
}

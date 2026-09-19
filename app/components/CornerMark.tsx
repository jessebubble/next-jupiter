import { event } from "../event";

/** The when-and-where, tucked bottom-left so it never competes with the card. */
export function CornerMark() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0">
      {/* Local scrim. Without it the details vanish every time a bright photo
          drifts underneath — and they have to stay readable all evening. */}
      <div
        className="absolute bottom-0 left-0 h-[32vh] w-[38vw]"
        style={{
          background:
            "radial-gradient(120% 110% at 0% 100%, rgb(10 8 7 / 0.9) 0%, rgb(10 8 7 / 0.65) 40%, transparent 72%)",
        }}
      />

      <div className="relative px-[3vw] pb-[3.5vh] pt-[6vh] text-cream">
        <div className="mb-[1.6vh] h-px w-[3.5vw] bg-blush" />
        <p className="text-[1.85vh] font-light uppercase leading-[2] tracking-[0.3em]">
          {event.date}
          <br />
          {event.time}
        </p>
        <p className="mt-[1.4vh] text-[1.6vh] font-light uppercase leading-[2] tracking-[0.28em] text-cream/70">
          {event.venue}
          <br />
          {event.city}
        </p>
      </div>
    </div>
  );
}

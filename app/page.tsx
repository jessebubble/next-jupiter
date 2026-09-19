import { CornerMark } from "./components/CornerMark";
import { PhotoWall } from "./components/PhotoWall";
import { StayAwake } from "./components/StayAwake";
import { TitleCard } from "./components/TitleCard";

export default function Page() {
  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-stage">
      <PhotoWall />

      {/* Photos dissolve into the stage at the edges instead of being sliced. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[7vw]"
        style={{ background: "linear-gradient(to right, var(--stage), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[7vw]"
        style={{ background: "linear-gradient(to left, var(--stage), transparent)" }}
      />

      <TitleCard />
      <CornerMark />
      <StayAwake />
    </main>
  );
}

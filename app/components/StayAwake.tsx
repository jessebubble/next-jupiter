"use client";

import { useEffect, useState } from "react";

/**
 * Two things the wall needs to survive an evening unattended:
 *  - a screen wake lock, so the TV doesn't blank halfway through the party
 *  - a click-to-fullscreen, because the lock and fullscreen both require a
 *    user gesture in most browsers
 * Everything here degrades quietly if the browser doesn't support it.
 */
export function StayAwake() {
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      if (!("wakeLock" in navigator) || document.visibilityState !== "visible") return;
      try {
        const next = await navigator.wakeLock.request("screen");
        if (cancelled) {
          void next.release();
          return;
        }
        lock = next;
      } catch {
        // Denied or unsupported — the TV's own sleep settings take over.
      }
    };

    // Browsers drop the lock whenever the tab is hidden, so take it again.
    const onVisible = () => void acquire();

    void acquire();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pointerdown", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pointerdown", onVisible);
      void lock?.release();
    };
  }, []);

  useEffect(() => {
    const toggleFullscreen = () => {
      setShowHint(false);
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen().catch(() => {});
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "Enter") toggleFullscreen();
    };

    window.addEventListener("click", toggleFullscreen);
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => setShowHint(false), 8000);

    return () => {
      window.removeEventListener("click", toggleFullscreen);
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, []);

  return (
    <p
      aria-hidden
      className="pointer-events-none absolute bottom-[3vh] right-[3vw] rounded-full bg-stage/70 px-[1.4vw] py-[0.8vh] text-[1.3vh] font-light uppercase tracking-[0.3em] text-cream/60 transition-opacity duration-1000"
      style={{ opacity: showHint ? 1 : 0 }}
    >
      Click or press F for fullscreen
    </p>
  );
}

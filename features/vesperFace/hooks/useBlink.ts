import { LegacyAnimationControls } from "motion";
import { useEffect } from "react";
import { Emotion } from "../types/emotion.types";

export const useBlink = (
  cancelled: boolean,
  setCancelled: () => void,
  both: LegacyAnimationControls,
  emotion: Emotion,
) => {
  useEffect(() => {
    loop(cancelled, both);
    return () => {
      (setCancelled(), both.stop());
    };
  }, [both, emotion]);
};

const loop = async (
  cancelled: boolean,

  both: LegacyAnimationControls,
) => {
  while (!cancelled) {
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 1600));
    if (cancelled) return;
    await both.start({ scaleY: 0.08, transition: { duration: 0.06 } });
    await both.start({ scaleY: 1, transition: { duration: 0.08 } });
    if (Math.random() < 0.3) {
      await both.start({ scaleY: 0.08, transition: { duration: 0.06 } });
      await both.start({ scaleY: 1, transition: { duration: 0.08 } });
    }
  }
};

"use client";

import { LegacyAnimationControls } from "motion";
import { useEffect, useRef } from "react";
import { Emotion } from "../types/emotion.types";

export const useBlink = (both: LegacyAnimationControls, emotion: Emotion) => {
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (emotion === "sad") {
      both.stop();
      both.start({ scaleY: 1, transition: { duration: 0.1 } });
      return;
    }

    cancelledRef.current = false;

    const blink = async () => {
      while (!cancelledRef.current) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1200 + Math.random() * 1600),
        );

        if (cancelledRef.current) return;

        await both.start({
          scaleY: 0.08,
          transition: { duration: 0.06 },
        });

        await both.start({
          scaleY: 1,
          transition: { duration: 0.08 },
        });

        if (Math.random() < 0.3) {
          if (cancelledRef.current) return;
          await both.start({
            scaleY: 0.08,
            transition: { duration: 0.06 },
          });
          await both.start({
            scaleY: 1,
            transition: { duration: 0.08 },
          });
        }
      }
    };

    blink();

    return () => {
      cancelledRef.current = true;
      both.stop();
      both.start({ scaleY: 1, transition: { duration: 0.1 } });
    };
  }, [both, emotion]);
};

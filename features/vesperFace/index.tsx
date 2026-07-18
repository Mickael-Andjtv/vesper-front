"use client";

import { motion, useAnimationControls } from "motion/react";
import { useEffect } from "react";

export type Emotion = "normal" | "happy" | "sad" | "sarcastic" | "laugh";

/**
 * EMO-robot style eyes with emotion states.
 */
export function EmoEyes({
  size = 130,
  emotion = "normal",
}: {
  size?: number;
  emotion?: Emotion;
}) {
  const left = useAnimationControls();
  const right = useAnimationControls();
  const both = useAnimationControls();

  // Blink loop — quick & lively, skipped for droopy sad
  useEffect(() => {
    // if (emotion === "sad") return;
    let cancelled = false;
    const loop = async () => {
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
    loop();
    return () => {
      cancelled = true;
      both.stop();
    };
  }, [both, emotion]);

  // Emotion-driven pose + micro movements
  useEffect(() => {
    left.stop();
    right.stop();
    let cancelled = false;

    // Shared quick look-around driver
    const runLookAround = (
      positions: { x: number; y: number }[],
      basePose: Record<string, unknown>,
      minDelay = 550,
      randDelay = 900,
    ) => {
      const loop = async () => {
        while (!cancelled) {
          await new Promise((r) => setTimeout(r, minDelay + Math.random() * randDelay));
          if (cancelled) return;
          const p = positions[Math.floor(Math.random() * positions.length)];
          left.start({
            ...basePose,
            x: p.x,
            y: (basePose.y as number ?? 0) + p.y,
            transition: { type: "spring", stiffness: 380, damping: 18 },
          });
          right.start({
            ...basePose,
            x: p.x,
            y: (basePose.y as number ?? 0) + p.y,
            transition: { type: "spring", stiffness: 380, damping: 18 },
          });
        }
      };
      loop();
    };

    if (emotion === "happy") {
      const pose = {
        scaleY: 0.5,
        rotate: 0,
        borderRadius: "50% 50% 30% 30%",
      };
      left.start({ ...pose, x: 0, y: 0, transition: { duration: 0.2 } });
      right.start({ ...pose, x: 0, y: 0, transition: { duration: 0.2 } });
      runLookAround(
        [
          { x: 0, y: 0 },
          { x: -8, y: 0 },
          { x: 8, y: 0 },
          { x: -6, y: -3 },
          { x: 6, y: -3 },
        ],
        pose,
        700,
        800,
      );
      return () => {
        cancelled = true;
      };
    }

    if (emotion === "laugh") {
      // Bouncing squinted arcs — "hahaha"
      const pose = {
        scaleY: 0.35,
        rotate: 0,
        borderRadius: "50% 50% 20% 20%",
      };
      left.start({ ...pose, x: 0, y: 0, transition: { duration: 0.15 } });
      right.start({ ...pose, x: 0, y: 0, transition: { duration: 0.15 } });
      const loop = async () => {
        while (!cancelled) {
          both.start({ y: -8, transition: { duration: 0.12 } });
          await new Promise((r) => setTimeout(r, 140));
          if (cancelled) return;
          both.start({ y: 0, transition: { duration: 0.12 } });
          await new Promise((r) => setTimeout(r, 160));
        }
      };
      loop();
      return () => {
        cancelled = true;
        both.stop();
        both.start({ y: 0, transition: { duration: 0.15 } });
      };
    }

    if (emotion === "sad") {
      const pose = {
        scaleY: 0.75,
        borderRadius: "30% 30% 50% 50%",
      };
      left.start({ ...pose, x: 0, y: 10, rotate: -18, transition: { duration: 0.3 } });
      right.start({ ...pose, x: 0, y: 10, rotate: 18, transition: { duration: 0.3 } });

      // Slow, small, drifting look — mostly down
      const positions = [
        { x: 0, y: 0 },
        { x: -6, y: 4 },
        { x: 6, y: 4 },
        { x: -4, y: 6 },
        { x: 4, y: 6 },
        { x: 0, y: 8 },
      ];
      const loop = async () => {
        while (!cancelled) {
          await new Promise((r) => setTimeout(r, 900 + Math.random() * 1200));
          if (cancelled) return;
          const p = positions[Math.floor(Math.random() * positions.length)];
          left.start({
            ...pose,
            x: p.x,
            y: 10 + p.y,
            rotate: -18,
            transition: { type: "spring", stiffness: 220, damping: 22 },
          });
          right.start({
            ...pose,
            x: p.x,
            y: 10 + p.y,
            rotate: 18,
            transition: { type: "spring", stiffness: 220, damping: 22 },
          });
        }
      };
      loop();
      return () => {
        cancelled = true;
      };
    }

    if (emotion === "sarcastic") {
      // one half-closed, glance to side, small twitchy movement
      left.start({
        x: 12,
        y: -2,
        scaleY: 0.45,
        rotate: -8,
        borderRadius: "28%",
        transition: { duration: 0.2 },
      });
      right.start({
        x: 12,
        y: 0,
        scaleY: 1,
        rotate: 0,
        borderRadius: "28%",
        transition: { duration: 0.2 },
      });
      const positions = [
        { x: 12, y: 0 },
        { x: 14, y: -2 },
        { x: 10, y: 2 },
        { x: 13, y: 0 },
      ];
      const loop = async () => {
        while (!cancelled) {
          await new Promise((r) => setTimeout(r, 700 + Math.random() * 900));
          if (cancelled) return;
          const p = positions[Math.floor(Math.random() * positions.length)];
          left.start({
            x: p.x,
            y: p.y - 2,
            scaleY: 0.45,
            rotate: -8,
            transition: { type: "spring", stiffness: 380, damping: 18 },
          });
          right.start({
            x: p.x,
            y: p.y,
            scaleY: 1,
            rotate: 0,
            transition: { type: "spring", stiffness: 380, damping: 18 },
          });
        }
      };
      loop();
      return () => {
        cancelled = true;
      };
    }

    // normal: reset + quick lively look-around
    left.start({ scaleY: 1, rotate: 0, borderRadius: "28%", x: 0, y: 0, transition: { duration: 0.18 } });
    right.start({ scaleY: 1, rotate: 0, borderRadius: "28%", x: 0, y: 0, transition: { duration: 0.18 } });
    runLookAround(
      [
        { x: 0, y: 0 },
        { x: -14, y: 0 },
        { x: 14, y: 0 },
        { x: 0, y: -8 },
        { x: 0, y: 8 },
        { x: -10, y: -6 },
        { x: 12, y: 6 },
      ],
      { scaleY: 1, rotate: 0, borderRadius: "28%" },
      500,
      900,
    );
    return () => {
      cancelled = true;
    };
  }, [emotion, left, right, both]);

  const eyeStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "28%",
    background: "linear-gradient(180deg, #00BBFF 82.6%, #007099 100%)",
    boxShadow:
      "0 0 40px rgba(0, 187, 255, 0.55), inset 0 -20px 40px rgba(0, 112, 153, 0.6), inset 0 20px 40px rgba(150, 230, 255, 0.35)",
  };

  return (
    <div className="flex items-center justify-center gap-10 select-none">
      <motion.div animate={both} style={{ originY: 0.5 }}>
        <motion.div animate={left} style={eyeStyle} />
      </motion.div>
      <motion.div animate={both} style={{ originY: 0.5 }}>
        <motion.div animate={right} style={eyeStyle} />
      </motion.div>
    </div>
  );
}
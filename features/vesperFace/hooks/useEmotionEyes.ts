import { LegacyAnimationControls } from "motion";
import { useEffect } from "react";
import { Emotion } from "../types/emotion.types";

const SPRING_DEFAULT = { type: "spring", stiffness: 380, damping: 18 };
const SPRING_SAD = { type: "spring", stiffness: 220, damping: 22 };

const POSITIONS_HAPPY = [
  { x: 0, y: 0 },
  { x: -8, y: 0 },
  { x: 8, y: 0 },
  { x: -6, y: -3 },
  { x: 6, y: -3 },
];
const POSITIONS_SAD = [
  { x: 0, y: 0 },
  { x: -6, y: 4 },
  { x: 6, y: 4 },
  { x: -4, y: 6 },
  { x: 4, y: 6 },
  { x: 0, y: 8 },
];
const POSITIONS_SARCASTIC = [
  { x: 12, y: 0 },
  { x: 14, y: -2 },
  { x: 10, y: 2 },
  { x: 13, y: 0 },
];
const POSITIONS_DEFAULT = [
  { x: 0, y: 0 },
  { x: -14, y: 0 },
  { x: 14, y: 0 },
  { x: 0, y: -8 },
  { x: 0, y: 8 },
  { x: -10, y: -6 },
  { x: 12, y: 6 },
];

const startEyes = (
  left: LegacyAnimationControls,
  right: LegacyAnimationControls,
  leftPose: object,
  rightPose: object,
  duration: number,
) => {
  left.start({ ...leftPose, transition: { duration } });
  right.start({ ...rightPose, transition: { duration } });
};

const runDriftLoop = async (
  ctx: { cancelled: boolean },
  left: LegacyAnimationControls,
  right: LegacyAnimationControls,
  positions: { x: number; y: number }[],
  getLeftPose: (p: { x: number; y: number }) => object,
  getRightPose: (p: { x: number; y: number }) => object,
  minDelay: number,
  randDelay: number,
  transition: object,
) => {
  while (!ctx.cancelled) {
    await new Promise((r) =>
      setTimeout(r, minDelay + Math.random() * randDelay),
    );
    if (ctx.cancelled) return;

    const p = positions[Math.floor(Math.random() * positions.length)];
    left.start({ ...getLeftPose(p), transition });
    right.start({ ...getRightPose(p), transition });
  }
};

export const useEmotionEyes = (
  left: LegacyAnimationControls,
  right: LegacyAnimationControls,
  both: LegacyAnimationControls,
  emotion: Emotion,
) => {
  useEffect(() => {
    left.stop();
    right.stop();

    const ctx = { cancelled: false };

    if (emotion === "happy") {
      const pose = { scaleY: 0.5, rotate: 0, borderRadius: "50% 50% 30% 30%" };
      startEyes(
        left,
        right,
        { ...pose, x: 0, y: 0 },
        { ...pose, x: 0, y: 0 },
        0.2,
      );
      runDriftLoop(
        ctx,
        left,
        right,
        POSITIONS_HAPPY,
        (p) => ({ ...pose, x: p.x, y: p.y }),
        (p) => ({ ...pose, x: p.x, y: p.y }),
        700,
        800,
        SPRING_DEFAULT,
      );

      return () => {
        ctx.cancelled = true;
      };
    }

    if (emotion === "laugh") {
      const pose = {
        scaleY: 0.35,
        rotate: 0,
        borderRadius: "50% 50% 20% 20%",
        x: 0,
        y: 0,
      };
      startEyes(left, right, pose, pose, 0.15);

      (async () => {
        while (!ctx.cancelled) {
          both.start({ y: -8, transition: { duration: 0.12 } });
          await new Promise((r) => setTimeout(r, 140));
          if (ctx.cancelled) return;
          both.start({ y: 0, transition: { duration: 0.12 } });
          await new Promise((r) => setTimeout(r, 160));
        }
      })();

      return () => {
        ctx.cancelled = true;
        both.stop();
        both.start({ y: 0, transition: { duration: 0.15 } });
      };
    }

    if (emotion === "sad") {
      const pose = { scaleY: 0.75, borderRadius: "30% 30% 50% 50%" };
      startEyes(
        left,
        right,
        { ...pose, x: 0, y: 10, rotate: -18 },
        { ...pose, x: 0, y: 10, rotate: 18 },
        0.3,
      );
      runDriftLoop(
        ctx,
        left,
        right,
        POSITIONS_SAD,
        (p) => ({ ...pose, x: p.x, y: 10 + p.y, rotate: -18 }),
        (p) => ({ ...pose, x: p.x, y: 10 + p.y, rotate: 18 }),
        900,
        1200,
        SPRING_SAD,
      );

      return () => {
        ctx.cancelled = true;
      };
    }

    if (emotion === "sarcastic") {
      startEyes(
        left,
        right,
        { x: 12, y: -2, scaleY: 0.45, rotate: -8, borderRadius: "28%" },
        { x: 12, y: 0, scaleY: 1, rotate: 0, borderRadius: "28%" },
        0.2,
      );
      runDriftLoop(
        ctx,
        left,
        right,
        POSITIONS_SARCASTIC,
        (p) => ({ x: p.x, y: p.y - 2, scaleY: 0.45, rotate: -8 }),
        (p) => ({ x: p.x, y: p.y, scaleY: 1, rotate: 0 }),
        700,
        900,
        SPRING_DEFAULT,
      );

      return () => {
        ctx.cancelled = true;
      };
    }

    const pose = { scaleY: 1, rotate: 0, borderRadius: "28%" };
    startEyes(
      left,
      right,
      { ...pose, x: 0, y: 0 },
      { ...pose, x: 0, y: 0 },
      0.18,
    );
    runDriftLoop(
      ctx,
      left,
      right,
      POSITIONS_DEFAULT,
      (p) => ({ ...pose, x: p.x, y: p.y }),
      (p) => ({ ...pose, x: p.x, y: p.y }),
      500,
      900,
      SPRING_DEFAULT,
    );

    return () => {
      ctx.cancelled = true;
    };
  }, [emotion, left, right, both]);
};

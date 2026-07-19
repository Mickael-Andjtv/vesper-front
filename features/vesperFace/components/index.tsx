"use client";

import { motion, useAnimation } from "motion/react";
import { Emotion } from "../types/emotion.types";
import { useBlink } from "../hooks/useBlink";
import { useEmotionEyes } from "../hooks/useEmotionEyes";
import { getEyeStyle } from "../styles/eyes.styles";

export function EmoEyes({
  size = 130,
  emotion = "normal",
}: {
  size?: number;
  emotion?: Emotion;
}) {
  const left = useAnimation();
  const right = useAnimation();
  const both = useAnimation();
  useBlink(both, emotion);
  useEmotionEyes(left, right, both, emotion);
  const eyeStyle = getEyeStyle(size);
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

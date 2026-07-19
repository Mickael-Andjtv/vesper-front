export const getEyeStyle = (size: number) => {
  const eyeStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "28%",
    background: "linear-gradient(180deg, #FFD700 82.6%, #FFA500 100%)",
    boxShadow:
      "0 0 40px rgba(0, 187, 255, 0.55), inset 0 -20px 40px rgba(0, 112, 153, 0.6), inset 0 20px 40px rgba(150, 230, 255, 0.35)",
  };
  return eyeStyle;
};

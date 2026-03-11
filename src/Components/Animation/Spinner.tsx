import { motion } from "motion/react";

const circleStyle = {
  width: 100,
  height: 100,
  backgroundColor: "transparent", 
  border: "10px solid rgba(255, 255, 255, 0.1)", 
  borderTop: "10px solid #FFFFFF", 
  borderRadius: "50%",
};
const Spinner = () => {
  return (
    <motion.div
      style={circleStyle}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    />
  );
};

export default Spinner;

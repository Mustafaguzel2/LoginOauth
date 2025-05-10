import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${size} ${color} opacity-20 blur-xl`}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: ["0deg", "360deg"],
      }}
      transition={{
        delay,
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      aria-hidden="true"
    ></motion.div>
  );
};

export default FloatingShape;

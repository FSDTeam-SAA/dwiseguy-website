import Doublebutton from "@/components/website/PageSections/HomePage/Doublebutton";
import React from "react";
import { motion } from "framer-motion";

const HeroAll = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* a video on the background z-index 0 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 bg-black/90 opacity-50 w-full h-full object-cover z-0"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      {/* overlay content z-index 10 */}
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-white z-10 bg-black/60">
        <motion.h2
          className="text-6xl font-extrabold mb-8 tracking-tighter text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          The Bailey Academy Of Music
        </motion.h2>
        <p>

        </p>
        <motion.div
          className="mt-35"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <Doublebutton />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroAll;

import Doublebutton from "@/components/website/PageSections/HomePage/Doublebutton";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
          {/* Piano Image Animation (Text আর Button এর মাঝে) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="mb-8"
          >
            <Image
              src="/images/piano-middle.png"
              alt="Piano Graphic"
              width={300}
              height={150}
              quality={80}
              sizes="(max-width: 768px) 150px, 300px"
              className="w-auto h-24 md:h-32 object-contain opacity-80"
            />
          </motion.div>
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

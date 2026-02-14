import Doublebutton from "@/components/website/PageSections/HomePage/Doublebutton";
import React from "react";

const HeroAll = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* a video on the background z-index 0 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 bg-black/40 w-full h-full object-cover z-0"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      {/* overlay content z-index 10 */}
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-white z-10 bg-black/20">
        <h1 className="text-6xl font-bold mb-8">The Bailey Academy Of Music</h1>
        <p>
            
        </p>
        <Doublebutton />
      </div>
    </div>
  );
};

export default HeroAll;

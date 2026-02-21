import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div>
      <Image
        src="/images/hero12.jpeg"
        alt="hero"
        width={1920}
        height={1080}
        priority
        quality={85}
        sizes="100vw"
        className="w-full h-auto"
      />
    </div>
  );
};

export default Hero;

import FeatureSection from "@/components/ReusableSection/FeatureSection";
import React from "react";

const Aboutus = () => {


  return (
    <div className="">


      <FeatureSection
        title="High-quality music education"
        description="We are dedicated to transforming music education by providing high-quality learning materials to students, educators, and musicians worldwide. Through new technology we make learning music theory fun and more effective.
We focus on theoretical skills that are essential for reading, writing and playing music. This focus ensures that students and musicians can easily adapt their theoretical knowledge to practical use in the field of music."
        imageSrc="/images/Learn-note.png"
        imageAlt="Person playing piano"
        bgColor="bg-white"
      />

      <FeatureSection
        title="Free for everyone in Denmark"
        description="We believe in making piano education accessible to everyone. DwiseGuy Academy is proud to offer its entire curriculum for free to all residents in Denmark. Whether you&apos;re in Nordjylland, Midtjylland, or Syddanmark, you can start learning today at no cost."
        imageSrc="/images/Denmark.png"
        imageAlt="Map of Denmark"
        reversed={true}
      />
    </div>

  );
};

export default Aboutus;
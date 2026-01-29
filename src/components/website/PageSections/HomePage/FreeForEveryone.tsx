// import Image from 'next/image'
// import React from 'react'

import FeatureSection from "@/components/ReusableSection/FeatureSection";

// const FreeForEveryone = () => {
//     return (
//         <section className="py-16 md:py-24 px-6 lg:px-12 bg-gray-400">
//             <div className="container mx-auto">
//                 <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
//                     {/* Text Content Section */}
//                     <div className="space-y-6">
//                         <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
//                             Free for everyone in Denmark
//                         </h2>
//                         <p className="text-base md:text-lg text-gray-600 leading-relaxed">
//                             We believe in making piano education accessible to everyone. DwiseGuy Academy is proud to offer its entire curriculum for free to all residents in Denmark. Whether you&apos;re in Nordjylland, Midtjylland, or Syddanmark, you can start learning today at no cost.
//                         </p>
//                     </div>

//                     {/* Image Section */}
//                     <div className="relative">
//                         <div className="relative w-full aspect-square md:aspect-[4/3] max-w-[600px] mx-auto">
//                             <Image
//                                 src="/images/Denmark.png"
//                                 alt="Free for everyone in Denmark map"
//                                 fill
//                                 className="object-contain transform hover:scale-105 transition-transform duration-500"
//                                 priority
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default FreeForEveryone


export default function Page() {
  return (
    <>
      {/* Original Denmark Section */}
      <FeatureSection 
        title="Free for everyone in Denmark"
        description="We believe in making piano education accessible to everyone. DwiseGuy Academy is proud to offer its entire curriculum for free to all residents in Denmark. Whether you&apos;re in Nordjylland, Midtjylland, or Syddanmark, you can start learning today at no cost."
        imageSrc="/images/Denmark.png"
        imageAlt="Map of Denmark"
      />

      {/* A New Section (Reusing the same logic!) */}
      {/* <FeatureSection 
        title="Learn at your own pace"
        description="Our video lessons allow you to pause, rewind, and practice whenever you want."
        imageSrc="/images/piano-lesson.png"
        imageAlt="Person playing piano"
        bgColor="bg-white"
        reversed={true} // Image on the left, text on the right
      /> */}
    </>
  )
}
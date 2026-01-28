import Image from 'next/image'
import React from 'react'

const Funsection = () => {
    return (
        <section className="py-16 md:py-24 px-6 lg:px-12 bg-white">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Image Section */}
                    <div className="relative">
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            <Image
                                src="/images/funimage.png"
                                alt="fun-section"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Text Content Section */}
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Fun and effective
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            A joyful way to learn piano with structured lessons that turn practice into real progress, making piano learning enjoyable, simple, and rewarding for every level while helping you fall in love with music and build confidence step by step.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Funsection
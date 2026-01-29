
import Image from 'next/image'
import React from 'react'

// Define the "Prop Types" so the component knows what to expect
const FeatureSection = ({ title, description, imageSrc, imageAlt, bgColor = "bg-gray-400", reversed = false }: { title: string, description: string, imageSrc: string, imageAlt: string, bgColor?: string, reversed?: boolean }) => {
    return (
        <section className={`py-16 md:py-24 px-6 lg:px-12 ${bgColor}`}>
            <div className="container mx-auto">
                <div className={`grid md:grid-cols-2 gap-12 lg:gap-24 items-center`}>
                    
                    {/* Text Content Section - Use 'order-last' if reversed is true */}
                    <div className={`space-y-6 ${reversed ? 'md:order-last' : ''}`}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            {title}
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Image Section */}
                    <div className="relative">
                        <div className="relative w-full aspect-square md:aspect-[4/3] max-w-[600px] mx-auto">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                className="object-contain transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeatureSection
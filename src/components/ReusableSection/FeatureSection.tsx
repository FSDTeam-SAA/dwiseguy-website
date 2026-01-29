"use client";

import Image from 'next/image'
import React from 'react'
import { motion, Variants } from 'framer-motion'

// Define the "Prop Types" so the component knows what to expect
const FeatureSection = ({ title, description, imageSrc, imageAlt, bgColor = "bg-gray-400", reversed = false }: { title: string, description: string, imageSrc: string, imageAlt: string, bgColor?: string, reversed?: boolean }) => {

    // Animation Variants
    const textVariant: Variants = {
        hidden: {
            opacity: 0,
            x: reversed ? 50 : -50 // If reversed (text on right), slide from right. Else slide from left.
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const imageVariant: Variants = {
        hidden: {
            opacity: 0,
            x: reversed ? -50 : 50 // If reversed (image on left), slide from left. Else slide from right.
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } // Slight delay for the image
        }
    };

    return (
        <section className={`py-16 md:py-24 px-6 lg:px-12 ${bgColor} overflow-hidden`}>
            <div className="container mx-auto">
                <div className={`grid md:grid-cols-2 gap-12 lg:gap-24 items-center`}>

                    {/* Text Content Section - Use 'order-last' if reversed is true */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={textVariant}
                        className={`space-y-6 ${reversed ? 'md:order-last' : ''}`}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            {title}
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            {description}
                        </p>
                    </motion.div>

                    {/* Image Section */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={imageVariant}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square md:aspect-[4/3] max-w-[600px] mx-auto">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                className="object-contain transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default FeatureSection
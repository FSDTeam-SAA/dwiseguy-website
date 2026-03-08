"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

interface GlossaryTooltipProps {
    term: string;
    definition: string;
    image?: string;
    category?: string;
    lesson?: string;
    children: React.ReactNode;
}

const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({ term, definition, image, category, lesson, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { id } = useParams();

    return (
        <span className="relative inline-block group">
            <Link
                href={`/module/single/${id}/terms`}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="text-primary font-bold decoration-primary/30 decoration-2 underline-offset-4 hover:underline transition-all cursor-help"
            >
                {children}
            </Link>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 bg-black/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl pointer-events-none"
                    >
                        <div className="relative">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-primary font-bold text-sm uppercase tracking-wider">{term}</h4>
                                {lesson && (
                                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                                        {lesson}
                                    </span>
                                )}
                            </div>

                            {image && (
                                <div className="mb-3 w-full h-32 relative bg-white/5 rounded-lg overflow-hidden border border-white/10">
                                    <Image
                                        src={image}
                                        alt={term}
                                        fill
                                        className="object-contain p-2"
                                        sizes="256px"
                                    />
                                </div>
                            )}

                            <p className="text-gray-200 text-xs leading-relaxed mb-2">{definition}</p>

                            {category && (
                                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                                    Category: {category}
                                </div>
                            )}

                            {/* Tooltip Arrow */}
                            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/95" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
};

export default GlossaryTooltip;

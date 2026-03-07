"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

interface GlossaryTooltipProps {
    term: string;
    definition: string;
    children: React.ReactNode;
}

const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({ term, definition, children }) => {
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
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-black/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl pointer-events-none"
                    >
                        <div className="relative">
                            <h4 className="text-primary font-bold text-sm mb-1 uppercase tracking-wider">{term}</h4>
                            <p className="text-gray-200 text-xs leading-relaxed">{definition}</p>

                            {/* Tooltip Arrow */}
                            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
};

export default GlossaryTooltip;

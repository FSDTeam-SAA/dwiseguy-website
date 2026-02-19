"use client";

import React from 'react';
import Image from 'next/image';
import { Lock, DotIcon, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


// Static Data - Manually defined instead of API-driven
const staticInstruments = [
    {
        id: "1",
        title: "Piano",
        description: "Play the virtual piano and visualize notes, chords and scales.",
        status: "active",
        image: "/images/pianoband.jpg",
        level: "beginner",
        href: "/piano",
    },
    {
        id: "2",
        title: "Drums",
        description: "Play the virtual drums and playing drum beats.",
        status: "upcoming",
        image: "/images/drums.jpg",
        level: "intermediate"
    }
];

const Bandstandpage = () => {
    const router = useRouter();
    return (
        <div className="container mx-auto min-h-screen text-white p-6 md:p-12">
            <div className="bg-black/40 p-6 sm:p-12 md:p-20 rounded-md">

                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                    <div className="flex items-start justify-start gap-2">
                        {/* <ChevronLeft className="w-10 h-10" /> */}
                        <h2 className="text-4xl text-primary font-bold mb-4">Band Stand</h2>
                        {/* <p className="text-lg font-semibold mb-4">Explore the world of music with our virtual instruments.</p> */}
                    </div>
                    {/* <Link href="/bandstand">
                        <Button className="bg-primary hover:bg-primary/80 text-white px-10 py-6 rounded-lg font-bold text-lg shadow-lg w-full sm:w-auto">
                            Band Stand
                        </Button>
                    </Link> */}
                </div>

                {/* Instrument Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {staticInstruments.map((instrument) => {
                        const isActive = instrument.status === 'active';
                        const isUpcoming = instrument.status === 'upcoming';

                        return (
                            <div key={instrument.id} className="flex flex-col bg-white/30 cursor-pointer space-y-4 border border-white/50 pb-5 rounded-lg group">
                                <Link href={(instrument.href as string) || "#"}>
                                    {/* Image Container */}
                                    <div className="relative aspect-square overflow-hidden bg-white/50 rounded-3xl bg-[#2a2d3a] border border-white/5 shadow-2xl">
                                        <Image
                                            src={instrument.image}
                                            alt={instrument.title}
                                            fill
                                            className={`object-cover transition-transform duration-500 group-hover:scale-110 
                                            ${isActive ? '' : 'opacity-40 grayscale-[0.5]'}`}
                                        />

                                        {/* Overlay for Non-Active items */}
                                        {!isActive && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                {isUpcoming ? (
                                                    <div className="text-center">
                                                        <span className="text-primary animate-pulse font-bold text-2xl mb-2">Upcoming</span>
                                                        <div className="flex justify-center items-center">
                                                            <DotIcon className="text-white animate-pulse w-10 h-10" />
                                                            <DotIcon className="text-white animate-pulse w-10 h-10 delay-75" />
                                                            <DotIcon className="text-white animate-pulse w-10 h-10 delay-150" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <span className="text-[#8b76d1] font-bold text-2xl mb-2 block">Locked</span>
                                                        <div className="bg-yellow-500 p-3 rounded-xl inline-block">
                                                            <Lock className="text-black fill-current w-8 h-8" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="px-2">
                                        <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-primary' : 'text-white/60'}`}>
                                            {instrument.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                            {instrument.description}
                                        </p>
                                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs uppercase tracking-wider text-gray-400">
                                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-gray-600'}`} />
                                            {instrument.level}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Bandstandpage;
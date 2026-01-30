"use client";

import React from 'react';
import Image from 'next/image';
import { Lock, DotIcon, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGetAllInstrument } from '../hooks/useGetAllInstrument';
import { Instrument } from '../types/instrument.types';
import Link from 'next/link';

const Academypage = () => {
    // 1. Fetch data using your custom hook
    const { data, isLoading, isError, error } = useGetAllInstrument();

    // 2. Extract instruments from the nested API structure
    const instruments = data?.data?.instruments || [];

    // Loading State
    if (isLoading) {
        return (
            <div className="container mx-auto min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    // Error State
    if (isError) {
        return (
            <div className="container mx-auto min-h-screen flex flex-col items-center justify-center text-white">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-bold">Failed to load instruments</p>
                <p className="text-gray-400">{error instanceof Error ? error.message : "Something went wrong"}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto min-h-screen text-white p-6 md:p-12">
            <div className="bg-black/40 p-6 sm:p-12 md:p-20 rounded-md">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl text-primary font-bold mb-4">Academy</h2>
                        <p className="text-lg font-semibold mb-4">Explore the world of music with our virtual instruments.</p>
                    </div>
                    <Link href="/bandstand">
                        <Button className="bg-primary hover:bg-primary/80 text-white px-10 py-6 rounded-lg font-bold text-lg shadow-lg w-full sm:w-auto">
                            Band Stand
                        </Button>
                    </Link>
                </div>

                {/* Instrument Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {instruments.map((instrument: Instrument) => {
                        // Map API 'accountStatus' or 'isActive' to your UI logic
                        const isUpcoming = instrument.accountStatus === 'upcoming';
                        const isActive = instrument.accountStatus === 'active' && instrument.isActive;

                        return (
                            <div key={instrument._id} className="flex flex-col space-y-4 group">
                                {/* Image Container */}
                                <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#2a2d3a] border border-white/5 shadow-2xl">
                                    <Image
                                        src={instrument.instrumentImage?.url || "/images/placeholder.jpg"}
                                        alt={instrument.instrumentTitle}
                                        fill
                                        className={`object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110 
                                            ${isActive ? '' : 'opacity-40 grayscale-[0.5]'}`}
                                    />

                                    {/* Overlay Logic */}
                                    {!isActive && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                            {isUpcoming ? (
                                                <>
                                                    <span className="text-primary animate-pulse font-bold text-2xl mb-2">Upcoming</span>
                                                    <div className="flex justify-center items-center">
                                                        <DotIcon className="text-white animate-pulse w-10 h-10" />
                                                        <DotIcon className="text-white animate-pulse w-10 h-10" />
                                                        <DotIcon className="text-white animate-pulse w-10 h-10" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[#8b76d1] font-bold text-2xl mb-2">Locked</span>
                                                    <div className="bg-yellow-500 p-3 rounded-xl">
                                                        <Lock className="text-black fill-current w-8 h-8" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className="px-2">
                                    <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-primary' : 'text-white'}`}>
                                        {instrument.instrumentTitle}
                                    </h3>
                                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                        {instrument.instrumentDescription}
                                    </p>
                                    <div className="mt-2 inline-block px-3 py-1 bg-white/10 rounded-full text-xs uppercase tracking-wider text-gray-400">
                                        {instrument.level}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Academypage;
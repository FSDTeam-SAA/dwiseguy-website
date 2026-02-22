"use client";

import React from 'react';
import Image from 'next/image';
import { Lock, DotIcon, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGetAllInstrument } from '../hooks/useGetAllInstrument';
import { Instrument } from '../types/instrument.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTrackInstrument } from '../hooks/useTrackInstrument';
import { useGetUserProfile } from '@/features/account/hooks/usePersonalinfo';

const Academypage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { mutate: trackInstrument } = useTrackInstrument();
    const { data: profileResponse } = useGetUserProfile();
    const userId = profileResponse?.data?._id;

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
                        const isUpcoming = instrument.accountStatus === 'upcoming';
                        const isActive = instrument.accountStatus === 'active' && instrument.isActive;

                        const handleStartLearning = () => {
                            if (!isActive) return;

                            if (userId) {
                                trackInstrument({
                                    payload: {
                                        instrumentId: instrument._id,
                                        userId: userId
                                    },
                                    accessToken: session?.accessToken || ""
                                }, {
                                    onSuccess: () => {
                                        router.push(`/module/${instrument._id}`);
                                    },
                                    onError: () => {
                                        // Fallback navigation even if tracking fails, or handle error
                                        router.push(`/module/${instrument._id}`);
                                    }
                                });
                            } else {
                                // If no userId, just navigate
                                router.push(`/module/${instrument._id}`);
                            }
                        };

                        return (
                            <div key={instrument._id}>
                                <div
                                    onClick={handleStartLearning}
                                    className={`flex flex-col cursor-pointer hover:scale-105 transition-transform duration-500 hover:border hover:border-primary hover:border-2 rounded-3xl p-4 bg-white/10 border-primary/50 space-y-4 group h-full ${!isActive ? "cursor-default opacity-80" : ""}`}
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#2a2d3a] border border-white/5 shadow-2xl">
                                        <Image
                                            src={instrument.instrumentImage?.url || "/images/placeholder.jpg"}
                                            alt={instrument.instrumentTitle}
                                            fill
                                            className={`object-cover transition-transform duration-500 group-hover:scale-110 
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
                                    <div className="px-2 flex flex-col flex-grow">
                                        <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-primary' : 'text-white'}`}>
                                            <span className='bg-white rounded-lg px-3 py-2'>
                                                {instrument.instrumentTitle}
                                            </span>
                                        </h3>
                                        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                                            {instrument.instrumentDescription}
                                        </p>

                                        <div className="mt-auto flex flex-col gap-4">
                                            <div className="inline-block w-fit px-3 py-1 bg-white/10 rounded-full text-xs text-white uppercase tracking-wider">
                                                {instrument.level}
                                            </div>

                                            {/* Start Button */}
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStartLearning();
                                                }}
                                                disabled={!isActive}
                                                className={`w-full py-6 font-bold text-lg rounded-xl transition-all ${isActive
                                                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
                                                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                                                    }`}
                                            >
                                                {isActive ? 'Start Learning' : 'Locked'}
                                            </Button>
                                        </div>
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
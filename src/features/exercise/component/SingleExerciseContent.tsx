"use client";

import React from "react";
import Image from "next/image";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useExerciseContentById } from "../hooks/useExerciseContentById";
import Piano from "@/components/website/Common/piano/piano";

const SingleExerciseContent = () => {
    const router = useRouter();
    const { id } = useParams();

    const { data: content, isLoading, isError, error } = useExerciseContentById(id as string);

    if (isLoading) {
        return (
            <div className="container mx-auto min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (isError || !content) {
        return (
            <div className="container mx-auto min-h-screen flex flex-col items-center justify-center text-white">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-bold">Failed to load practice content</p>
                <p className="text-gray-400">
                    {error instanceof Error ? error.message : "Something went wrong"}
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto min-h-screen text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto bg-black/40 p-6 sm:p-12 rounded-xl backdrop-blur-md">
                {/* Header Section */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">{content.title}</h1>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        {content.description}
                    </p>
                </div>

                <div className="space-y-10">
                    {content.image && (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5">
                            <Image
                                src={content.image.url}
                                alt={content.title}
                                fill
                                className="object-contain bg-[#1a1c23]"
                            />
                        </div>
                    )}

                    {content.audio && (
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <audio
                                controls
                                src={content.audio.url}
                                className="w-full filter invert hue-rotate-180 brightness-150"
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}

                    {content.keyNotes && content.keyNotes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {content.keyNotes.map((note, i) => (
                                <span key={i} className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium">
                                    {note}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Piano Toggle/Interactive Section */}
                <div className="mt-16 pt-10 border-t border-white/10">
                    <h3 className="text-2xl font-bold text-primary mb-8 text-center">Interactive Piano Practice</h3>
                    <div className="bg-white/5 rounded-3xl p-4 md:p-8 border border-white/10 min-h-[400px]">
                        <Piano />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleExerciseContent;
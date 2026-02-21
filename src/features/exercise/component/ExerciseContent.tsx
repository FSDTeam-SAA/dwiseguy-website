"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useExerciseContent } from "../hooks/useExerciseContent";
import Link from "next/link";

const ExerciseContentList = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const exerciseId = searchParams.get("exerciseId");

    const { data: contents, isLoading, isError, error } = useExerciseContent(exerciseId as string);

    if (isLoading) {
        return (
            <div className="container mx-auto min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto min-h-screen flex flex-col items-center justify-center text-white">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-bold">Failed to load exercise content</p>
                <p className="text-gray-400">
                    {error instanceof Error ? error.message : "Something went wrong"}
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto min-h-[90vh] text-white p-6 md:p-12">
            <div className="bg-black/40 p-6 sm:p-12 md:p-20 rounded-md backdrop-blur-sm">
                {/* Header Section */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl text-primary font-bold mb-4">Exercise Content</h2>
                        <p className="text-lg font-semibold mb-4">
                            Choose an activity to start practicing.
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {contents?.map((content) => (
                        <div key={content._id}>
                            <Link href={`/exercise/content/${content._id}`}>
                                <div className="flex flex-col h-full cursor-pointer hover:scale-105 transition-transform duration-500 hover:border hover:border-primary hover:border-2 rounded-3xl p-2 bg-white/10 border border-primary/20 space-y-4 group">
                                    {/* Image Container */}
                                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#2a2d3a] border border-white/5 shadow-2xl">
                                        <Image
                                            src={content.image?.url || "/images/piano.jpg"}
                                            alt={content.title}
                                            fill
                                            className="object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="px-2 pb-4 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-2 text-primary">
                                            {content.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3 mb-4 flex-grow">
                                            {content.description}
                                        </p>

                                        <div className="mt-4 w-full py-3 bg-primary text-black font-bold text-center rounded-xl transition-colors hover:bg-primary/90">
                                            Start Practice
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {(!contents || contents.length === 0) && !isLoading && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl">No content found for this exercise.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ExerciseContent = () => {
    return (
        <Suspense fallback={<Loader2 className="animate-spin" />}>
            <ExerciseContentList />
        </Suspense>
    );
};

export default ExerciseContent;
"use client";

import React from "react";
import Image from "next/image";
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSingleExercise } from "../hooks/useSingleExercise";
import { useSubmitExercise } from "../hooks/useSubmitExercise";

const SingleExercise = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data: exercise, isLoading, isError, error } = useSingleExercise(id as string);
    const { mutate: submitExercise, isPending: isSubmitting } = useSubmitExercise();

    if (isLoading) {
        return (
            <div className="container mx-auto min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (isError || !exercise) {
        return (
            <div className="container mx-auto min-h-screen flex flex-col items-center justify-center text-white">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-bold">Failed to load exercise</p>
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
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">{exercise.title}</h1>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        {exercise.description}
                    </p>
                </div>

                <div className="space-y-16">
                    {exercise.ExerciseContent?.map((content) => (
                        <div key={content._id} className="space-y-6">
                            <div className="bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 shadow-lg transition-all hover:bg-white/10">
                                {content.title && (
                                    <h2 className="text-2xl font-bold text-white mb-4">{content.title}</h2>
                                )}
                                {content.description && (
                                    <p className="text-gray-300 mb-8 leading-relaxed italic border-l-4 border-primary pl-4">
                                        {content.description}
                                    </p>
                                )}

                                {content.image && (
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-white/5">
                                        <Image
                                            src={content.image.url}
                                            alt={content.title || "Exercise Image"}
                                            fill
                                            className="object-contain bg-[#1a1c23]"
                                        />
                                    </div>
                                )}

                                {content.audio && (
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
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
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {content.keyNotes.map((note, i) => (
                                            <span key={i} className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium">
                                                {note}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Action */}
                <div className="mt-16 flex flex-col items-center">
                    <button
                        onClick={() => submitExercise(exercise._id)}
                        disabled={isSubmitting}
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-black font-bold text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 group shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <CheckCircle2 className="group-hover:rotate-12 transition-transform" />
                        )}
                        <span>{isSubmitting ? "Submitting..." : "Complete Exercise"}</span>
                    </button>
                    <p className="mt-4 text-gray-400 text-sm">
                        Marking this as complete will update your progress.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SingleExercise;

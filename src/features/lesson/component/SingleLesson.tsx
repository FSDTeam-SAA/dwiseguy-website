"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, AlertCircle, BookOpen, PlayCircle, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSingleLesson } from "../hooks/useSingleLesson";
import { useCompleteLesson } from "../hooks/useCompleteLesson";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SingleLesson = () => {
    const { id } = useParams();
    const { data: session } = useSession();
    const accessToken = session?.accessToken || "";

    const { data, isLoading, isError, error } = useSingleLesson(
        id as string,
        accessToken
    );

    const { mutate: completeLesson, isPending: isCompleting } = useCompleteLesson(accessToken);

    const lessonData = data?.data;

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (isError || !lessonData) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-white p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-bold">Failed to load lesson</p>
                <p className="text-gray-400 max-w-md">
                    {error instanceof Error ? error.message : "The lesson could not be found or you don't have access."}
                </p>
                <Link
                    href="/module"
                    className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
                >
                    Back to Modules
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-12 text-white">
            <div className="max-w-4xl mx-auto">
                {/* Navigation Back */}
                <Link
                    href={`/module/single/${lessonData.moduleId}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Module</span>
                </Link>

                {/* Lesson Header */}
                <div className="bg-black/40 p-8 md:p-12 rounded-3xl backdrop-blur-sm border border-white/10 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl ${lessonData.isExercise ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                            {lessonData.isExercise ? <PlayCircle size={32} /> : <BookOpen size={32} />}
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold">
                                Lesson {lessonData.order}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold mt-1">{lessonData.title}</h1>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {lessonData.content}
                        </p>
                    </div>

                    {/* Audio Player if available */}
                    {lessonData.media.audio && (
                        <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Audio Lesson</h3>
                            <audio
                                controls
                                className="w-full h-12 accent-primary"
                                src={lessonData.media.audio.url}
                            >
                                <track kind="captions" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>

                {/* Images Section */}
                {lessonData.media.images && lessonData.media.images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {lessonData.media.images.map((img) => (
                            <div key={img._id} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                                <Image
                                    src={img.url}
                                    alt={lessonData.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Lesson Completion Section */}
                <div className="bg-black/40 p-8 rounded-3xl backdrop-blur-sm border border-white/10 mb-8 flex flex-col items-center justify-center text-center">
                    {lessonData.isCompleted ? (
                        <div className="flex flex-col items-center gap-4 text-green-500">
                            <div className="p-4 bg-green-500/20 rounded-full">
                                <CheckCircle size={48} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Lesson Completed!</h3>
                                <p className="text-gray-400 mt-2">You&apos;ve mastered this lesson&apos;s content.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4">Finished with the content?</h3>
                            <p className="text-gray-400 mb-6">Mark this lesson as complete to track your progress.</p>
                            <Button
                                onClick={() => completeLesson(id as string)}
                                disabled={isCompleting}
                                className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3"
                            >
                                {isCompleting ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        <span>Marking as Complete...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={24} />
                                        <span>Complete Lesson</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Exercises / Actions */}
                {lessonData.isExercise && (
                    <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl text-center">
                        <h2 className="text-2xl font-bold text-primary mb-4">Ready to Practice?</h2>
                        <p className="text-gray-300 mb-6">This lesson includes exercises to help you master the concepts.</p>
                        <button className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all">
                            Start Exercise
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleLesson;
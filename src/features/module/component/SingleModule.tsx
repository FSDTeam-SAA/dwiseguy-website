"use client";

import React from "react";
import { Loader2, AlertCircle, BookOpen, PlayCircle, Lock, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSingleModule } from "../hooks/useSingleModule";
import { Lesson } from "../types/module.types";

const SingleModule = () => {
    const { id } = useParams();
    const { data: session } = useSession();
    const accessToken = session?.accessToken || "";

    const { data, isLoading, isError, error } = useSingleModule(
        id as string,
        accessToken
    );

    const moduleData = data?.data;
    const lessons = (moduleData?.lessons as Lesson[]) || [];

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
                <p className="text-xl font-bold">Failed to load module details</p>
                <p className="text-gray-400">
                    {error instanceof Error ? error.message : "Something went wrong"}
                </p>
            </div>
        );
    }

    if (!moduleData) {
        return (
            <div className="container mx-auto min-h-screen flex items-center justify-center text-white">
                <p className="text-xl font-bold">Module not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto min-h-screen text-white p-6 md:p-12">
            <div className="bg-black/40 p-6 sm:p-12 md:p-20 rounded-md backdrop-blur-sm">
                {/* Header Section */}
                <div className="mb-12">
                    <h2 className="text-4xl text-primary font-bold mb-4">{moduleData.title}</h2>
                    <p className="text-lg text-gray-300 max-w-3xl">
                        {moduleData.description}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                        <span className="px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-semibold">
                            Module {moduleData.order}
                        </span>
                        <span className="text-gray-400 text-sm">
                            {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}
                        </span>
                    </div>
                </div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {lessons.map((lesson: Lesson) => (
                        <div
                            key={lesson._id}
                            className={`flex flex-col relative overflow-hidden transition-all duration-500 rounded-2xl p-4 bg-white/5 border border-white/10 group
                                ${lesson.isUnlocked ? 'cursor-pointer hover:scale-105 hover:border-primary hover:bg-white/10' : 'opacity-60 grayscale-[0.5]'}`}
                        >
                            {/* Icon & Status */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${lesson.isExercise ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                    {lesson.isExercise ? <PlayCircle size={20} /> : <BookOpen size={20} />}
                                </div>
                                <div>
                                    {lesson.isCompleted && <CheckCircle size={18} className="text-green-500" />}
                                    {!lesson.isCompleted && !lesson.isUnlocked && <Lock size={18} className="text-gray-500" />}
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">
                                    Lesson {lesson.order}
                                </span>
                                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                    {lesson.title}
                                </h3>
                                <p className="text-gray-400 text-xs line-clamp-2">
                                    {lesson.content}
                                </p>
                            </div>

                            {/* Progress Overlay (Subtle) */}
                            {lesson.isUnlocked && !lesson.isCompleted && (
                                <div className="absolute bottom-0 left-0 h-1 bg-primary/30 w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            )}
                        </div>
                    ))}
                </div>

                {lessons.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl font-medium">No lessons available in this module.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleModule;
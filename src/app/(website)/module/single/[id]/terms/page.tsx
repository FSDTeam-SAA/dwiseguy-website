"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Music } from "lucide-react";
import { GLOSSARY_TERMS } from "@/constants/glossary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsToKnowPage = () => {
    const { id } = useParams();
    const router = useRouter();

    return (
        <div className="container mx-auto p-6 md:p-12 text-white">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary/20 rounded-2xl text-primary shadow-lg shadow-primary/10">
                            <BookOpen size={40} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Terms to Know</h1>
                            <p className="text-gray-400 mt-1 font-medium italic">Your Musical Vocabulary Guide</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    {GLOSSARY_TERMS.map((item) => (
                        <Card
                            key={item.term}
                            className="bg-black/40 border-white/10 text-white overflow-hidden backdrop-blur-sm hover:border-primary/50 transition-all group shadow-xl border-l-4 border-l-primary/50"
                        >
                            <CardHeader className="bg-white/5 pb-2">
                                <CardTitle className="text-2xl flex items-center gap-3">
                                    <Music className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                    {item.term}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 pb-6">
                                <p className="text-gray-200 text-lg leading-relaxed font-medium">
                                    {item.definition}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center bg-primary/5 border border-primary/20 p-10 rounded-3xl">
                    <h3 className="text-xl font-bold mb-4">Mastered these terms?</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Head back to the lessons to see how these concepts come to life in practice.
                    </p>
                    <Button
                        onClick={() => router.push(`/module/single/${id}`)}
                        className="px-12 py-7 text-xl font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Back to Lessons
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TermsToKnowPage;

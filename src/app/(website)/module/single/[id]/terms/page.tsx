"use client";

import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Music, Clock, Activity, Box } from "lucide-react";
import { GLOSSARY_TERMS, GlossaryTerm } from "@/constants/glossary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsToKnowPage = () => {
    const { id } = useParams();
    const router = useRouter();

    // Group terms by category
    const categories: Record<string, GlossaryTerm[]> = GLOSSARY_TERMS.reduce((acc, term) => {
        if (!acc[term.category]) {
            acc[term.category] = [];
        }
        acc[term.category].push(term);
        return acc;
    }, {} as Record<string, GlossaryTerm[]>);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Fundamentals": return <Box className="w-6 h-6 text-blue-400" />;
            case "Rhythm": return <Clock className="w-6 h-6 text-orange-400" />;
            case "Note Anatomy": return <Activity className="w-6 h-6 text-green-400" />;
            case "Values & Rests": return <Music className="w-6 h-6 text-primary" />;
            default: return <Music className="w-6 h-6 text-primary" />;
        }
    };

    return (
        <div className="h-full w-full bg-[url('/images/login.jpg')] opacity-85 bg-cover bg-center mt-0!">

            <div className="container mx-auto p-6 md:p-12 text-white ">
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
                                <h1 className="text-4xl font-bold tracking-tight">Terms to Know</h1>
                                <p className="text-gray-400 mt-1 font-medium italic">Your Musical Vocabulary Guide</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16">
                        {Object.entries(categories).map(([category, terms]) => (
                            <div key={category} className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                    {getCategoryIcon(category)}
                                    <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-300">
                                        {category}
                                    </h2>
                                </div>

                                <div className="grid gap-6">
                                    {terms.map((item) => (
                                        <Card
                                            key={item.term}
                                            className="bg-black/40 border-white/10 text-white overflow-hidden backdrop-blur-sm hover:border-primary/50 transition-all group shadow-xl border-l-4 border-l-primary/50"
                                        >
                                            <CardHeader className="bg-white/5 pb-2 flex flex-row items-center justify-between">
                                                <CardTitle className="text-2xl flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                    {item.term}
                                                </CardTitle>
                                                {item.lesson && (
                                                    <span className="text-[10px] bg-white/10 text-gray-400 px-3 py-1 rounded-full font-bold uppercase tracking-tighter">
                                                        {item.lesson}
                                                    </span>
                                                )}
                                            </CardHeader>
                                            <CardContent className="pt-6 pb-6 flex flex-col md:flex-row gap-6 items-start">
                                                {item.image && (
                                                    <div className="w-full md:w-48 h-32 relative bg-white/5 rounded-xl overflow-hidden border border-white/10 group-hover:border-primary/30 transition-colors flex-shrink-0">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.term}
                                                            fill
                                                            className="object-contain p-2"
                                                            sizes="(max-width: 768px) 100vw, 192px"
                                                        />
                                                    </div>
                                                )}
                                                <p className="text-gray-200 text-lg leading-relaxed font-medium">
                                                    {item.definition}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-12 rounded-[2rem] backdrop-blur-md">
                        <h3 className="text-2xl font-bold mb-4">Mastered these terms?</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
                            Head back to the lessons to see how these concepts come to life in practice.
                        </p>
                        <Button
                            onClick={() => router.push(`/module/single/${id}`)}
                            className="px-12 py-8 text-xl font-bold bg-primary hover:bg-primary/80 text-white rounded-2xl shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] transition-all hover:scale-105 active:scale-95"
                        >
                            Back to Lessons
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsToKnowPage;

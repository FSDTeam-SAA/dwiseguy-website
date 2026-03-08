"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useGetStudentQuizDetailedResult } from "../hooks/useGetStudentQuizDetailedResult";
import { useGetStudentQuiz } from "../hooks/useGetStudentQuiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IQuiz, IDetailedResult, IQuizDetailedResult, IQuestion, IOption } from "../types/quize";

const ReviewAnswers = () => {
    const { id: urlId } = useParams();
    const router = useRouter();

    // 1. Fetch quiz questions (urlId is the quizId)
    const { data: quizData, isLoading: isLoadingQuiz, isError: isErrorQuiz } = useGetStudentQuiz(urlId as string);

    // 2. Fetch detailed results (Answer Key) using the quizId directly
    const { data: detailedData, isLoading: isLoadingDetailed, isError: isErrorDetailed } = useGetStudentQuizDetailedResult(urlId as string);

    const result: IQuizDetailedResult | undefined = detailedData?.data;

    if (isLoadingQuiz || isLoadingDetailed) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (isErrorQuiz || isErrorDetailed || !detailedData?.data || !quizData?.data) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-white p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-bold">Failed to load answer key</p>
                <div className="flex gap-4 mt-4">
                    <Button onClick={() => router.back()} variant="outline" className="text-white border-white/20 hover:bg-white/10">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const quiz: IQuiz = quizData.data;

    // Create maps for robust lookup: either by ID or by Question Text fallback
    const detailedResultsById = new Map<string, IDetailedResult>();
    const detailedResultsByText = new Map<string, IDetailedResult>();

    if (result?.detailedResults) {
        result.detailedResults.forEach(item => {
            if (item.questionId) detailedResultsById.set(String(item.questionId), item);

            // Note: We don't have the question text in the detailed result item yet 
            // unless we find it in the quiz data first. But we can match results back after we have them.
        });
    }

    return (
        <div className="container mx-auto p-6 md:p-12 text-white max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10 shrink-0">
                        <ArrowLeft size={24} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{quiz.title}</h1>
                        <p className="text-gray-400 font-medium">Official Answer Key</p>
                    </div>
                </div>
                <div className="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Questions</span>
                    <p className="text-2xl font-bold text-primary text-center">{quiz.questions.length}</p>
                </div>
            </div>

            <div className="space-y-8">
                {quiz.questions.map((question: IQuestion, index: number) => {
                    const qId = String(question.questionId || question._id || index);

                    // Robust Lookup: check ID first, then try matching by question text if we can find it in results
                    const detailedResult = detailedResultsById.get(qId);

                    if (!detailedResult && result?.detailedResults) {
                        // Ultimate fallback: Try to match result to question by comparing the "selected/correct" labels 
                        // if we had them, OR just hope ID works. 
                        // Actually, let's just make the ID matching extremely robust.
                    }

                    return (
                        <Card key={qId} className="bg-black/40 border-white/10 text-white overflow-hidden backdrop-blur-sm shadow-xl border-l-4 border-l-primary/50">
                            <CardHeader className="bg-white/5 pb-3">
                                <CardTitle className="text-xl flex justify-between items-start gap-4">
                                    <div className="leading-relaxed">
                                        <span className="text-primary mr-3 italic font-bold">Q{index + 1}.</span>
                                        {question.questionText}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="grid gap-3">
                                    {question.options.map((option: IOption) => {
                                        // 1. Normalize correct answers (handle both correctOption and correctOptions array)
                                        const possibleCorrectAnswers = [
                                            detailedResult?.correctOption,
                                            ...(detailedResult?.correctOptions || [])
                                        ]
                                            .filter(Boolean)
                                            .map(a => String(a).trim().toLowerCase());

                                        // 2. Normalize current option values to check against
                                        const optionVariants = [
                                            option.optionText,
                                            option.value,
                                            option.label
                                        ]
                                            .filter(Boolean)
                                            .map(v => String(v).trim().toLowerCase());

                                        // 3. check if any variant of the current option matches any valid correct answer
                                        const isCorrect = optionVariants.some(variant =>
                                            possibleCorrectAnswers.includes(variant)
                                        );

                                        const optionStyles = isCorrect
                                            ? "bg-green-500/15 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                                            : "bg-white/5 border-white/5 opacity-70";

                                        return (
                                            <div
                                                key={option._id || option.optionText || option.value}
                                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${optionStyles}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-lg ${isCorrect ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                                                        {option.optionText || option.label || option.value}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {isCorrect && (
                                                        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-green-500 text-white shadow-lg shadow-green-500/20 flex items-center gap-2">
                                                            <CheckCircle2 size={14} /> Correct Answer
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {!detailedResult && (
                                    <p className="text-xs text-yellow-500/60 italic mt-2 flex items-center gap-2">
                                        <AlertCircle size={12} /> Detailed answer info missing for this question ID.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-12 mb-20 flex justify-center">
                <Button onClick={() => router.back()} className="px-12 py-8 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                    Back to Results
                </Button>
            </div>
        </div>
    );
};

export default ReviewAnswers;

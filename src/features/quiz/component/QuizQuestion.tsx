"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, AlertCircle, Timer, Send, Lock } from "lucide-react";
import { useGetStudentQuiz } from "../hooks/useGetStudentQuiz";
import { useSubmitStudentQuiz } from "../hooks/useSubmitStudentQuiz";
import { IQuestion, IOption, QuizSubmit, IQuiz, IQuizResult } from "../types/quize";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QuizResultPopUp from "./QuizResultPopUp";

const QuizContent = ({ quizData, accessToken }: { quizData: IQuiz; accessToken: string }) => {
    const router = useRouter();
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        const totalQuestions = quizData.questions.length;
        const duration = quizData.durationInMinutes || totalQuestions;
        return duration * 60;
    });
    const [isLocked, setIsLocked] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [resultData, setResultData] = useState<IQuizResult | null>(null);

    const { mutate: submitQuiz, isPending: isSubmitting } = useSubmitStudentQuiz(accessToken);

    // Handle Submission
    const handleSubmission = useCallback(() => {
        if (hasSubmitted || !quizData) return;

        const payload: QuizSubmit = {
            quizId: quizData._id,
            timeTaken: (quizData.durationInMinutes || quizData.questions.length) * 60 - (timeLeft || 0),
            answers: Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
                questionId,
                selectedOption,
            })),
        };

        submitQuiz(payload, {
            onSuccess: (response) => {
                setHasSubmitted(true);
                setResultData(response.data);
                setIsResultModalOpen(true);
            },
            onError: (err) => {
                console.error("Submission failed:", err);
                alert("Failed to submit quiz. Please try again.");
            }
        });
    }, [hasSubmitted, quizData, selectedAnswers, submitQuiz, timeLeft]);

    // Timer logic
    useEffect(() => {
        if (hasSubmitted || isLocked) return;

        if (timeLeft <= 0) {
            handleSubmission();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, hasSubmitted, isLocked, handleSubmission]);

    // Tab switching detection (Page Visibility API)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !hasSubmitted) {
                setIsLocked(true);
                setShowWarning(true);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [hasSubmitted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleOptionSelect = (questionId: string, optionValue: string) => {
        if (isLocked || hasSubmitted) return;
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionValue,
        }));
    };

    return (
        <div className="container mx-auto p-6 md:p-12 text-white max-w-4xl">
            {/* Header with Timer and Info */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 sticky top-0 bg-background/80 backdrop-blur-md z-10 p-4 rounded-2xl border border-white/10 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{quizData.title}</h1>
                    <p className="text-gray-400 text-sm">{quizData.description}</p>
                </div>
                <div className={`flex items-center gap-3 px-6 py-2 rounded-full border ${timeLeft < 60 ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-primary/20 border-primary text-primary'}`}>
                    <Timer size={20} />
                    <span className="font-mono text-xl font-bold">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Warning Message */}
            {showWarning && (
                <Alert variant="destructive" className="mb-8 border-red-500 bg-red-500/10 text-red-400">
                    <Lock className="h-4 w-4" />
                    <AlertTitle>Quiz Locked</AlertTitle>
                    <AlertDescription>
                        You switched tabs or minimized the window. Further interaction is disabled for security reasons. Your quiz will be submitted automatically or you can click submit below.
                    </AlertDescription>
                </Alert>
            )}

            {/* Questions List */}
            <div className={`space-y-8 ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                {quizData.questions.map((question: IQuestion, index: number) => {
                    const qId = (question.questionId || question._id || `q-${index}`).toString();
                    return (
                        <Card key={qId} className="bg-black/40 border-white/10 text-white overflow-hidden backdrop-blur-sm">
                            <CardHeader className="bg-white/5">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl leading-relaxed">
                                        <span className="text-primary mr-3 italic">Q{index + 1}.</span>
                                        {question.questionText}
                                    </CardTitle>
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                        {question.points} Points
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {question.options.map((option: IOption, optIndex: number) => (
                                    <label
                                        key={option._id || option.optionText || optIndex}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group outline-none focus-within:ring-2 focus-within:ring-primary ${selectedAnswers[qId] === (option.value || option.optionText)
                                            ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                            } ${isLocked || hasSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            name={`question-${qId}`}
                                            value={option.value || option.optionText}
                                            checked={selectedAnswers[qId] === (option.value || option.optionText)}
                                            onChange={() => handleOptionSelect(qId, option.value || option.optionText || "")}
                                            disabled={isLocked || hasSubmitted}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedAnswers[qId] === (option.value || option.optionText)
                                            ? 'border-primary bg-primary/20'
                                            : 'border-gray-600 group-hover:border-gray-400'
                                            }`}>
                                            {selectedAnswers[qId] === (option.value || option.optionText) && (
                                                <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                                            )}
                                        </div>
                                        <span className="text-lg">{option.optionText || option.label}</span>
                                    </label>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Footer Actions */}
            <div className="mt-12 flex flex-col items-center gap-6 p-8 bg-black/40 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="text-center">
                    <p className="text-gray-400 mb-2 font-medium">
                        {Object.keys(selectedAnswers).length} of {quizData.questions.length} questions answered
                    </p>
                    {Object.keys(selectedAnswers).length < quizData.questions.length ? (
                        <p className="text-orange-400 text-sm flex items-center gap-2 justify-center">
                            <AlertCircle size={14} />
                            Please answer all questions before submitting
                        </p>
                    ) : (
                        <p className="text-green-400 text-sm flex items-center gap-2 justify-center">
                            <AlertCircle size={14} />
                            All questions answered. Ready to submit!
                        </p>
                    )}
                </div>

                <Button
                    onClick={handleSubmission}
                    disabled={isSubmitting || hasSubmitted || (isLocked && !showWarning)}
                    className="w-full max-w-md py-8 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            <span>Submitting Quiz...</span>
                        </>
                    ) : (
                        <>
                            <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            <span>Submit Quiz</span>
                        </>
                    )}
                </Button>
            </div>
            {/* Quiz Results Popup */}
            <QuizResultPopUp
                isOpen={isResultModalOpen}
                onClose={() => setIsResultModalOpen(false)}
                data={resultData}
            />
        </div>
    );
};

const QuizPage = () => {
    const { id } = useParams();
    const { data: session } = useSession();
    const accessToken = session?.accessToken || "";

    const { data, isLoading, isError, error } = useGetStudentQuiz(id as string, accessToken);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-white p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-bold">Failed to load quiz</p>
                <p className="text-gray-400">
                    {error instanceof Error ? error.message : "The quiz could not be loaded."}
                </p>
            </div>
        );
    }

    return <QuizContent key={id as string} quizData={data.data} accessToken={accessToken} />;
};

export default QuizPage;

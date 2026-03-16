"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Timer, TrendingUp, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { IQuizResult } from "../types/quize";
import { useModuleComplete } from "../hooks/useModuleComplete";

interface QuizResultPopUpProps {
    isOpen: boolean;
    onClose: () => void;
    data?: IQuizResult | null;
    errorMessage?: string | null;
}

const QuizResultPopUp = ({ isOpen, onClose, data, errorMessage }: QuizResultPopUpProps) => {
    const router = useRouter();
    const { mutate: completeModule, isPending: isCompleting } = useModuleComplete();

    if (!data && !errorMessage) return null;

    const handleCompleteModule = () => {
        if (!data?.moduleId) return;
        completeModule({ moduleId: data.moduleId }, {
            onSuccess: () => {
                onClose();
                router.back();
            },
            onError: (error) => {
                console.error("Failed to complete module:", error);
                alert("Failed to mark module as completed. Please try again.");
            }
        });
    };

    const isPassed = data ? data.percentage >= data.passingPercentage : false;

    let icon = <AlertCircle className="w-12 h-12 text-red-500" />;
    if (!errorMessage && isPassed) {
        icon = <CheckCircle2 className="w-12 h-12 text-green-500" />;
    }

    let title = "Keep Practicing!";
    if (errorMessage) {
        title = "Access Denied";
    } else if (isPassed) {
        title = "Congratulations!";
    }

    const description = errorMessage || data?.message || (isPassed ? "You've successfully completed this quiz." : "You didn't reach the passing score this time.");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-[#333] text-white">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <div className={`w-20 h-20 rounded-full bg-${errorMessage || !isPassed ? 'red' : 'green'}-500/20 flex items-center justify-center border-2 border-${errorMessage || !isPassed ? 'red' : 'green'}-500/50 ${isPassed && !errorMessage ? 'animate-pulse' : ''}`}>
                            {icon}
                        </div>
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center mb-2">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {!errorMessage && data && (
                    <div className="grid grid-cols-2 gap-4 py-6">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2 border-green-500/30">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Right Answers</span>
                            <span className="text-2xl font-bold text-green-500">{data.score}</span>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2 border-red-500/30">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Wrong Answers</span>
                            <span className="text-2xl font-bold text-red-500">{data.totalMarks - data.score}</span>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Percentage</span>
                            <span className="text-2xl font-bold">{data.percentage}%</span>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2">
                            <Timer className="w-5 h-5 text-primary" />
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Time taken</span>
                            <span className="text-2xl font-bold">{data.timeTaken}s</span>
                        </div>
                    </div>
                )}

                <DialogFooter className="flex sm:flex-col gap-3">
                    {errorMessage ? (
                        <Button
                            onClick={() => router.back()}
                            className="bg-primary hover:bg-primary/90 text-white w-full h-12 text-lg font-bold"
                        >
                            Back to Module
                        </Button>
                    ) : (
                        <>
                            {!isPassed && (
                                <Button
                                    onClick={() => globalThis.location.reload()}
                                    className="bg-primary hover:bg-primary/90 text-white w-full h-12 text-lg font-bold"
                                >
                                    Try Again
                                </Button>
                            )}

                            {isPassed && (
                                <Button
                                    onClick={handleCompleteModule}
                                    disabled={isCompleting}
                                    className="bg-green-600 hover:bg-green-700 text-white w-full h-12 text-lg font-bold flex items-center justify-center gap-2"
                                >
                                    {isCompleting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Completing...</span>
                                        </>
                                    ) : (
                                        "Complete Module"
                                    )}
                                </Button>
                            )}

                            {isPassed && (
                                <Button
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="border-primary text-primary hover:bg-primary/10 w-full h-12 text-lg font-bold"
                                >
                                    Back to Module
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                onClick={() => router.push(`/quiz/review/${data?.quizId}`)}
                                className="text-gray-400 hover:text-white hover:bg-white/5"
                            >
                                Review Answers
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default QuizResultPopUp;

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
import { Badge } from "@/components/ui/badge";
import { Timer, Target, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

import { IQuizResult } from "../types/quize";

interface QuizResultPopUpProps {
    isOpen: boolean;
    onClose: () => void;
    data: IQuizResult | null;
}

const QuizResultPopUp = ({ isOpen, onClose, data }: QuizResultPopUpProps) => {
    const router = useRouter();

    if (!data) return null;

    const isPassed = data.percentage >= data.passingPercentage;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-[#333] text-white">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        {isPassed ? (
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500/50 animate-pulse">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500/50">
                                <AlertCircle className="w-12 h-12 text-red-500" />
                            </div>
                        )}
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center mb-2">
                        {isPassed ? "Congratulations!" : "Keep Practicing!"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-center">
                        {data.message || (isPassed ? "You've successfully completed this quiz." : "You didn't reach the passing score this time.")}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Score</span>
                        <span className="text-2xl font-bold">{data.percentage}%</span>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2">
                        <Timer className="w-5 h-5 text-primary" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Time taken</span>
                        <span className="text-2xl font-bold">{data.timeTaken}s</span>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Status</span>
                        <Badge variant={isPassed ? "default" : "destructive"} className="uppercase">
                            {data.status.replace("_", " ")}
                        </Badge>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Passing</span>
                        <span className="text-2xl font-bold">{data.passingPercentage}%</span>
                    </div>
                </div>

                <DialogFooter className="flex sm:flex-col gap-3">
                    {!isPassed && (
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-primary hover:bg-primary/90 text-white w-full h-12 text-lg font-bold"
                        >
                            Try Again
                        </Button>
                    )}

                    {isPassed && (
                        <Button
                            onClick={() => router.back()}
                            className="bg-primary hover:bg-primary/90 text-white w-full h-12 text-lg font-bold"
                        >
                            Back to Module
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-white/5"
                    >
                        Review Answers
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default QuizResultPopUp;

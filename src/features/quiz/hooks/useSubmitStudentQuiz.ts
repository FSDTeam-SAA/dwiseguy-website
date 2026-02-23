// src/features/quiz/hooks/useSubmitStudentQuiz.ts

import { useMutation } from "@tanstack/react-query";
import { submitStudentQuiz } from "../api/quiz.api";
import { QuizSubmit } from "../types/quize";
import { useSession } from "next-auth/react";


export const useSubmitStudentQuiz = () => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useMutation({
        mutationFn: (payload: QuizSubmit) => submitStudentQuiz(payload, token || ""),
    });
};
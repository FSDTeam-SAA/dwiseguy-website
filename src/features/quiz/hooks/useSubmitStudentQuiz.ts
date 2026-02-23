// src/features/quiz/hooks/useSubmitStudentQuiz.ts

import { useMutation } from "@tanstack/react-query";
import { submitStudentQuiz } from "../api/quiz.api";
import { QuizSubmit } from "../types/quize";


export const useSubmitStudentQuiz = (accessToken: string) => {
    return useMutation({
        mutationFn: (payload: QuizSubmit) => submitStudentQuiz(payload, accessToken),
    });
};
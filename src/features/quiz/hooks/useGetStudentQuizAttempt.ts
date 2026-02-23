// src/features/quiz/hooks/useGetStudentQuizCheckAttempt.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuizAttempt } from "../api/quiz.api";


export const useGetStudentQuizAttempt = (id: string, accessToken: string) => {
    return useQuery({
        queryKey: ["student-quiz-attempt", id],
        queryFn: () => getStudentQuizAttempt(id, accessToken),
        enabled: !!id && !!accessToken,
    });
};
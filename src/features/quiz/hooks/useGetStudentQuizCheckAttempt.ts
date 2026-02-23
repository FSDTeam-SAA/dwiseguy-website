// src/features/quiz/hooks/useGetStudentQuizCheckAttempt.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuizCheckAttempt } from "../api/quiz.api";


export const useGetStudentQuizCheckAttempt = (id: string, accessToken: string) => {
    return useQuery({
        queryKey: ["student-quiz-check-attempt", id],
        queryFn: () => getStudentQuizCheckAttempt(id, accessToken),
        enabled: !!id && !!accessToken,
    });
};

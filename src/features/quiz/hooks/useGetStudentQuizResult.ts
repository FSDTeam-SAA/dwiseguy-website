// src/features/quiz/hooks/useGetStudentQuizResult.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuizResult } from "../api/quiz.api";


export const useGetStudentQuizResult = (id: string, accessToken: string) => {
    return useQuery({
        queryKey: ["student-quiz-result", id],
        queryFn: () => getStudentQuizResult(id, accessToken),
        enabled: !!id && !!accessToken,
    });
};
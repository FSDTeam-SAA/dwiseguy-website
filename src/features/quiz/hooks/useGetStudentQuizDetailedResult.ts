// src/features/quiz/hooks/useGetStudentQuizDetailedResult.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuizDetailedResult } from "../api/quiz.api";


export const useGetStudentQuizDetailedResult = (id: string, accessToken: string) => {
    return useQuery({
        queryKey: ["student-quiz-detailed-result", id],
        queryFn: () => getStudentQuizDetailedResult(id, accessToken),
        enabled: !!id && !!accessToken,
    });
};

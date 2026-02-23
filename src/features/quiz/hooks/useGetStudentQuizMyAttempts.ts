// src/features/quiz/hooks/useGetStudentQuizMyAttempts.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuizMyAttempts } from "../api/quiz.api";


export const useGetStudentQuizMyAttempts = (accessToken: string) => {
    return useQuery({
        queryKey: ["student-quiz-my-attempts"],
        queryFn: () => getStudentQuizMyAttempts(accessToken),
        enabled: !!accessToken,
    });
};

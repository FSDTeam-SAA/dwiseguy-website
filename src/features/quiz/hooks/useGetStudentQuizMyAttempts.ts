// src/features/quiz/hooks/useGetStudentQuizMyAttempts.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuizMyAttempts } from "../api/quiz.api";
import { useSession } from "next-auth/react";
import { QuizAttemptsResponse } from "../types/quize";

export const useGetStudentQuizMyAttempts = () => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery<QuizAttemptsResponse>({
        queryKey: ["student-quiz-my-attempts", token],
        queryFn: () => getStudentQuizMyAttempts(token || ""),
        enabled: !!token,
    });
};

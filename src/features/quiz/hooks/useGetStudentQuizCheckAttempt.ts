// src/features/quiz/hooks/useGetStudentQuizCheckAttempt.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuizCheckAttempt } from "../api/quiz.api";
import { useSession } from "next-auth/react";


export const useGetStudentQuizCheckAttempt = (id: string) => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: ["student-quiz-check-attempt", id, token],
        queryFn: () => getStudentQuizCheckAttempt(id, token || ""),
        enabled: !!id && !!token,
    });
};

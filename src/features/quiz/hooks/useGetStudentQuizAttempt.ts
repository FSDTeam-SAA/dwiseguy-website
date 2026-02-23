// src/features/quiz/hooks/useGetStudentQuizCheckAttempt.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuizAttempt } from "../api/quiz.api";
import { useSession } from "next-auth/react";


export const useGetStudentQuizAttempt = (id: string) => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: ["student-quiz-attempt", id, token],
        queryFn: () => getStudentQuizAttempt(id, token || ""),
        enabled: !!id && !!token,
    });
};
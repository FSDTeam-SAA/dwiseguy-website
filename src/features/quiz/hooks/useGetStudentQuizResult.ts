// src/features/quiz/hooks/useGetStudentQuizResult.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuizResult } from "../api/quiz.api";
import { useSession } from "next-auth/react";


export const useGetStudentQuizResult = (id: string) => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: ["student-quiz-result", id, token],
        queryFn: () => getStudentQuizResult(id, token || ""),
        enabled: !!id && !!token,
    });
};
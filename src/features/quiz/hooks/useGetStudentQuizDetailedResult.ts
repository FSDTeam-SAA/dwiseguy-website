// src/features/quiz/hooks/useGetStudentQuizDetailedResult.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuizDetailedResult } from "../api/quiz.api";
import { useSession } from "next-auth/react";


export const useGetStudentQuizDetailedResult = (id: string) => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: ["student-quiz-detailed-result", id, token],
        queryFn: () => getStudentQuizDetailedResult(id, token || ""),
        enabled: !!id && !!token,
    });
};

// src/features/quiz/hooks/useGetStudentQuiz.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuiz } from "../api/quiz.api";
import { useSession } from "next-auth/react";

export const useGetStudentQuiz = (id: string) => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: ["student-quiz", id, token],
        queryFn: () => getStudentQuiz(id, token || ""),
        enabled: !!id && !!token,
    });
};

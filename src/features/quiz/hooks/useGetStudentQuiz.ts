// src/features/quiz/hooks/useGetStudentQuiz.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentQuiz } from "../api/quiz.api";

export const useGetStudentQuiz = (id: string, accessToken: string) => {
    return useQuery({
        queryKey: ["student-quiz", id],
        queryFn: () => getStudentQuiz(id, accessToken),
        enabled: !!id && !!accessToken,
    });
};

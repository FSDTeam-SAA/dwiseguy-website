// d:/Iftykhar/dwiseguy/dwiseguy-website/src/features/exercise/hooks/useSingleExercise.ts
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { exerciseApi } from "../api/exercise.api";

interface CustomSession {
    accessToken?: string;
}

export const useSingleExercise = (exerciseId: string) => {
    const { data: session } = useSession();
    const token = (session as CustomSession)?.accessToken;

    return useQuery({
        queryKey: ["exercise", exerciseId, token],
        queryFn: () => exerciseApi.getSingleExercise(exerciseId, token as string),
        enabled: !!exerciseId,
        staleTime: 5 * 60 * 1000,
    });
};

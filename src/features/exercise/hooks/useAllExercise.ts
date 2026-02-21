// d:/Iftykhar/dwiseguy/dwiseguy-website/src/features/exercise/hooks/useAllExercise.ts
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { exerciseApi } from "../api/exercise.api";

interface CustomSession {
    accessToken?: string;
}

export const useAllExercise = () => {
    const { data: session } = useSession();
    const token = (session as CustomSession)?.accessToken;

    return useQuery({
        queryKey: ["exercises", token],
        queryFn: () => exerciseApi.getAllExercises(token as string),
        // Only run query if we want to allow public access too? 
        // Based on lesson.api it needs token, so maybe enabled: !!token
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

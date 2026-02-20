import { useQuery } from "@tanstack/react-query";
import { exerciseApi } from "../api/exercise.api";
import { useSession } from "next-auth/react";
// import { CustomSession } from "@/types/next-auth";

interface CustomSession {
    accessToken?: string;
}

export const useExerciseContent = (exerciseId: string, token?: string) => {
    return useQuery({
        queryKey: ["exerciseContent", exerciseId],
        queryFn: () => exerciseApi.getExerciseContent(exerciseId, token),
        enabled: !!exerciseId,
    });
};

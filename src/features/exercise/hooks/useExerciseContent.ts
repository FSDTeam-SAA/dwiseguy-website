import { useQuery } from "@tanstack/react-query";
import { exerciseApi } from "../api/exercise.api";
import { useSession } from "next-auth/react";
// import { CustomSession } from "@/types/next-auth";

interface CustomSession {
    accessToken?: string;
}

export const useExerciseContent = (exerciseId: string, externalToken?: string) => {
    const { data: session } = useSession();
    const token = externalToken || (session as CustomSession)?.accessToken;

    return useQuery({
        queryKey: ["exerciseContent", exerciseId],
        queryFn: () => exerciseApi.getExerciseContent(exerciseId, token),
        enabled: !!exerciseId,
    });
};

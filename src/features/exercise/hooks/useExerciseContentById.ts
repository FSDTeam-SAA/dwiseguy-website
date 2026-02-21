import { useQuery } from "@tanstack/react-query";
import { exerciseApi } from "../api/exercise.api";
import { useSession } from "next-auth/react";
// import { CustomSession } from "@/types/next-auth";

interface CustomSession {
    accessToken?: string;
}


export const useExerciseContentById = (exerciseId: string, externalToken?: string) => {
    const { data: session } = useSession();
    const token = externalToken || (session as CustomSession)?.accessToken;

    return useQuery({
        queryKey: ["exerciseContentById", exerciseId],
        queryFn: () => exerciseApi.getExerciseContentById(exerciseId, token),
        enabled: !!exerciseId,
    });
};

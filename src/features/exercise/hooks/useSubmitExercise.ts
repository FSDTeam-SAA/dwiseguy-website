// d:/Iftykhar/dwiseguy/dwiseguy-website/src/features/exercise/hooks/useSubmitExercise.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { exerciseApi } from "../api/exercise.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface CustomSession {
    accessToken?: string;
}

export const useSubmitExercise = () => {
    const { data: session } = useSession();
    const token = (session as CustomSession)?.accessToken;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (exerciseId: string) => exerciseApi.submitExercise(exerciseId, token as string),
        onSuccess: () => {
            toast.success("Exercise submitted successfully!");
            // Invalidate progress queries to refresh lock/unlock status
            queryClient.invalidateQueries({ queryKey: ["progress"] });
            queryClient.invalidateQueries({ queryKey: ["exercises"] });
        },
        onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage = axiosError?.response?.data?.message || "Failed to submit exercise";
            toast.error(errorMessage);
        },
    });
};

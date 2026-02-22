// src/features/lesson/hooks/useCompleteLesson.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonApi } from "../api/lesson.api";
import { toast } from "sonner";

export const useCompleteLesson = (accessToken: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lessonId: string) => lessonApi.completeLesson(lessonId, accessToken),
        onSuccess: () => {
            toast.success("Lesson marked as completed!");
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["singleLesson"] });
            queryClient.invalidateQueries({ queryKey: ["allModules"] });
            queryClient.invalidateQueries({ queryKey: ["singleModule"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to complete lesson");
        },
    });
};

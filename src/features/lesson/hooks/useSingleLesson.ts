// src/features/lesson/hooks/useSingleLesson.ts

import { useQuery } from "@tanstack/react-query";
import { lessonApi } from "../api/lesson.api";
import { SingleLessonApiResponse } from "../types/lesson.types";

export const useSingleLesson = (lessonId: string, accessToken: string) => {
    return useQuery<SingleLessonApiResponse>({
        queryKey: ["lesson", lessonId],
        queryFn: () => lessonApi.getSingleLesson(lessonId, accessToken),
        enabled: !!lessonId && !!accessToken,
    });
};
// src/features/lesson/api/lesson.api.ts

import { api } from "@/lib/api";

// {{domain}}{{baseApi}}/lesson/get-single-lesson/{{lessonId}}

export const lessonApi = {
    getSingleLesson: async (lessonId: string, accessToken: string) => {
        const response = await api.get(`/lesson/get-single-lesson/${lessonId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    },

    completeLesson: async (lessonId: string, accessToken: string) => {
        const response = await api.patch(`/lesson/complete-lesson/${lessonId}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    },
};

// src/features/exercise/api/exercise.api.ts
import { api } from "@/lib/api";
import { AllExercisesResponse, SingleExerciseResponse } from "../types/exercise.types";

export const exerciseApi = {
    getAllExercises: async (token?: string): Promise<AllExercisesResponse["data"]> => {
        const response = await api.get("/exercise/get-all-exercises", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return response.data.data;
    },

    getSingleExercise: async (exerciseId: string, token?: string): Promise<SingleExerciseResponse["data"]> => {
        const response = await api.get(`/exercise/get-single-exercise/${exerciseId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return response.data.data;
    },

    getExerciseContent: async (exerciseId: string, token?: string): Promise<SingleExerciseResponse["data"]["ExerciseContent"][number][]> => {
        const response = await api.get(`/exercise/get-single-exercise/${exerciseId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return response.data.data;
    },

    getExerciseContentById: async (exerciseId: string, token?: string): Promise<SingleExerciseResponse["data"]["ExerciseContent"][number][]> => {
        const response = await api.get(`/exercise/get-single-exercise/${exerciseId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return response.data.data;
    },

    submitExercise: async (exerciseId: string, token: string): Promise<unknown> => {
        const response = await api.post("/progress/complete-lesson", { exerciseId }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};

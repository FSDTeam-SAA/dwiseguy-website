// src/features/progress/api/progresscard.api.ts

import { api } from "@/lib/api";
import { ProgressStatsResponse } from "../types/progress.types";

// get method /progress/global-stats

export const progresscardApi = {
    getGlobalStats: async (token?: string): Promise<ProgressStatsResponse> => {
        const response = await api.get("/progress/global-stats", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return response.data;
    },
};
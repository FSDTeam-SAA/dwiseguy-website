// src/features/progress/api/progresscard.api.ts

import { api } from "@/lib/api";
import { LeaderboardResponse, ProgressStatsResponse } from "../types/progress.types";

// get method /progress/global-stats

export const progresscardApi = {
    getGlobalStats: async (token?: string): Promise<ProgressStatsResponse> => {
        const response = await api.get("/progress/global-stats", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return response.data;
    },
    getLeaderboard: async (token?: string): Promise<LeaderboardResponse> => {
        const response = await api.get("/progress/leaderboard", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return response.data;
    },
};

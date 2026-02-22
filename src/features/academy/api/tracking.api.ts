// src/features/academy/api/tracking.api.ts

import { api } from "@/lib/api";

export const trackingApi = {
    async trackProgress(payload: { instrumentId: string, userId: string }, accessToken: string) {
        const response = await api.post("/progress/start-instrument", payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }
}
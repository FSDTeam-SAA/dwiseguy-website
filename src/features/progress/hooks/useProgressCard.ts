// src/features/progress/hooks/useProgressCard.ts

import { useQuery } from "@tanstack/react-query";
import { progresscardApi } from "../api/progresscard.api";
import { ProgressStatsResponse } from "../types/progress.types";

export const useProgressCard = () => {
    return useQuery<ProgressStatsResponse>({
        queryKey: ["progress-card"],
        queryFn: () => progresscardApi.getGlobalStats(),
    });
};
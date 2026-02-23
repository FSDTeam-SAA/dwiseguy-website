// src/features/progress/hooks/useProgressCard.ts

import { useQuery } from "@tanstack/react-query";
import { progresscardApi } from "../api/progresscard.api";
import { ProgressStatsResponse } from "../types/progress.types";
import { useSession } from "next-auth/react";

export const useProgressCard = () => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery<ProgressStatsResponse>({
        queryKey: ["progress-card", token],
        queryFn: () => progresscardApi.getGlobalStats(token || ""),
        enabled: !!token,
    });
};
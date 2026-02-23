// src/features/progress/hooks/useLeaderboard.ts

import { useQuery } from "@tanstack/react-query";
import { progresscardApi } from "../api/progresscard.api";
import { LeaderboardResponse } from "../types/progress.types";
import { useSession } from "next-auth/react";

export const useLeaderboard = () => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery<LeaderboardResponse>({
        queryKey: ["leaderboard", token],
        queryFn: () => progresscardApi.getLeaderboard(token),
        enabled: !!token,
    });
};

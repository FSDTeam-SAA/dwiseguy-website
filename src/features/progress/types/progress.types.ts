export interface ProgressStats {
    lessonsPercent: number;
    exercisesPercent: number;
    quizPercent: number;
}

export interface ProgressStatsResponse {
    success: boolean;
    message: string;
    meta: null;
    data: ProgressStats;
}

export interface LeaderboardUser {
    _id: string;
    totalCompletedSteps: number;
    instrumentsStarted: number;
    name: string;
    username: string;
    avatar: {
        public_id: string;
        url: string;
        file_type: string;
    };
}

export interface LeaderboardResponse {
    success: boolean;
    message: string;
    meta: unknown;
    data: LeaderboardUser[];
}

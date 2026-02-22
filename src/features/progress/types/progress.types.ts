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

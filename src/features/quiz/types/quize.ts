export type QuizSubmit = {
    quizId: string;
    timeTaken: number;
    answers: {
        questionId: string;
        selectedOption: string;
    }[];
}

export interface IOption {
    _id: string;
    label?: string;
    optionText?: string;
    value: string;
}

export interface IQuestion {
    _id?: string;
    questionId?: string;
    questionText: string;
    options: IOption[];
    points: number;
}

export interface IQuiz {
    _id: string;
    moduleId: string;
    title: string;
    description: string;
    questions: IQuestion[];
    durationInMinutes?: number;
}

export interface IQuizApiResponse {
    success: boolean;
    data: IQuiz;
}

export interface QuizAttempt {
    attemptId: string;
    quizId?: string;
    quizName: string;
    score: number;
    totalMarks: number;
    percentage: number;
    status: "pass" | "fail" | "retake_suggested";
    submittedAt: string;
}

export interface QuizAttemptsResponse {
    success: boolean;
    message: string;
    meta: unknown;
    data: {
        totalQuizzesAttempted: number;
        totalScore: number;
        totalPassed: number;
        total_Retake_Suggested: number;
        totalFailed: number;
        attempts: QuizAttempt[];
        averagePercentage: number;
    };
}

export interface IQuizResult {
    quizName: string;
    quizId: string;
    moduleId: string;
    attemptId: string;
    score: number;
    totalMarks: number;
    percentage: number;
    progressStatus: string;
    timeTaken: number;
    status: "pass" | "retake_suggested" | "must_retake" | "fail";
    passingPercentage: number;
    message: string;
}

export interface IDetailedResult {
    questionId: string;
    selectedOption?: string;
    selectedOptions?: string[];
    isCorrect: boolean;
    correctOption?: string;
    correctOptions?: string[];
}

export interface IQuizDetailedResult {
    quizName: string;
    quizId?: string;
    attemptId?: string;
    score: number;
    totalMarks: number;
    percentage: number;
    passingPercentage: number;
    status: string;
    timeTaken: number;
    submittedAt: string;
    detailedResults: IDetailedResult[];
}

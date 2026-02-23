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
    title: string;
    description: string;
    questions: IQuestion[];
    durationInMinutes?: number;
}

export interface IQuizApiResponse {
    success: boolean;
    data: IQuiz;
}

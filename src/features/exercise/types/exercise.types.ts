// d:/Iftykhar/dwiseguy/dwiseguy-website/src/features/exercise/types/exercise.types.ts

export interface IMedia {
    url: string;
    public_id: string;
}

export interface IExerciseContent {
    _id: string;
    title: string;
    description: string;
    exerciseId: string;
    keyNotes: string[];
    image: IMedia | null;
    audio: IMedia | null;
    isActive: boolean;
}

export interface IExercise {
    _id: string;
    title: string;
    description: string;
    images: IMedia | null;
    ExerciseContent: IExerciseContent[];
    isActive: boolean;
}

export interface IExerciseApiResponse<T> {
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    } | null;
    data: T;
}

export type AllExercisesResponse = IExerciseApiResponse<IExercise[]>;
export type SingleExerciseResponse = IExerciseApiResponse<IExercise>;
export type SingleExerciseContentResponse = IExerciseApiResponse<IExerciseContent>;

// Placeholder types for submission (if endpoint is clarified later)
export interface IExerciseSubmission {
    exerciseId: string;
    // details of the submission (e.g., notes played, score, etc.)
}

export interface ISubmissionResponse {
    success: boolean;
    message: string;
    data: unknown;
}

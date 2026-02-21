// src/features/lesson/types/lesson.types.ts

export interface LessonImage {
    url: string;
    public_id: string;
    _id: string;
}

export interface LessonAudio {
    url: string;
    public_id: string;
}

export interface LessonMedia {
    audio: LessonAudio | null;
    images: LessonImage[];
}

export interface LessonData {
    media: LessonMedia;
    _id: string;
    moduleId: string;
    title: string;
    content: string;
    isExercise: boolean;
    order: number;
    exerciseIds: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface SingleLessonApiResponse {
    success: boolean;
    message: string;
    meta: null;
    data: LessonData;
}

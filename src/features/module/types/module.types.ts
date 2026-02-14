// src/features/module/types/module.types.ts

export interface LessonMedia {
    audio: string | null;
    images: string[];
}

export interface Lesson {
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
    isCompleted?: boolean;
    isUnlocked?: boolean;
    media: LessonMedia;
}

export interface ModuleImage {
    url: string;
    public_id: string;
    _id: string;
}

export interface Module {
    _id: string;
    instrumentId: string;
    title: string;
    description: string;
    order: number;
    images: ModuleImage[];
    lessons: Lesson[] | string[];
    quizIds: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Meta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface ModuleApiResponse {
    success: boolean;
    message: string;
    meta: Meta | null;
    data: Module[];
}

export interface SingleModuleApiResponse {
    success: boolean;
    message: string;
    meta: Meta | null;
    data: Module;
}

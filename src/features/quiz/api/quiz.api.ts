// src/features/quiz/api/quiz.api.ts

import { api } from "@/lib/api";
import { QuizSubmit } from "../types/quize";

// GET method /quiz/student/:id  (with bearer token)

export const getStudentQuiz = async (id: string, accessToken: string) => {
    const response = await api.get(`/quiz/student/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};


//  POST method /quiz/student/submit (with bearer token)

export const submitStudentQuiz = async (payload: QuizSubmit, accessToken: string) => {
    const response = await api.post(`/quiz/student/submit`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

//  GET method /quiz/student/result/:id (with bearer token)

export const getStudentQuizResult = async (id: string, accessToken: string) => {
    const response = await api.get(`/quiz/student/result/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};


// GET method /quiz/student/detailed-result/:id (with bearer token)

export const getStudentQuizDetailedResult = async (id: string, accessToken: string) => {
    const response = await api.get(`/quiz/student/detailed-result/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};


// GET method /quiz/student/check-attempt/:id (with bearer token and the id of the quiz)

export const getStudentQuizCheckAttempt = async (id: string, accessToken: string) => {
    const response = await api.get(`/quiz/student/check-attempt/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

// GET method /quiz/student/attempt/:id (with bearer token and the id of the quiz)

export const getStudentQuizAttempt = async (id: string, accessToken: string) => {
    const response = await api.get(`/quiz/student/attempt/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

// GET method /quiz/student/my-attempts (with bearer token)

export const getStudentQuizMyAttempts = async (accessToken: string) => {
    const response = await api.get(`/quiz/student/my-attempts`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};


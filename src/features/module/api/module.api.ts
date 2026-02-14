// src/features/module/api/module.api.ts

import { api } from "@/lib/api";
import { ModuleApiResponse, SingleModuleApiResponse } from "../types/module.types";


// get all modules 
export const getallmodules = {
    async getModulesByInstrumentId(instrumentId: string, accessToken: string): Promise<ModuleApiResponse> {
        const response = await api.get(`/module/get-modules/${instrumentId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    },
};


// get single module /module/get-single-module/{{moduleId}}

export const getsinglemodule = {
    async getSingleModule(moduleId: string, accessToken: string): Promise<SingleModuleApiResponse> {
        const response = await api.get(`/module/get-single-module/${moduleId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    },
};
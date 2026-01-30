// featrues/academy/api/instrument.api.ts
import { api } from "@/lib/api";
import { InstrumentResponse } from "../types/instrument.types";

export const getAllInstrument = async (): Promise<InstrumentResponse> => {
    try {
        const response = await api.get("/instrument/get-all-instruments?page=1&limit=3");
        return response.data;
    } catch (error) {
        throw error;
    }
};


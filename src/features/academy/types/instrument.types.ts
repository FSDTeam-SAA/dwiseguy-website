// features/academy/types/instrument.types.ts

export interface InstrumentImage {
    public_id: string;
    url: string;
}

export interface Instrument {
    _id: string;
    instrumentTitle: string;
    instrumentDescription: string;
    level: string;
    instrumentImage: InstrumentImage;
    modules: string[];
    isActive: boolean;
    accountStatus: string;
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

export interface InstrumentData {
    meta: Meta;
    instruments: Instrument[];
}

export interface InstrumentResponse {
    success: boolean;
    message: string;
    meta: Meta | null;
    data: InstrumentData;
}

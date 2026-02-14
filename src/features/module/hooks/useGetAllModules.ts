// src/features/module/hooks/useGetAllModules.ts

import { useQuery } from "@tanstack/react-query";
import { getallmodules } from "../api/module.api";
import { ModuleApiResponse } from "../types/module.types";

export const useGetAllModules = (instrumentId: string, accessToken: string) => {
    return useQuery<ModuleApiResponse>({
        queryKey: ["modules", instrumentId],
        queryFn: () => getallmodules.getModulesByInstrumentId(instrumentId, accessToken),
        enabled: !!instrumentId && !!accessToken,
    });
};
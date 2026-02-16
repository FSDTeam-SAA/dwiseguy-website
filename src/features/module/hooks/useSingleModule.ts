// src/features/module/hooks/useSingleModule.ts

import { useQuery } from "@tanstack/react-query";
import { getsinglemodule } from "../api/module.api";
import { SingleModuleApiResponse } from "../types/module.types";

export const useSingleModule = (moduleId: string, accessToken: string) => {
    return useQuery<SingleModuleApiResponse>({
        queryKey: ["module", moduleId],
        queryFn: () => getsinglemodule.getSingleModule(moduleId, accessToken),
        enabled: !!moduleId && !!accessToken,
    });
};
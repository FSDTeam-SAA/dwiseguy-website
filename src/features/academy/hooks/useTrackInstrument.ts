// src/features/academy/hooks/useTrackInstrument.ts

import { useMutation } from "@tanstack/react-query";
import { trackingApi } from "../api/tracking.api";

export const useTrackInstrument = () => {
    return useMutation({
        mutationFn: (payload: { payload: { instrumentId: string; userId: string }; accessToken: string }) =>
            trackingApi.trackProgress(payload.payload, payload.accessToken),
    });
};
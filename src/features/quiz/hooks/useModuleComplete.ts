// src/features/quiz/hooks/useModuleComplete.ts

import { useMutation } from "@tanstack/react-query";
import { completeModule } from "../api/quiz.api";
import { useSession } from "next-auth/react";

export const useModuleComplete = () => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useMutation({
        mutationFn: (payload: { moduleId: string }) => completeModule(payload, token || ""),
    });
};
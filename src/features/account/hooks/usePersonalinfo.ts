// features/account/hooks/usePersonalinfo.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updatePersonalInfo } from "../api/personalinfo.api";
import { toast } from "sonner"; // Or your preferred toast library
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";

export const useUpdatePersonalInfo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ formData, accessToken }: { formData: FormData; accessToken: string }) =>
            updatePersonalInfo(formData, accessToken),
        onSuccess: () => {
            toast.success("Profile updated successfully");
            // Invalidate user query to refresh data across the app
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    });
};

export const useGetUserProfile = () => {
    const { data: session } = useSession();
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: () => getUserProfile(session?.accessToken || ""),
        enabled: !!session?.accessToken,
    });
};

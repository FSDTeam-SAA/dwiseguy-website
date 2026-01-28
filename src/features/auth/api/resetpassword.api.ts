// features/auth/api/resetpassword.api.ts
import { api } from "@/lib/api";

export const resetPassword = async (data: { email: string; newPassword: string }, token: string) => {
    console.log("=== resetPassword API ===");
    console.log("Data to send:", data);
    console.log("Token to send:", token);
    console.log("Authorization header:", `Bearer ${token}`);

    try {
        const res = await api.post('/auth/reset-password', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("API response:", res.data);
        return res.data;
    } catch (error) {
        console.error("API error:", error);
        throw error;
    }
};

export const changePassword = async (data: { userId: string; oldPassword: string; newPassword: string }, accessToken: string) => {
    try {
        const res = await api.post('/auth/change-password', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

// features/account/api/orderlist.api.ts
import { api } from "@/lib/api";

export const getOrderList = async (userId: string, data: { pageCount: number; deliveryType: string }, accessToken: string) => {
    const response = await api.get(`/order/user/${userId}`, {
        params: data,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

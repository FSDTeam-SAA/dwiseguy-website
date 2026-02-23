// features/account/hooks/useOrderlist.ts
import { useQuery } from "@tanstack/react-query";
import { getOrderList } from "../api/orderlist.api";
import { useSession } from "next-auth/react";

export const useOrderList = (userId: string, pageCount: number = 15, deliveryType: string = "print&digital") => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["orders", userId, pageCount, deliveryType, token],
    queryFn: () => getOrderList(userId, { pageCount, deliveryType }, token || ""),
    enabled: !!userId && !!token,
  });
};

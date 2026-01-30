// features/academy/hooks/useGetAllInstrument.ts
import { useQuery } from "@tanstack/react-query";
import { getAllInstrument } from "../api/instrument.api";

export const useGetAllInstrument = () => {
    return useQuery({
        queryKey: ["all-instruments"],
        queryFn: getAllInstrument,
    });
};
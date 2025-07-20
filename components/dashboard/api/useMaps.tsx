"use client"

import { useQuery } from "@tanstack/react-query"
import { getMaps } from "../actions/map.actions"

export const useGetMaps = () => {
    return useQuery({
        queryKey: ["maps"],
        queryFn: () => getMaps(),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}
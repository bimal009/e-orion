"use client"

import { useQuery } from "@tanstack/react-query"
import { getMapById, getMaps } from "../actions/map.actions"

export const useGetMaps = () => {
    return useQuery({
        queryKey: ["maps"],
        queryFn: () => getMaps(),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}


export const useGetMapById = (id:string) => {
    return useQuery({
        queryKey: ["maps", id],
        queryFn: () => getMapById(id),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}


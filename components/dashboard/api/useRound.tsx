"use client"

import { RoundCreateInput } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
  import { createRound, deleteRound, getRounds, getRoundsWithSearch, updateRound } from "../actions/round.action"


export const UseGetRounds = () => {
    return useQuery({
        queryKey: ["rounds"],
        queryFn: getRounds,
    })
}
export const UseGetRoundsBySearch = (search: string) => {
  return useQuery({
      queryKey: ["rounds", search],
      queryFn: () => getRoundsWithSearch(search),
  })
}

export const useCreateRounds = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: (data: RoundCreateInput) => createRound(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["rounds"] })
      },
      onError: (error: any) => {
        console.error("Error creating tournament:", error)
      },
    })
  }


  export const useUpdateRounds = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
          mutationFn: (data: RoundCreateInput) => updateRound(data.id || "", data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["rounds"] })
      },
      onError: (error: any) => {
        console.error("Error creating tournament:", error)
      },
    })
  }

export const useDeleteRound = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (roundId: string) => deleteRound(roundId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rounds"] })
            toast.success("Tournament deleted successfully")
        },
        onError: () => {
            toast.error("Failed to delete tournament")
        }
    })
}
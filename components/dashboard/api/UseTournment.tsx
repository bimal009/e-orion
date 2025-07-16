"use client"

import { Tournament, TournamentCreateInput } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTournment, deleteTournament, getTournaments, getTournamentsWithSearch, updateTournment } from "../actions/dashboard.action"
import { toast } from "sonner"


export const UseGetTournments = () => {
    return useQuery({
        queryKey: ["tournments"],
        queryFn: getTournaments,
    })
}
export const UseGetTournmentsBySearch = (search: string) => {
  return useQuery({
      queryKey: ["tournments", search],
      queryFn: () => getTournamentsWithSearch(search),
  })
}

export const useCreateTournaments = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: (data: TournamentCreateInput) => createTournment(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tournments"] })
      },
      onError: (error: any) => {
        console.error("Error creating tournament:", error)
      },
    })
  }


  export const useUpdateTournaments = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: (data: Tournament) => updateTournment(data.id || "", data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tournments"] })
      },
      onError: (error: any) => {
        console.error("Error creating tournament:", error)
      },
    })
  }

export const useDeleteTournment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (TournmentId: string) => deleteTournament(TournmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tournments"] })
            toast.success("Tournament deleted successfully")
        },
        onError: () => {
            toast.error("Failed to delete tournament")
        }
    })
}
"use client"

import { Tournament } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTournment, deleteTournament, getTournaments } from "../actions/dashboard.action"
import { toast } from "sonner"


export const UseGetTournments = () => {
    return useQuery({
        queryKey: ["tournments"],
        queryFn: getTournaments,
    })
}

export const useCreateTournaments = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: (data: Tournament) => createTournment(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tournments"] })
      },
      onError: (error) => {
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
"use client"

import { GameCreateInput } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createGame, deleteGame, getGames, updateGame } from "../actions/games.actions"

export const useGetGames = (tournamentId: string,roundId:string) => {
    return useQuery({
        queryKey: ["games", tournamentId,roundId],
        queryFn: () => getGames(tournamentId,roundId),
        enabled: !!tournamentId && !!roundId,
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}


export const useCreateGame = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: GameCreateInput) => createGame(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["games"] })
            queryClient.invalidateQueries({ queryKey: ["tournaments"] })
            queryClient.invalidateQueries({ queryKey: ["teams"] })
            queryClient.invalidateQueries({ queryKey: ["matches"] })
            queryClient.invalidateQueries({ queryKey: ["groups"] })
        },
        onError: (error: any) => {
            console.error("Error creating group:", error)
            toast.error("Failed to create group")
        },
    })
}

export const useUpdateGame = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: GameCreateInput) => updateGame(data.id || "", data),
        onSuccess: (updatedGame, variables) => {
            queryClient.invalidateQueries({ queryKey: ["games"] })
            queryClient.invalidateQueries({ queryKey: ["tournaments"] })
            queryClient.invalidateQueries({ queryKey: ["teams"] })
            queryClient.invalidateQueries({ queryKey: ["matches"] })
            queryClient.invalidateQueries({ queryKey: ["groups"] })
        },
        onError: (error: any) => {
            console.error("Error updating game:", error)
            toast.error("Failed to update game")
        },
    })
}

export const useDeleteGame = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (gameId: string) => deleteGame(gameId),
        onSuccess: (_, gameId) => {
            queryClient.invalidateQueries({ queryKey: ["games"] })
            queryClient.invalidateQueries({ queryKey: ["tournaments"] })
            queryClient.invalidateQueries({ queryKey: ["teams"] })
            queryClient.invalidateQueries({ queryKey: ["matches"] })    
            queryClient.invalidateQueries({ queryKey: ["groups"] }) 
            toast.success("Game deleted successfully")
        },
        onError: (error: any) => {
            console.error("Error deleting game:", error)
            toast.error("Failed to delete game")
        }
    })
}

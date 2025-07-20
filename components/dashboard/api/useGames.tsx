"use client"

import { GameCreateInput, GroupCreateInput, RoundCreateInput } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createRound, deleteRound, getRounds, getRoundsWithSearch, updateRound } from "../actions/round.action"
import { createGroup, updateGroup, getGroups, getGroupsWithSearch, getGroupById, deleteGroup, getGroupsByRoundId } from "../actions/group.actions"
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

export const useGetRoundsBySearch = (tournamentId: string, search: string) => {
    return useQuery({
        queryKey: ["rounds", "search", tournamentId, search],
        queryFn: () => getRoundsWithSearch(tournamentId, search),
        enabled: !!tournamentId && !!search,
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}

export const useGetGroups = (tournamentId: string) => {
    return useQuery({
        queryKey: ["groups", tournamentId],
        queryFn: () => getGroups(tournamentId),
        enabled: !!tournamentId,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}

export const useGetGroupsByRoundId = (tournamentId: string, roundId: string) => {

    return useQuery({
        queryKey: ["groups", "round", tournamentId, roundId],
        queryFn: () => getGroupsByRoundId(tournamentId, roundId),
        enabled: !!tournamentId && !!roundId,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}

export const useGetGroupsBySearch = (tournamentId: string, search: string) => {
    return useQuery({
        queryKey: ["groups", "search", tournamentId, search],
        queryFn: () => getGroupsWithSearch(tournamentId, search),
        enabled: !!tournamentId && !!search,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}

export const useGetGroupById = (id: string) => {
    return useQuery({
        queryKey: ["group", id],
        queryFn: () => getGroupById(id),
        enabled: !!id,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}

export const useCreateGame = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: GameCreateInput) => createGame(data),
        onSuccess: (newGame, variables) => {
            queryClient.invalidateQueries({ queryKey: ["games"] })
            queryClient.invalidateQueries({ queryKey: ["tournaments"] })
            queryClient.invalidateQueries({ queryKey: ["teams"] })
            queryClient.invalidateQueries({ queryKey: ["matches"] })
            queryClient.setQueryData(
                ["games", variables.tournamentId, variables.roundId,variables.mapId],
                (oldData: any[] | undefined) => {
                    if (oldData) {
                        return [...oldData, newGame]
                    }
                    return [newGame]
                }
            )
        },
        onError: (error: any) => {
            console.error("Error creating game:", error)
            toast.error("Failed to create game")
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
            queryClient.setQueryData(
                    ["games", variables.tournamentId, variables.roundId],
                (oldData: any[] | undefined) => {
                    if (oldData) {
                        return oldData.map((game: any) =>
                            game.id === updatedGame.id ? updatedGame : game
                        )
                    }
                    return oldData
                }
            )
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
            toast.success("Game deleted successfully")
        },
        onError: (error: any) => {
            console.error("Error deleting game:", error)
            toast.error("Failed to delete game")
        }
    })
}

export const useDeleteRound = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (roundId: string) => deleteRound(roundId),
        onSuccess: (_, roundId) => {
            // Invalidate all related queries
            queryClient.invalidateQueries({ queryKey: ["rounds"] })
            queryClient.invalidateQueries({ queryKey: ["tournaments"] })
            queryClient.invalidateQueries({ queryKey: ["teams"] })
            
            toast.success("Round deleted successfully")
        },
        onError: (error: any) => {
            console.error("Error deleting round:", error)
            toast.error("Failed to delete round")
        }
    })
}
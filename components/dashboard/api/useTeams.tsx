"use client"

import { TeamCreateInput } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createTeam, deleteTeam, getTeams, getTeamsWithSearch, updateTeam, getTeamById, getTeamsWithPagination } from "../actions/team.action"

export const useGetTeams = (tournamentId: string) => {
    return useQuery({
        queryKey: ["teams", tournamentId],
        queryFn: () => getTeams(tournamentId),
        enabled: !!tournamentId,
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}

export const useGetTeamsBySearch = (tournamentId: string, search: string) => {
    return useQuery({
        queryKey: ["teams", "search", tournamentId, search],
        queryFn: () => getTeamsWithSearch(tournamentId, search),
        enabled: !!tournamentId && !!search,
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}

export const useCreateTeam = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
        mutationFn: (data: TeamCreateInput) => createTeam(data),
        onSuccess: (newTeam, variables) => {
            // Invalidate all team-related queries
            queryClient.invalidateQueries({ queryKey: ["teams"] })
            queryClient.invalidateQueries({ queryKey: ["tournaments"] })
            queryClient.invalidateQueries({ queryKey: ["rounds"] })
            
            // Optimistically update the cache
            queryClient.setQueryData(
                ["teams", variables.tournamentId],
                (oldData: any[] | undefined) => {
                    if (oldData) {
                        return [...oldData, newTeam]
                    }
                    return [newTeam]
                }
            )
            
            toast.success("Team created successfully")
        },
        onError: (error: any) => {
            console.error("Error creating team:", error)
            toast.error("Failed to create team")
        },
    })
}

export const useUpdateTeam = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
        mutationFn: (data: TeamCreateInput) => updateTeam(data.id || "", data),
        onSuccess: (updatedTeam, variables) => {
            // Invalidate all related queries
            queryClient.invalidateQueries({ queryKey: ["teams"] })
            queryClient.invalidateQueries({ queryKey: ["tournaments"] })
            queryClient.invalidateQueries({ queryKey: ["rounds"] })
            
            queryClient.invalidateQueries({ queryKey: ["groups"] })
            queryClient.invalidateQueries({ queryKey: ["group"] })
            // Optimistically update the cache
            queryClient.setQueryData(
                ["teams", variables.tournamentId],
                (oldData: any[] | undefined) => {
                    if (oldData) {
                        return oldData.map((team: any) => 
                            team.id === updatedTeam.id ? updatedTeam : team
                        )
                    }
                    return oldData
                }
            )
            
            // Update individual team cache
            queryClient.setQueryData(
                ["team", updatedTeam.id],
                updatedTeam
            )
            
            toast.success("Team updated successfully")
        },
        onError: (error: any) => {
            console.error("Error updating team:", error)
            toast.error("Failed to update team")
        },
    })
}

export const useDeleteTeam = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (teamId: string) => deleteTeam(teamId),
        onSuccess: (_, teamId) => {
            // Invalidate all related queries
            queryClient.invalidateQueries({ queryKey: ["teams"] })
            queryClient.invalidateQueries({ queryKey: ["tournaments"] })
            queryClient.invalidateQueries({ queryKey: ["rounds"] })
            queryClient.removeQueries({ queryKey: ["team", teamId] })
            toast.success("Team deleted successfully")
        },
        onError: (error: any) => {
            console.error("Error deleting team:", error)
            toast.error("Failed to delete team")
        }
    })
}

export const useGetTeamById = (id: string) => {
    return useQuery({
        queryKey: ["team", id],
        queryFn: () => getTeamById(id),
        enabled: !!id,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}

export const useGetTeamsWithPagination = (tournamentId: string, page: number, limit: number) => {
    return useQuery({
        queryKey: ["teams", tournamentId, page, limit],
        queryFn: () => getTeamsWithPagination(tournamentId, page, limit),
        enabled: !!tournamentId && !!page && !!limit,
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    })
}
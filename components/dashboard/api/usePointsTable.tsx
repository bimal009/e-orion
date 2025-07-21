"use client"

import { PointTableCreateInput } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createPointTable,
  getPointsTable,
  updatePointTable,
  deletePointTable,
} from "../actions/pointTable.action"

// Fetch all points tables for a tournament
export const useGetPointsTable = (tournamentId: string) => {
  return useQuery({
    queryKey: ["pointsTable", tournamentId],
    queryFn: () => getPointsTable(tournamentId),
    enabled: !!tournamentId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

// Create a new points table (with many ranks)
export const useCreatePointTable = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PointTableCreateInput) => createPointTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pointsTable"] })
      toast.success("Points table created successfully")
    },
    onError: (error: any) => {
      console.error("Error creating points table:", error)
      toast.error("Failed to create points table")
    },
  })
}

// Update a points table
export const useUpdatePointTable = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PointTableCreateInput & { id: string }) => updatePointTable(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pointsTable"] })
      toast.success("Points table updated successfully")
    },
    onError: (error: any) => {
      console.error("Error updating points table:", error)
      toast.error("Failed to update points table")
    },
  })
}

// Delete a points table
export const useDeletePointTable = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePointTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pointsTable"] })
      toast.success("Points table deleted successfully")
    },
    onError: (error: any) => {
      console.error("Error deleting points table:", error)
      toast.error("Failed to delete points table")
    },
  })
}

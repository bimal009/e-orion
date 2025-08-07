"use client";

import { Tournament, TournamentCreateInput } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTournment,
  deleteTournament,
  getTournaments,
  getTournamentsWithSearch,
  updateTournment,
} from "../actions/dashboard.action";
import { toast } from "sonner";

export const useGetTournaments = () => {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournaments,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetTournamentsBySearch = (search: string) => {
  return useQuery({
    queryKey: ["tournaments", "search", search],
    queryFn: () => getTournamentsWithSearch(search),
    enabled: !!search && search.trim().length > 0,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TournamentCreateInput) => createTournment(data),
    onSuccess: (newTournament) => {
      // Invalidate all tournament-related queries
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });

      // Optimistically update the cache
      queryClient.setQueryData(
        ["tournaments"],
        (oldData: Tournament[] | undefined) => {
          if (oldData) {
            return [...oldData, newTournament];
          }
          return [newTournament];
        }
      );
    },
    onError: (error: any) => {
      console.error("Error creating tournament:", error);
    },
  });
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Tournament) => updateTournment(data.id || "", data),
    onSuccess: (updatedTournament) => {
      // Invalidate all tournament-related queries
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });

      // Optimistically update the cache
      queryClient.setQueryData(
        ["tournaments"],
        (oldData: Tournament[] | undefined) => {
          if (oldData) {
            return oldData.map((tournament: Tournament) =>
              tournament.id === updatedTournament.id
                ? updatedTournament
                : tournament
            );
          }
          return oldData;
        }
      );

      toast.success("Tournament updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating tournament:", error);
      toast.error("Failed to update tournament");
    },
  });
};

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tournamentId: string) => deleteTournament(tournamentId),
    onSuccess: (_, tournamentId) => {
      // Invalidate all tournament-related queries
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });

      // Also invalidate related data
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["rounds"] });

      // Remove from cache optimistically
      queryClient.setQueryData(
        ["tournaments"],
        (oldData: Tournament[] | undefined) => {
          if (oldData) {
            return oldData.filter(
              (tournament: Tournament) => tournament.id !== tournamentId
            );
          }
          return oldData;
        }
      );

      toast.success("Tournament deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting tournament:", error);
      toast.error("Failed to delete tournament");
    },
  });
};

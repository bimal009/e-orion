"use client";

import { RoundCreateInput } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createRound,
  deleteRound,
  getRounds,
  getRoundsWithSearch,
  updateRound,
} from "../actions/round.action";

export const useGetRounds = (tournamentId: string) => {
  return useQuery({
    queryKey: ["rounds", tournamentId],
    queryFn: () => getRounds(tournamentId),
    enabled: !!tournamentId,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetRoundsBySearch = (tournamentId: string, search: string) => {
  return useQuery({
    queryKey: ["rounds", "search", tournamentId, search],
    queryFn: () => getRoundsWithSearch(tournamentId, search),
    enabled: !!tournamentId && !!search,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useCreateRound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoundCreateInput) => createRound(data),
    onSuccess: (newRound, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });

      // Optimistically update the cache
      queryClient.setQueryData(
        ["rounds", variables.tournamentId],
        (oldData: any[] | undefined) => {
          if (oldData) {
            return [...oldData, newRound];
          }
          return [newRound];
        }
      );

      toast.success("Round created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating round:", error);
      toast.error("Failed to create round");
    },
  });
};

export const useUpdateRound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoundCreateInput) => updateRound(data.id || "", data),
    onSuccess: (updatedRound, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });

      // Optimistically update the cache
      queryClient.setQueryData(
        ["rounds", variables.tournamentId],
        (oldData: any[] | undefined) => {
          if (oldData) {
            return oldData.map((round: any) =>
              round.id === updatedRound.id ? updatedRound : round
            );
          }
          return oldData;
        }
      );

      toast.success("Round updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating round:", error);
      toast.error("Failed to update round");
    },
  });
};

export const useDeleteRound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roundId: string) => {
      return deleteRound(roundId);
    },
    onSuccess: (_, roundId) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });

      toast.success("Round deleted successfully");
    },
    onError: (error: any) => {
      console.error("useDeleteRound: Error deleting round:", error);
      toast.error("Failed to delete round");
    },
  });
};

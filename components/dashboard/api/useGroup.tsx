"use client";

import { GroupCreateInput, RoundCreateInput } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createRound,
  deleteRound,
  getRounds,
  getRoundsWithSearch,
  updateRound,
} from "../actions/round.action";
import {
  createGroup,
  updateGroup,
  getGroups,
  getGroupsWithSearch,
  getGroupById,
  deleteGroup,
  getGroupsByRoundId,
  getGroupsByGameId,
} from "../actions/group.actions";

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

export const useGetGroups = (tournamentId: string) => {
  return useQuery({
    queryKey: ["groups", tournamentId],
    queryFn: () => getGroups(tournamentId),
    enabled: !!tournamentId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetGroupsByRoundId = (roundId: string) => {
  return useQuery({
    queryKey: ["groups", "round", roundId],
    queryFn: () => getGroupsByRoundId(roundId),
    enabled: !!roundId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetGroupsByGameId = (gameId: string) => {
  return useQuery({
    queryKey: ["groups", "game", gameId],
    queryFn: () => getGroupsByGameId(gameId),
    enabled: !!gameId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetGroupsBySearch = (tournamentId: string, search: string) => {
  return useQuery({
    queryKey: ["groups", "search", tournamentId, search],
    queryFn: () => getGroupsWithSearch(tournamentId, search),
    enabled: !!tournamentId && !!search,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetGroupById = (id: string) => {
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => getGroupById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GroupCreateInput) => createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
    onError: (error: any) => {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GroupCreateInput) => updateGroup(data.id || "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
    onError: (error: any) => {
      console.error("Error updating group:", error);
      toast.error("Failed to update group");
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => deleteGroup(groupId),
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success("Group deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
    },
  });
};

export const useDeleteRound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roundId: string) => deleteRound(roundId),
    onSuccess: (_, roundId) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });

      toast.success("Round deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting round:", error);
      toast.error("Failed to delete round");
    },
  });
};

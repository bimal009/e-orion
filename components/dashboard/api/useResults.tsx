import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getResults,
  updatePlayerElimination,
  updatePlayerKills,
} from "../actions/results.action";

export const useGetResults = (gameId: string) => {
  return useQuery({
    queryKey: ["results", gameId],
    queryFn: () => getResults(gameId),
    enabled: !!gameId,
    staleTime: 30 * 1000, // Increased since we have real-time updates
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30 * 1000, // Reduced frequency since real-time handles updates
  });
};

export const useUpdateKills = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gameId,
      teamId,
      playerId,
      kills,
    }: {
      gameId: string;
      teamId: string;
      playerId: string;
      kills: number;
    }) => updatePlayerKills(gameId, teamId, playerId, kills),
    onError: (error) => {
      console.error("Error updating player kills:", error);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the results query
      queryClient.invalidateQueries({
        queryKey: ["results", variables.gameId],
      });
    },
  });
};

export const useEliminatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gameId,
      teamId,
      playerId,
    }: {
      gameId: string;
      teamId: string;
      playerId: string;
    }) => updatePlayerElimination(gameId, teamId, playerId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["results", variables.gameId],
      });
    },
  });
};

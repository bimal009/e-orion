"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useGetResults } from "../dashboard/api/useResults";
import Image from "next/image";
import usePusher from "@/lib/hooks/usePusher";

interface Team {
  id: string;
  name: string;
  teamTag: string;
  logo: string;
  status: "eliminated" | "active";
  points: number;
  kills: number;
  placement: number;
  rank: number;
}

interface TeamStatsCardProps {
  gameId?: string | null;
}

const TeamStatsCard: React.FC<TeamStatsCardProps> = ({ gameId }) => {
  const { data: results, isLoading, error } = useGetResults(gameId || "");
  const { pusherClient, isConnected } = usePusher();
  const [realtimeResults, setRealtimeResults] = useState<any[]>([]);
  const [pusherError, setPusherError] = useState<string | null>(null);
  const [hasRealtimeData, setHasRealtimeData] = useState(false);

  // Initialize realtime results from API data
  useEffect(() => {
    if (results && !hasRealtimeData) {
      setRealtimeResults(results);
    }
  }, [results, hasRealtimeData]);

  // Handle player kills updates
  const handlePlayerKillsUpdate = useCallback(
    (data: any) => {
      if (data.gameId === gameId) {
        setRealtimeResults((prev) => {
          const updatedResults = [...prev];
          const teamIndex = updatedResults.findIndex(
            (r) => r.team.id === data.teamId
          );

          if (teamIndex !== -1) {
            updatedResults[teamIndex] = {
              ...updatedResults[teamIndex],
              totalKills: data.kills,
            };
            setHasRealtimeData(true);
          }

          return updatedResults;
        });
      }
    },
    [gameId]
  );

  // Handle player elimination updates
  const handlePlayerEliminationUpdate = useCallback(
    (data: any) => {
      if (data.gameId === gameId) {
        setRealtimeResults((prev) => {
          const updatedResults = [...prev];
          const teamIndex = updatedResults.findIndex(
            (r) => r.team.id === data.teamId
          );

          if (teamIndex !== -1) {
            updatedResults[teamIndex] = {
              ...updatedResults[teamIndex],
              ...data.result,
            };
          } else {
            updatedResults.push(data.result);
          }

          return updatedResults;
        });
      }
    },
    [gameId]
  );

  // Handle subscription errors
  const handleSubscriptionError = useCallback((error: any) => {
    setPusherError("Failed to subscribe to real-time updates");
  }, []);

  // Setup Pusher subscription
  useEffect(() => {
    if (!pusherClient || !gameId || !isConnected) {
      return;
    }

    try {
      const channel = pusherClient.subscribe("pubg-results");

      if (channel) {
        setPusherError(null);

        channel.bind("update-player-kills", handlePlayerKillsUpdate);
        channel.bind(
          "update-player-elimination",
          handlePlayerEliminationUpdate
        );
        channel.bind("pusher:subscription_error", handleSubscriptionError);
      }

      return () => {
        if (channel) {
          channel.unbind("update-player-kills");
          channel.unbind("update-player-elimination");
          channel.unbind("pusher:subscription_error");
          pusherClient.unsubscribe("pubg-results");
        }
      };
    } catch (error) {
      setPusherError("Failed to connect to real-time service");
    }
  }, [
    pusherClient,
    gameId,
    isConnected,
    handlePlayerKillsUpdate,
    handlePlayerEliminationUpdate,
    handleSubscriptionError,
  ]);

  // Process teams data with memoization
  const teams: Team[] = useMemo(() => {
    if (!realtimeResults || realtimeResults.length === 0) return [];

    return realtimeResults
      .filter((result) => result.team.id !== "1")
      .map((result) => ({
        ...result.team,
        status: result.placement > 16 ? "eliminated" : "active",
        points: result.points,
        kills: result.totalKills || 0,
        placement: result.placement,
      }))
      .sort((a, b) => b.points - a.points)
      .map((team, index) => ({
        ...team,
        rank: index + 1,
      }));
  }, [realtimeResults]);

  // Status indicator component
  const StatusIndicator: React.FC<{ status: string; isLeader?: boolean }> = ({
    status,
    isLeader = false,
  }) => {
    const barClass =
      status === "eliminated"
        ? "w-1 h-3 rounded-sm bg-muted-foreground/40"
        : "w-1 h-3 rounded-sm bg-primary";

    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={barClass} />
        ))}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-[280px] bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 text-center text-muted-foreground">
          Loading results...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-[280px] bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 text-center text-red-500">
          Error loading results: {error.message}
        </div>
      </div>
    );
  }

  // Pusher error state
  if (pusherError) {
    return (
      <div className="w-full max-w-[280px] bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 text-center text-yellow-500">
          Real-time updates unavailable: {pusherError}
        </div>
      </div>
    );
  }

  // No results state
  if (!results || results.length === 0) {
    return (
      <div className="w-full max-w-[280px] bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 text-center text-muted-foreground">
          No results found for this game
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[280px] bg-transparent shadow-sm overflow-hidden">
      {/* Header */}
      <div
        style={{
          clipPath: "polygon(5% 0, 100% 0%, 100% 100%, 0% 100%)",
        }}
        className="bg-card px-1.5 py-1 border-b border-border w-52 ml-10"
      >
        <div className="flex items-center justify-between text-[9px] font-semibold text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-12 text-center">TEAMS</div>
            <div className="flex-shrink-0 w-16 text-center">STATUS</div>
            <div className="flex-shrink-0 w-11 text-right">PTS</div>
            <div className="flex-shrink-0 w-10 text-center">ELMS</div>
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-[8px]">{isConnected ? "LIVE" : "OFF"}</span>
          </div>
        </div>
      </div>

      {/* Teams List */}
      <div className="divide-y divide-border/50">
        {teams.map((team) => (
          <div
            style={{
              clipPath: "polygon(5% 0, 100% 0%, 100% 100%, 0% 100%)",
            }}
            key={team.id}
            className={`px-1.5 py-1 flex items-center gap-1.5 text-xs transition-all duration-200 hover:bg-muted/20 bg-card ${
              team.status === "eliminated" ? "opacity-60" : ""
            }`}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-5 ml-1 flex justify-center">
              {team.rank}
            </div>

            {/* Team Info */}
            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border border-border/50 overflow-hidden flex-shrink-0 bg-muted/30">
                <Image
                  width={16}
                  height={16}
                  priority={true}
                  src={team.logo}
                  alt={team.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`truncate font-medium text-[11px] ${
                  team.status === "eliminated"
                    ? "text-muted-foreground"
                    : "text-foreground"
                } ${team.rank === 1 ? "font-semibold" : ""}`}
              >
                {team.teamTag}
              </span>
            </div>

            {/* Status */}
            <div className="flex-shrink-0 w-12 flex justify-center">
              <StatusIndicator
                status={team.status}
                isLeader={team.rank === 1}
              />
            </div>

            {/* Points */}
            <div className="flex-shrink-0 text-right font-bold w-10 text-[11px] text-foreground">
              {team.points.toLocaleString()}
            </div>

            {/* Eliminations */}
            <div className="flex-shrink-0 w-10 text-center font-medium text-foreground text-[11px]">
              {team.kills}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Legend */}
      <div className="bg-card px-1.5 py-1 border-t border-border/50">
        <div className="flex items-center justify-center gap-2 text-[9px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-primary rounded-full" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
            <span>Eliminated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStatsCard;

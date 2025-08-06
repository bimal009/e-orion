"use client";
import React, { useEffect, useState } from "react";
import { Trophy, Users } from "lucide-react";
import { useGetResults } from "../dashboard/api/useResults";
import Image from "next/image";
import usePusher from "@/lib/hooks/usePusher";
const TeamStatsCard = ({ gameId }: { gameId?: string | null }) => {
  const { data: results, isLoading, error } = useGetResults(gameId || "");
  const pusherClient = usePusher();
  const [realtimeResults, setRealtimeResults] = useState<any[]>([]);
  console.log(results, "results");

  useEffect(() => {
    if (results) {
      setRealtimeResults(results);
    }
  }, [results]);

  useEffect(() => {
    if (pusherClient && gameId) {
      const channel = pusherClient.subscribe("pubg-results");
      channel.bind("update-player-kills", (data: any) => {
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
      });

      return () => {
        channel.unbind("update-player-kills");
        pusherClient.unsubscribe("pubg-results");
      };
    }
  }, [pusherClient, gameId]);

  const teams = realtimeResults
    ?.filter((result) => result.team.id !== "1")
    ?.map((result) => ({
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

  if (isLoading) {
    return (
      <div className="w-full max-w-[280px] bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 text-center text-muted-foreground">
          Loading results...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[280px] bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 text-center text-red-500">
          Error loading results: {error.message}
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="w-full max-w-[280px] bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 text-center text-muted-foreground">
          No results found for this game
        </div>
      </div>
    );
  }

  const getStatusIndicator = (status: string, isLeader: boolean = false) => {
    if (status === "eliminated") {
      return (
        <div className="flex gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-3 rounded-sm bg-muted-foreground/40"
            />
          ))}
        </div>
      );
    }

    return (
      <div className="flex gap-0.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-1 h-3 rounded-sm bg-emerald-500" />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[280px] bg-transparent   shadow-sm overflow-hidden">
      <div
        style={{
          clipPath: "polygon(5% 0, 100% 0%, 100% 100%, 0% 100%) ",
        }}
        className="bg-card px-1.5 py-1 border-b border-border w-52 ml-10"
      >
        <div className="flex items-center text-[9px] font-semibold text-muted-foreground">
          <div className="flex-shrink-0 w-12 text-center">TEAMS</div>
          <div className="flex-shrink-0 w-16 text-center">STATUS</div>
          <div className="flex-shrink-0 w-11 text-right">PTS</div>
          <div className="flex-shrink-0 w-10 text-center">ELMS</div>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {teams?.map((team: any, index: number) => (
          <div
            style={{
              clipPath: "polygon(5% 0, 100% 0%, 100% 100%, 0% 100%)",
            }}
            key={team.id}
            className={`px-1.5 py-1 flex items-center gap-1.5 text-xs transition-all duration-200 hover:bg-muted/20 bg-card ${
              team.status === "eliminated" ? "opacity-60" : ""
            }`}
          >
            <div className="flex-shrink-0 w-5 ml-1 flex justify-center">
              {team.rank}
            </div>

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
            <div className="flex-shrink-0 w-12  flex justify-center">
              {getStatusIndicator(team.status, team.rank === 1)}
            </div>

            <div className="flex-shrink-0 text-right font-bold w-10 text-[11px] text-foreground">
              {team.points.toLocaleString()}
            </div>
            {/* ELMS */}
            <div className="flex-shrink-0 w-10 text-center font-medium text-foreground text-[11px]">
              {team.kills}
            </div>

            {/* Points */}
          </div>
        ))}
      </div>

      {/* Compact Footer Legend */}
      <div className="bg-card px-1.5 py-1 border-t border-border/50">
        <div className="flex items-center justify-center gap-2 text-[9px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
            <span>Eliminated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStatsCard;

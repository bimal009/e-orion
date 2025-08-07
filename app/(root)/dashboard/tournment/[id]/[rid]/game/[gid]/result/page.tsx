"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetResults } from "@/components/dashboard/api/useResults";
import usePusher from "@/lib/hooks/usePusher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Users, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerKill {
  id: string;
  kills: number;
  player: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface TeamResult {
  id: string;
  team: {
    id: string;
    name: string;
    logo?: string;
    players: Array<{
      id: string;
      name: string;
      avatar?: string;
      playerKills: PlayerKill[];
    }>;
  };
  totalKills: number;
  placement: number;
  points: number;
  playerKills: PlayerKill[];
}

const ResultPage = () => {
  const params = useParams();
  const gameId = params.gid as string;
  const { data: results, isLoading, refetch } = useGetResults(gameId);
  const { pusherClient } = usePusher();
  const [realtimeResults, setRealtimeResults] = useState<TeamResult[]>([]);

  useEffect(() => {
    if (results) {
      setRealtimeResults(results as unknown as TeamResult[]);
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

            return updatedResults.sort((a, b) => {
              if (a.placement === 0 && b.placement === 0) {
                return b.points - a.points;
              }
              if (a.placement === 0) return -1;
              if (b.placement === 0) return 1;
              return a.placement - b.placement;
            });
          });
        }
      });

      return () => {
        channel.unbind("update-player-kills");
        pusherClient.unsubscribe("pubg-results");
      };
    }
  }, [pusherClient, gameId]);

  const getPlacementBadge = (placement: number) => {
    if (placement === 1)
      return (
        <Badge className="bg-yellow-500">
          <Crown className="w-3 h-3 mr-1" />
          1st
        </Badge>
      );
    if (placement === 2)
      return (
        <Badge className="bg-gray-400">
          <Trophy className="w-3 h-3 mr-1" />
          2nd
        </Badge>
      );
    if (placement === 3)
      return (
        <Badge className="bg-orange-600">
          <Trophy className="w-3 h-3 mr-1" />
          3rd
        </Badge>
      );
    if (placement > 0) return <Badge variant="outline">#{placement}</Badge>;
    return <Badge variant="secondary">In Progress</Badge>;
  };

  const getStatusColor = (placement: number) => {
    if (placement === 1) return "border-yellow-500";
    if (placement === 2) return "border-gray-400";
    if (placement === 3) return "border-orange-600";
    if (placement > 16) return "border-red-500";
    if (placement > 0) return "border-orange-400";
    return "border-green-500";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Match Results</h1>
          <p className="text-muted-foreground">Real-time updates enabled</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      <div className="grid gap-4">
        {realtimeResults
          ?.filter((result) => result.team.id !== "1")
          ?.map((result, index) => (
            <Card
              key={result.team.id}
              className={`transition-all duration-500 ${getStatusColor(
                result.placement
              )}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={result.team.logo}
                        alt={result.team.name}
                      />
                      <AvatarFallback>
                        {result.team.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {result.team.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {getPlacementBadge(result.placement)}
                        <Badge variant="outline" className="text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          {result.totalKills} kills
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {result.points} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{result.points}</div>
                    <div className="text-sm text-muted-foreground">Points</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <Users className="w-4 h-4" />
                    <span>Players</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {result.team.players.map((player) => {
                      const playerKills =
                        player.playerKills?.find(
                          (pk) => pk.player.id === player.id
                        )?.kills || 0;
                      return (
                        <div
                          key={player.id}
                          className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={player.avatar}
                              alt={player.name}
                            />
                            <AvatarFallback className="text-xs">
                              {player.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {player.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {playerKills} kills
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {(!realtimeResults || realtimeResults.length === 0) && (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
            <p className="text-muted-foreground">
              Results will appear here in real-time as the match progresses.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultPage;

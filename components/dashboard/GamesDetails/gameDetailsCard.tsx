"use client";
import React, { useState, useEffect } from "react";
import { Shield, Car, Bomb, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useUpdateKills,
  useGetResults,
  useEliminatePlayer,
} from "../api/useResults";

// Simplified types
interface Player {
  id: string;
  name: string;
  ign: string;
  kills: number;
  isEliminated: boolean;
}

interface Team {
  id: string;
  name: string;
  logo?: string | null;
  teamTag?: string | null;
  players: Player[];
  isEliminated: boolean;
}

const GameDetailsCard = ({ gameId }: { gameId: string }) => {
  const { data: teamData } = useGetResults(gameId);
  const { mutate: updateKills } = useUpdateKills();
  const [teams, setTeams] = useState<Team[]>([]);
  const { mutate: eliminatePlayer } = useEliminatePlayer();

  const [eliminatedTeams, setEliminatedTeams] = useState<string[]>([]);

  useEffect(() => {}, []);

  // Transform data when it loads
  useEffect(() => {
    if (!teamData) return;

    const transformedTeams = teamData.map((pubgResult: any) => {
      // Get team data
      const team = pubgResult.team;

      // Get players from team
      const players =
        team.players
          ?.filter((player: any) => player.isPlaying !== false)
          .map((player: any) => {
            // Find player kills data from the pubgResult.playerKills array
            const playerKillsData = pubgResult.playerKills?.find(
              (pk: any) => pk.player.id === player.id
            );

            return {
              id: player.id,
              name: player.name,
              ign: player.ign,
              kills: playerKillsData?.kills || 0,
              isEliminated: player.isEliminated || false,
            };
          }) || [];

      return {
        id: team.id,
        name: team.name,
        logo: team.logo,
        teamTag: team.teamTag,
        players: players,
        isEliminated: team.isEliminated ?? false,
      };
    });

    setTeams(transformedTeams);
  }, [teamData, gameId]);

  // Update player kills
  const updatePlayerKills = (
    teamId: string,
    playerId: string,
    change: number
  ) => {
    const team = teams.find((t) => t.id === teamId);
    const player = team?.players.find((p) => p.id === playerId);
    if (!player || player.kills + change < 0) {
      return;
    }

    // Update database
    updateKills({
      gameId,
      teamId,
      playerId,
      kills: change,
    });

    // Update local state
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: team.players.map((player) =>
                player.id === playerId
                  ? { ...player, kills: Math.max(0, player.kills + change) }
                  : player
              ),
            }
          : team
      )
    );
  };

  const removePlayer = (teamId: string, playerId: string, gameId: string) => {
    eliminatePlayer({ teamId, playerId, gameId });
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: team.players.map((player) =>
                player.id === playerId
                  ? { ...player, isEliminated: true }
                  : player
              ),
            }
          : team
      )
    );
  };

  const handleTeamEliminated = (teamId: string) => {};

  if (teams.length === 0) {
    return <p className="text-gray-500 text-sm">No teams in this group.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {teams
        .filter(
          (team) =>
            // Filter out teams with no valid players
            team.players.length > 0 &&
            // Filter out teams that are null/undefined
            team.id &&
            team.name
        )
        .map((team) => (
          <Card
            key={team.id}
            className="border rounded-lg shadow-sm hover:shadow-md transition-shadow h-fit"
          >
            {/* Team Header */}
            <div className="flex items-center gap-2 bg-gray-50 border-b px-3 py-2">
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={`${team.name} logo`}
                  className="w-6 h-6 rounded object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                  <Shield className="text-blue-600 w-3 h-3" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900 text-sm truncate">
                    {team.name}
                  </span>
                  {team.teamTag && (
                    <span className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded flex-shrink-0">
                      {team.teamTag}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Players */}
            <div className="p-3 space-y-1.5">
              {team.players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-2 p-2 bg-gray-50 rounded ${
                    player.isEliminated ? "opacity-50" : ""
                  }`}
                >
                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePlayer(team.id, player.id, gameId)}
                    disabled={player.isEliminated}
                    className="w-5 h-5 p-0 text-gray-400 hover:text-red-600 flex-shrink-0"
                  >
                    <X className="w-2.5 h-2.5" />
                  </Button>

                  {/* Player name */}
                  <span className="flex-1 text-xs font-medium text-gray-900 truncate min-w-0">
                    {player.name}
                  </span>

                  {/* Kill counter */}
                  <div className="flex items-center gap-0.5 bg-white rounded border flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePlayerKills(team.id, player.id, -1)}
                      disabled={player.isEliminated}
                      className="w-5 h-5 p-0 text-gray-500 hover:text-gray-700"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </Button>
                    <span className="w-6 text-center text-xs font-bold">
                      {player.kills}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePlayerKills(team.id, player.id, 1)}
                      disabled={player.isEliminated}
                      className="w-5 h-5 p-0 text-gray-500 hover:text-gray-700"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </Button>
                  </div>

                  {/* Action buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={player.isEliminated}
                    className="w-5 h-5 p-0 text-gray-400 hover:text-blue-600 flex-shrink-0"
                  >
                    <Car className="w-2.5 h-2.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={player.isEliminated}
                    className="w-5 h-5 p-0 text-gray-400 hover:text-blue-600 flex-shrink-0"
                  >
                    <Bomb className="w-2.5 h-2.5" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
    </div>
  );
};

export default GameDetailsCard;

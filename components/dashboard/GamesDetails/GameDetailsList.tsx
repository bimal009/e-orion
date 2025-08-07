"use client";
import { Trophy, ArrowLeft } from "lucide-react";
import { Group, Match, Team } from "@/lib/types";
import { useState } from "react";
import SearchButton from "../tournments/SearchButton";
import GameCard from "./gameDetailsCard";
import GameForm from "./GameForm";
import GameButton from "./GameButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/shared/Loader";
import { useGetGamesByGameId } from "../api/useGames";
import { useGetGroupsByGameId, useGetGroupsByRoundId } from "../api/useGroup";
import { useGetMaps } from "../api/useMaps";
import GameDetailsCard from "./gameDetailsCard";

const GameDetailsPage = ({
  tournmentId,
  roundId,
  gameId,
}: {
  tournmentId: string;
  roundId: string;
  gameId: string;
}) => {
  const router = useRouter();
  const { data: game, isPending: isGamePending } = useGetGamesByGameId(gameId);
  const { data: groups, isPending: isGroupsPending } =
    useGetGroupsByGameId(gameId);

  const { data: maps, isPending: isMapsPending } = useGetMaps();
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<"create" | "edit">("create");
  const [editGame, setEditGame] = useState<Match | null>(null);
  const handleEdit = (game: Match) => {
    setEditGame(game);
    setFormType("edit");
    setFormOpen(true);
  };
  const handleCreate = () => {
    setEditGame(null);
    setFormType("create");
    setFormOpen(true);
  };
  const isLoading = isGamePending || isMapsPending;
  if (isLoading) {
    return <FullScreenLoader />;
  }
  if (!game) {
    return <div className="text-center py-12">Game not found.</div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() =>
              router.push(`/dashboard/tournment/${tournmentId}/${roundId}`)
            }
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-sm font-medium bg-background hover:bg-accent cursor-pointer border-border hover:border-primary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/tournment/${tournmentId}/${roundId}/game/${gameId}`
                )
              }
              variant="outline"
              className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-primary text-primary shadow-none rounded-none"
            >
              Teams
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/tournment/${tournmentId}/${roundId}/game/${gameId}/result`
                )
              }
              variant="outline"
              className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-transparent shadow-none rounded-none"
            >
              Result
            </Button>
          </div>
        </div>
      </div>
      <GameForm
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        type={formType}
        initialData={editGame}
        tournmentId={tournmentId}
        roundId={roundId}
      />
      <div className="gap-6">
        <GameDetailsCard gameId={gameId} />
      </div>
    </div>
  );
};

export default GameDetailsPage;

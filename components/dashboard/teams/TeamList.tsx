"use client";
import { Trophy, ArrowLeft } from "lucide-react";
import { Team } from "@/lib/types";
import { useState } from "react";
import { useQueryState } from "nuqs";
import SearchButton from "../tournments/SearchButton";
import TeamCard from "./TeamCard";
import TeamForm from "./TeamForm";
import TeamButton from "./TeamButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetTeams, useGetTeamsBySearch } from "../api/useTeams";
import { FullScreenLoader } from "@/components/shared/Loader";

const TeamList = ({ tournmentId }: { tournmentId: string }) => {
  const [search] = useQueryState("search");
  const router = useRouter();
  const {
    data: allTeams,
    isPending: isPendingAll,
    isFetching: isFetchingAll,
  } = useGetTeams(tournmentId);
  const {
    data: searchResults,
    isPending: isPendingSearch,
    isFetching: isFetchingSearch,
  } = useGetTeamsBySearch(tournmentId, search || "");

  const data = search ? searchResults : allTeams;
  const isPending = search ? isPendingSearch : isPendingAll;
  const isFetching = search ? isFetchingSearch : isFetchingAll;

  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<"create" | "edit">("create");
  const [editTeam, setEditTeam] = useState<Team | null>(null);

  const handleEdit = (team: Team) => {
    setEditTeam(team);
    setFormType("edit");
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditTeam(null);
    setFormType("create");
    setFormOpen(true);
  };

  // Only show full screen loader on initial load, not during search
  if (isPending && !search) {
    return <FullScreenLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="w-full">
        <SearchButton />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-sm font-medium bg-background hover:bg-accent cursor-pointer border-border hover:border-primary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <Button
              onClick={() => router.push(`/dashboard/tournment/${tournmentId}`)}
              variant="outline"
              className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-transparent shadow-none rounded-none  "
            >
              Rounds
            </Button>
            <Button
              onClick={() =>
                router.push(`/dashboard/tournment/${tournmentId}/teams`)
              }
              variant="outline"
              className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-primary text-primary shadow-none rounded-none"
            >
              Teams
            </Button>
            <Button
              onClick={() =>
                router.push(`/dashboard/tournment/${tournmentId}/points-table`)
              }
              variant="outline"
              className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-transparent shadow-none rounded-none"
            >
              Points Table
            </Button>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <TeamButton
            type={formType}
            onClick={handleCreate}
            tournmentId={tournmentId}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-foreground">Teams</span>
          {isFetching && search && (
            <div className="text-sm text-muted-foreground">Searching...</div>
          )}
        </div>
      </div>

      <TeamForm
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        type={formType}
        initialData={editTeam}
        tournmentId={tournmentId}
      />

      {!data || data.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">
            {search ? "No teams found" : "No teams yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {search
              ? "Try adjusting your search terms"
              : "Get started by creating your first team"}
          </p>
          {!search && (
            <TeamButton
              type={formType}
              onClick={handleCreate}
              tournmentId={tournmentId}
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((team: Team) => (
            <TeamCard
              key={team.id?.toString()}
              team={team}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamList;

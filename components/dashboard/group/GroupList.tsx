"use client";
import { Trophy, ArrowLeft } from "lucide-react";
import { Group } from "@/lib/types";
import { useState } from "react";
import { useQueryState } from "nuqs";
import SearchButton from "../tournments/SearchButton";
import GroupCard from "./GroupCard";
import GroupForm from "./GroupForm";
import { useGetGroupsByRoundId, useGetGroupsBySearch } from "../api/useGroup";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import GroupButton from "./GroupButton";
import { FullScreenLoader } from "@/components/shared/Loader";

const GroupList = ({
  tournmentId,
  roundId,
}: {
  tournmentId: string;
  roundId: string;
}) => {
  const [search] = useQueryState("search");
  const router = useRouter();
  const { data, isPending } = useGetGroupsByRoundId(roundId);
  const { data: data2 } = useGetGroupsBySearch(tournmentId, search || "");
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<"create" | "edit">("create");
  const [editGroup, setEditGroup] = useState<Group | null>(null);

  const handleEdit = (group: Group) => {
    setEditGroup(group);
    setFormType("edit");
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditGroup(null);
    setFormType("create");
    setFormOpen(true);
    
  };

  const groups = search ? data2 : data;

  if (isPending) {
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
                router.push(`/dashboard/tournment/${tournmentId}/${roundId}`)
              }
              variant="outline"
              className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-transparent shadow-none rounded-none"
            >
              Games
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/tournment/${tournmentId}/${roundId}/groups`
                )
              }
              variant="outline"
              className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-primary text-primary shadow-none rounded-none"
            >
              Groups
            </Button>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <GroupButton
            roundId={roundId}
            type={formType}
            onClick={handleCreate}
            tournmentId={tournmentId}
          />
        </div>
      </div>
      <GroupForm
        roundId={roundId}
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        type={formType}
        initialData={editGroup}
        tournmentId={tournmentId}
      />

      {!groups || groups.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">
            No Groups yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first Groups
          </p>
          <GroupButton
            roundId={roundId}
            type={formType}
            onClick={handleCreate}
            tournmentId={tournmentId}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.map((group: Group) => (
            <GroupCard
              key={group.id?.toString()}
              group={group}
              onEdit={handleEdit}
              roundId={roundId}
              tournmentId={tournmentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;

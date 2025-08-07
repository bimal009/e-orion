import GameList from "@/components/dashboard/Games/GameList";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ id: string; rid: string }>;
}) => {
  const { id, rid } = await params;

  return (
    <div className="tournaments-page mx-auto py-6 px-4 max-w-7xl">
      <GameList tournmentId={id} roundId={rid} />
    </div>
  );
};

export default page;

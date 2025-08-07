import React from "react";
import TeamStatsCard from "@/components/cast/TeamStatsCard";
import BottomCard from "@/components/cast/BottomCard";

export default async function EsportsOverlay({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-black p-0 font-mono relative overflow-hidden">
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
        <TeamStatsCard gameId={id} />
      </div>

      {/* Bottom Card - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-full lg:w-auto z-10">
        <BottomCard gameId={id} />
      </div>
    </div>
  );
}

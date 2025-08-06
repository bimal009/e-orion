import React from "react";
import TeamStatsCard from "@/components/cast/TeamStatsCard";
import BottomCard from "@/components/cast/BottomCard";

export default async function EsportsOverlay({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id, "id from params");
  return (
    <div className="min-h-screen bg-black/95 p-0 font-mono relative overflow-hidden">
      {/* Full Screen Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-black to-slate-900/20"></div>

      {/* Team Stats Card - Middle Right */}
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

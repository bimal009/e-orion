import React from 'react';
import TeamStatsCard from '@/components/cast/TeamStatsCard';
import BottomCard from '@/components/cast/BottomCard';
import { useGetGames } from '@/components/dashboard/api/useGames';


export default function EsportsOverlay( {params}: {params: {id: string}}) {
    const {id}= params




  return (
    <div className="min-h-screen bg-black/95 p-0 font-mono relative overflow-hidden">
      {/* Full Screen Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-black to-slate-900/20"></div>
      


      {/* Bottom Content Container */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-8">
        
        {/* Bottom Left: Team Info Bar */}
      <BottomCard gameId={id} />

        {/* Bottom Right: Teams Stats Panel */}
        <div className="flex flex-col mb-40">

        <TeamStatsCard />
        </div>
      </div>
    </div> 
  );
}
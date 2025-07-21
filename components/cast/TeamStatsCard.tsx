import React from 'react';

const TeamStatsCard = () => {
  const teams = [
    { rank: 1, name: 'G4R', status: 'active', points: 2 },
    { rank: 2, name: 'OG', status: 'active', points: 0 },
    { rank: 3, name: 'EGx', status: 'active', points: 0 },
    { rank: 4, name: 'VEx', status: 'active', points: 0 },
    { rank: 5, name: 'LHS', status: 'active', points: 0 },
    { rank: 6, name: 'CK', status: 'active', points: 0 },
    { rank: 7, name: 'MDL', status: 'active', points: 0 },
    { rank: 8, name: 'WF', status: 'active', points: 0 },
    { rank: 9, name: 'NaNx', status: 'active', points: 0 },
    { rank: 10, name: 'TRX', status: 'active', points: 0 },
    { rank: 11, name: 'Diam', status: 'eliminated', points: 0 },
    { rank: 12, name: 'PNX', status: 'active', points: 0 },
    { rank: 13, name: 'SPIN', status: 'active', points: 0 },
    { rank: 14, name: 'GODL', status: 'active', points: 0 },
    { rank: 15, name: 'MM', status: 'active', points: 0 },
    { rank: 16, name: 'Ninz', status: 'active', points: 0 },
    { rank: 17, name: 'Ninz', status: 'active', points: 0 },
  ];

  const getStatusBars = (status: string , isLeader: boolean = false ) => {
    if (status === 'eliminated') {
      return (
        <div className="flex gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1.5 h-4 bg-primary rounded-sm"></div>
          ))}
        </div>
      );
    }
    
    if (isLeader) {
      return (
        <div className="flex gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1.5 h-4 bg-accent rounded-sm"></div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="flex gap-0.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-1.5 h-4 bg-secondary rounded-sm"></div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-64 bg-background text-foreground font-mono text-xs">
      {/* Header */}
      <div className="bg-muted text-primary px-2 border-b border-border py-2 flex items-center text-xs font-bold">
        <div className="w-4 text-left">#</div>
        <div className="flex-1 text-left pl-1">TEAMS</div>
        <div className="w-12 text-center">ALV</div>
        <div className="w-8 text-center">ELMS</div>
        <div className="w-6 text-right">PTS</div>
      </div>
      
      {/* Team List */}
      <div>
        {teams.map((team) => (
          <div
            key={team.rank}
            className={`px-2 py-1 flex items-center text-xs border-b border-border ${
              team.status === 'eliminated' ? 'bg-muted opacity-75' : ''
            } ${team.rank === 1 ? 'bg-accent/20' : ''}`}
          >
            {/* Rank */}
            <div className="w-4 text-left font-bold text-primary">
              {team.rank}
            </div>
            
            {/* Team Name */}
            <div className={`flex-1 pl-1 font-bold ${
              team.status === 'eliminated' ? 'text-muted-foreground line-through' : 'text-foreground'
            }`}>
              {team.name}
            </div>
            
            {/* Status Bars (ALV) */}
            <div className="w-12 flex justify-center">
              {getStatusBars(team.status, team.rank === 1)}
            </div>
            
            {/* ELMS column */}
            <div className="w-8 text-center font-bold">
              0
            </div>
            
            {/* Points (PTS) */}
            <div className="w-6 text-right font-bold">
              {team.points}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="bg-muted px-2 py-1 flex justify-between items-center text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-secondary rounded border border-border"></div>
          <span>FINISHED</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary rounded border border-border"></div>
          <span>ALIVE</span>
        </div>
      </div>
    </div>
  );
};

export default TeamStatsCard;
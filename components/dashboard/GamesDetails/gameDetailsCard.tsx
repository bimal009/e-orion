import React, { useState } from 'react'
import { Shield, MessageSquare, RotateCcw } from 'lucide-react'

// Mock data to match your image
const mockTeams = [
  {
    id: 1,
    name: "Da Real Soldiers",
    players: [
      { id: 1, name: "player 2", kills: 2 },
      { id: 2, name: "player 1", kills: 5 }
    ]
  }
]

const GameDetailsCard = () => {
  const [teams, setTeams] = useState(mockTeams)

  const updatePlayerKills = (teamId, playerId, change) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? {
              ...team,
              players: team.players.map(player => 
                player.id === playerId 
                  ? { ...player, kills: Math.max(0, player.kills + change) }
                  : player
              )
            }
          : team
      )
    )
  }

  const removePlayer = (teamId, playerId) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? {
              ...team,
              players: team.players.filter(player => player.id !== playerId)
            }
          : team
      )
    )
  }

  if (teams.length === 0) {
    return <p className="text-gray-400 text-sm">No teams in this group.</p>
  }

  return (
    <div className="w-full max-w-sm">
      {teams.map(team => (
        <div key={team.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          {/* Team Header */}
          <div className="flex items-center gap-2 bg-gray-700 px-4 py-3 border-b border-gray-600">
            <Shield className="text-green-400 w-5 h-5" />
            <span className="font-semibold text-white">{team.name}</span>
          </div>
          
          {/* Players */}
          <div className="p-4 space-y-3">
            {team.players && team.players.length > 0 && team.players.map(player => (
              <div key={player.id} className="flex items-center gap-3">
                {/* Remove button */}
                <button 
                  onClick={() => removePlayer(team.id, player.id)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                  title="Remove player"
                >
                  ×
                </button>
                
                {/* Player name */}
                <span className="text-white flex-1 text-sm">{player.name}</span>
                
                {/* Kill counter */}
                <div className="flex items-center gap-1 bg-gray-700 rounded px-1">
                  <button 
                    onClick={() => updatePlayerKills(team.id, player.id, -1)}
                    className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-colors"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-white text-sm font-medium">
                    {player.kills}
                  </span>
                  <button 
                    onClick={() => updatePlayerKills(team.id, player.id, 1)}
                    className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-colors"
                  >
                    +
                  </button>
                </div>
                
                {/* Action buttons */}
                <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors" title="Message">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors" title="Reset">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GameDetailsCard
"use client"
import { Trophy, ArrowLeft } from 'lucide-react'
import TournamentButton from './GameButton'
import { Match } from '@/lib/types'
import { useState } from 'react'
import { useQueryState } from 'nuqs'
import SearchButton from '../tournments/SearchButton'
import GameCard from './GameCard'
import GameForm from './GameForm'
import { useGetRounds, useGetRoundsBySearch } from '../api/useRound'
import GameButton from './GameButton'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { FullScreenLoader } from '@/components/shared/Loader'
import { useGetTeams } from '../api/useTeams'
import { useGetGames } from '../api/useGames'
import { useGetGroupsByRoundId } from '../api/useGroup'
import { useGetMaps } from '../api/useMaps'

const GameList = ({tournmentId,roundId}:{tournmentId:string,roundId:string}) => {
  const [search] = useQueryState('search')
  const router = useRouter()
  const { data: games, isPending: isGamesPending } = useGetGames(tournmentId, roundId)
  const tournamentIdForGroups = games?.[0]?.tournamentId;
  const { data: groups, isPending: isGroupsPending } = useGetGroupsByRoundId(roundId);
  console.log(groups, "groups")
  const [formOpen, setFormOpen] = useState(false)
  const [formType, setFormType] = useState<'create' | 'edit'>('create')
  const [editGame, setEditGame] = useState<Match | null>(null)
  const { data: maps , isPending: isMapsPending } = useGetMaps()
  const handleEdit = (game: Match) => {
    setEditGame(game)
    setFormType('edit')
    setFormOpen(true)
  }

  const handleCreate = () => {
    setEditGame(null)
    setFormType('create')
    setFormOpen(true)
    console.log(formOpen)
  }

  const gameList = games;

  const isLoading = isGamesPending || isMapsPending || (!!tournamentIdForGroups && isGroupsPending);
  if (isLoading) {
    return (
      <FullScreenLoader />
    )
  }

  return (
    <div className="space-y-6">
      <div className='w-full'>
        <SearchButton/>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => router.push(`/dashboard/tournment/${tournmentId}`)} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 text-sm font-medium bg-background hover:bg-accent cursor-pointer border-border hover:border-primary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <Button onClick={() => router.push(`/dashboard/tournment/${tournmentId}/${roundId}`)} variant="outline" className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-primary text-primary">Games</Button>
            <Button onClick={() => router.push(`/dashboard/tournment/${tournmentId}/${roundId}/groups`)} variant="outline" className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-transparent">Groups</Button>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <GameButton roundId={roundId}   type={formType} onClick={handleCreate} tournmentId={tournmentId} />
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
      
      { !gameList || gameList.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">No Rounds yet</h3>
          <p className="text-muted-foreground mb-6">Get started by creating your first Rounds</p>
          <GameButton roundId={roundId} type={formType} onClick={handleCreate} tournmentId={tournmentId} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {gameList?.map((game: Match) => (
                <GameCard key={game.id?.toString()} game={game} groups={(groups || []).map(g => ({ ...g, round: g.round ?? undefined }))} maps={maps || []} onEdit={handleEdit} />
            ))}
        </div>
      )}
    </div>
  )
}

export default GameList



"use client"
import { Trophy } from 'lucide-react'
import TournamentButton from './TournmentButton'
import TournamentCard from './TournmentsCard'
import TournamentForm from './TournamentForm'
import { Tournament } from '@/lib/types'
import { useState } from 'react'
import SearchButton from './SearchButton'
import { useQueryState } from 'nuqs'
import { useGetTournaments, useGetTournamentsBySearch } from '../api/UseTournment'
import { FullScreenLoader } from '@/components/shared/Loader'

const TournamentsList = () => {
  const [search] = useQueryState('search')
  const { data: allTournaments, isPending: isPendingAll, isFetching: isFetchingAll } = useGetTournaments()
  const { data: searchResults, isPending: isPendingSearch, isFetching: isFetchingSearch } = useGetTournamentsBySearch(search || '')

  const data = search ? searchResults : allTournaments
  const isPending = search ? isPendingSearch : isPendingAll
  const isFetching = search ? isFetchingSearch : isFetchingAll

  const [formOpen, setFormOpen] = useState(false)
  const [formType, setFormType] = useState<'create' | 'edit'>('create')
  const [editTournament, setEditTournament] = useState<Tournament | null>(null)

  const handleEdit = (tournament: Tournament) => {
    setEditTournament(tournament)
    setFormType('edit')
    setFormOpen(true)
  }

  const handleCreate = () => {
    setEditTournament(null)
    setFormType('create')
    setFormOpen(true)
  }

  // Only show full screen loader on initial load, not during search
  if (isPending && !search) {
    return <FullScreenLoader />
  }

  return (
    <div className="space-y-6">
      <div className="w-full">
        <SearchButton/>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-foreground">Your Tournaments</span>
          {isFetching && search && (
            <div className="text-sm text-muted-foreground">Searching...</div>
          )}
        </div>
        <div>
          <TournamentButton type="create" onClick={handleCreate} />
        </div>
      </div>
      <TournamentForm
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        type={formType}
        initialData={editTournament}
      />
      { !data || data.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">
            {search ? 'No tournaments found' : 'No tournaments yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {search ? 'Try adjusting your search terms' : 'Get started by creating your first tournament'}
          </p>
          {!search && <TournamentButton type="create" onClick={handleCreate} />}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((tournament: Tournament) => (
            <TournamentCard key={tournament.id?.toString()} tournament={tournament} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TournamentsList
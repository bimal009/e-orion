"use client"
import { Trophy } from 'lucide-react'
import TournamentButton from './TournmentButton'
import TournamentCard from './TournmentsCard'
import TournamentForm from './TournmentForm'
import { UseGetTournments } from '../api/UseTournment'
import { Tournament } from '@/lib/types'
import { useState } from 'react'
import SearchButton from './SearchButton'
import { useQueryState } from 'nuqs'
import { UseGetTournmentsBySearch } from '../api/UseTournment'


const TournamentsList = () => {
  const [search] = useQueryState('search')
  const { data, isPending } = UseGetTournmentsBySearch(search || '')
  console.log(search)
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

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Tournaments</h2>
          <TournamentButton type="create" onClick={handleCreate} />
        </div>
        <div className=''>
          <SearchButton/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-transparent border border-primary rounded-lg p-6 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg" />
                <div className="flex-1">
                  <div className="h-6 bg-primary/20 rounded w-3/4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-primary/20 rounded w-1/2" />
                <div className="h-4 bg-primary/20 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

 
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Tournaments</h2>
        <TournamentButton type="create" onClick={handleCreate} />
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
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">No tournaments yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first tournament</p>
          <TournamentButton type="create" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((tournament:Tournament) => (
            <TournamentCard key={tournament.id?.toString()} tournament={tournament}  onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TournamentsList
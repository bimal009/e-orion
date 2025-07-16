"use client"
import { Trophy } from 'lucide-react'
import TournamentButton from './RoundButton'
import { Round } from '@/lib/types'
import { useState } from 'react'
import { useQueryState } from 'nuqs'
import SearchButton from '../tournments/SearchButton'
import RoundCard from './RoundCard'
import RoundForm from './RoundForm'
import { UseGetRounds, UseGetRoundsBySearch } from '../api/useRound'
import RoundButton from './RoundButton'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const RoundList = ({tournmentId}:{tournmentId:string}) => {
  const [search] = useQueryState('search')
  const router = useRouter()
  const { data, isPending } = UseGetRounds()
  const {data:data2, isPending:isPending2}=UseGetRoundsBySearch(search || "")
  const [formOpen, setFormOpen] = useState(false)
  const [formType, setFormType] = useState<'create' | 'edit'>('create')
  const [editRound, setEditRound] = useState<Round | null>(null)

  const handleEdit = (round: Round) => {
    setEditRound(round)
    setFormType('edit')
    setFormOpen(true)
  }

  const handleCreate = () => {
    setEditRound(null)
    setFormType('create')
    setFormOpen(true)
    console.log(formOpen)
  }

  const rounds = search ? data2 : data;

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <RoundButton type={formType} onClick={handleCreate} tournmentId={tournmentId} />
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
      <div className='w-full'>
        <SearchButton/>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push(`/dashboard/tournment/${tournmentId}`)} variant="outline" className="text-xl font-semibold bg-transparent hover:bg-transparent cursor-pointer border-b-2 border-primary">Rounds</Button>
          <Button onClick={() => router.push(`/dashboard/tournment/${tournmentId}/teams`)} variant="outline" className="text-xl font-semibold bg-transparent hover:bg-transparent cursor-pointer">Teams</Button>
        </div>

      <div>

        <RoundButton type={formType} onClick={handleCreate} tournmentId={tournmentId} />
      </div>
      </div>
      {/* Remove the conditional rendering - always render the form */}
      <RoundForm
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        type={formType}
        initialData={editRound}
        tournmentId={tournmentId}
      />
      
      { !rounds || rounds.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">No Rounds yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first Rounds</p>
          <RoundButton type={formType} onClick={handleCreate} tournmentId={tournmentId} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rounds?.map((round:Round) => (
            <RoundCard key={round.id?.toString()} round={round}  onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RoundList
"use client"
import { Trophy, ArrowLeft } from 'lucide-react'
import TournamentButton from './PointTableButton'
import { Round } from '@/lib/types'
import { useState } from 'react'
import { useQueryState } from 'nuqs'
import SearchButton from '../tournments/SearchButton'
import RoundCard from './pointTableCard'
import PointTableForm from './pointTableForm'
import { useGetRounds, useGetRoundsBySearch } from '../api/useRound'
import RoundButton from './PointTableButton'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { FullScreenLoader } from '@/components/shared/Loader'
import PointTableCard from './pointTableCard'
import { PointsTable } from '@prisma/client'
import { useGetPointsTable } from '../api/usePointsTable'

const PointTableList = ({tournmentId}:{tournmentId:string}) => {
  const [search] = useQueryState('search')
  const router = useRouter()
    const { data, isPending } = useGetPointsTable(tournmentId  )
  const [formOpen, setFormOpen] = useState(false)
  const [formType, setFormType] = useState<'create' | 'edit'>('create')
  const [editPointTable, setEditPointTable] = useState<PointsTable | null>(null)

  const handleEdit = (pointTable: PointsTable) => {
    setEditPointTable(pointTable)
    setFormType('edit')
    setFormOpen(true)
  }

  const handleCreate = () => {
    setEditPointTable(null)
    setFormType('create')
    setFormOpen(true)
    console.log(formOpen)
  }

  const pointTables = data;

  if (isPending) {
    return (
      <FullScreenLoader />
         
    )
  }

  return (
    <div className="space-y-6">
   
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => router.push('/dashboard')} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 text-sm font-medium bg-background hover:bg-accent cursor-pointer border-border hover:border-primary"
          >
            <ArrowLeft className="w-4 h-4" />
           
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <Button onClick={() => router.push(`/dashboard/tournment/${tournmentId}`)} variant="outline" className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer text-primary">Rounds</Button>
            <Button onClick={() => router.push(`/dashboard/tournment/${tournmentId}/teams`)} variant="outline" className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-transparent">Teams</Button>
            <Button onClick={() => router.push(`/dashboard/tournment/${tournmentId}/points-table`)} variant="outline" className="text-xl font-semibold bg-transparent hover:bg-transparent hover:text-primary cursor-pointer border-b-2 border-primary text-primary">Points Table</Button>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <RoundButton type={formType} onClick={handleCreate} tournmentId={tournmentId} />
        </div>
      </div>
      <PointTableForm
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        type={formType}
        initialData={editPointTable}
        tournmentId={tournmentId}
      />
      
      { !pointTables || pointTables.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">No Point Tables yet</h3>
          <p className="text-muted-foreground mb-6">Get started by creating your first Point Tables</p>
          <RoundButton type={formType} onClick={handleCreate} tournmentId={tournmentId} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pointTables?.map((pointTable:PointsTable) => (
            <PointTableCard key={pointTable.id?.toString()} pointTable={pointTable}  onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PointTableList
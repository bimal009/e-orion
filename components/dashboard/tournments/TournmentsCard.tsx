import Image from 'next/image'
import { Trophy, Calendar, Users } from 'lucide-react'
import { Tournament } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { useDeleteTournment } from '../api/UseTournment'

interface TournamentCardProps {
  tournament: Tournament
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
    const { mutate, isPending } = useDeleteTournment()
    const handleDelete = (id: string) => {
        mutate(id)
    }

  return (
    <div className="bg-transparent border border-primary hover:scale-105 duration-300 transition-all rounded-lg shadow-md hover:shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
          <Image
            src={tournament.logo}
            alt={tournament.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{tournament.name}</h3>
        </div>
      </div>

      <div className="space-y-2 text-sm text-white">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Created {new Date(tournament.createdAt || new Date()).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>0 participants</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button className="flex-1 bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors">
            Manage
          </button>
          <Button 
            onClick={() => tournament.id && handleDelete(tournament.id)}  
            variant="destructive" 
            className="flex-1 border py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2">↻</span>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TournamentCard
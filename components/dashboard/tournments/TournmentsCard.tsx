import Image from 'next/image'
import { Trophy, Calendar, Users, MoreVertical } from 'lucide-react'
import { Tournament } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { useDeleteTournment } from '../api/UseTournment'
import {  useRouter } from 'next/navigation'
import React, { useState, useRef } from 'react'

interface TournamentCardProps {
  tournament: Tournament
  onEdit?: (tournament: Tournament) => void
}

const TournamentCard = ({ tournament, onEdit }: TournamentCardProps) => {
    const { mutate, isPending } = useDeleteTournment()
    const handleDelete = (id: string) => {
        mutate(id)
    }
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setMenuOpen(false)
        }
      }
      if (menuOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      } else {
        document.removeEventListener('mousedown', handleClickOutside)
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [menuOpen])

    return (
      <div
        className="bg-transparent border border-primary hover:scale-105 duration-300 transition-all rounded-lg shadow-md hover:shadow-lg p-6 relative cursor-pointer"
        onClick={() => router.push(`/dashboard/tournment/${tournament.id}`)}
      >
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
          <div className="relative z-10" onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}>
            <button className="p-1 rounded-full hover:bg-gray-700 focus:outline-none">
              <MoreVertical size={20} />
            </button>
            {menuOpen && (
              <div ref={menuRef} className="absolute right-0 mt-2 w-32 bg-black/50 border border-gray-700 rounded shadow-lg py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800/20 text-secondary-foreground"
                  onClick={e => { e.stopPropagation(); setMenuOpen(false); onEdit && onEdit(tournament); }}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800/20 text-red-500"
                  onClick={e => { e.stopPropagation(); setMenuOpen(false); tournament.id && handleDelete(tournament.id); }}
                  disabled={isPending}
                >
                  {isPending ? (
                    <><span className="animate-spin mr-2">↻</span>Deleting...</>
                  ) : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2 text-sm text-white">
         <div className="flex items-center space-x-2">
         <div className="flex items-center space-x-2">
  <span className="h-6 w-6 rounded" style={{ background: tournament.primaryColor }}></span>
  
  <span className="h-6 w-6 rounded" style={{ background: tournament.secondaryColor }}></span>
  <span className="h-6 w-6 rounded" style={{ background: tournament.textColor1 }}></span>
  <span className="h-6 w-6 rounded" style={{ background: tournament.textColor2 }}></span>
</div>
          </div>

          
        </div>
      </div>
    )
}

export default TournamentCard
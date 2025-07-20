'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Plus, Edit3, Sparkles } from 'lucide-react'
import TournamentForm from './TournamentForm'

type ButtonProps = {
  type: 'edit' | 'create'
  onClick?: () => void
}

const TournamentButton = ({ type, onClick }: ButtonProps) => {
  const [opened, setOpened] = useState(false)

  const Icon = type === 'create' ? Plus : Edit3

  return (
    <>
      <Button 
        variant="default" 
        onClick={onClick ? onClick : () => setOpened(true)}
        className="relative group px-6 py-3 rounded-xl font-semibold"
      >
        <Icon className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
        {type === 'edit' ? 'Edit Tournament' : 'Create Tournament'}
        {type === 'create' && (
          <Sparkles className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
        )}
      </Button>

      {!onClick && (
        <TournamentForm
          opened={opened}
          onClose={() => setOpened(false)}
          type={type}
        />
      )}
    </>
  )
}

export default TournamentButton
'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import GameForm from './GameForm'

type ButtonProps = {
  type: 'edit' | 'create' 
  onClick?: () => void
  tournmentId: string
  roundId: string
}

const GameButton = ({ type, onClick, tournmentId, roundId }: ButtonProps) => {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Button variant="default" onClick={onClick ? onClick : () => setOpened(true)}>
        {type === 'edit' ? 'Edit Game' : 'Create Game'}
      </Button>

      {!onClick && (
        <GameForm
          opened={opened}
          onClose={() => setOpened(false)}
          type={type}
          tournmentId={tournmentId}
          roundId={roundId}          
        />
      )}
    </>
  )
}

export default GameButton
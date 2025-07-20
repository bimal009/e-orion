'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import GameForm from './GameForm'

type ButtonProps = {
  type: 'edit' | 'create' // Only allow valid types
  onClick?: () => void
  tournmentId: string
}

const GameButton = ({ type, onClick, tournmentId }: ButtonProps) => {
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
          
        />
      )}
    </>
  )
}

export default GameButton
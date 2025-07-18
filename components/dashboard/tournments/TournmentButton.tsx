'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import TournamentForm from './TournmentForm'

type ButtonProps = {
  type: 'edit' | 'create' // Only allow valid types
  onClick?: () => void
}

const TournamentButton = ({ type, onClick }: ButtonProps) => {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Button variant="default" onClick={onClick ? onClick : () => setOpened(true)}>
        {type === 'edit' ? 'Edit Tournament' : 'Create Tournament'}
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
'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import TournamentForm from './TournmentForm'

type ButtonProps = {
  type: 'edit' | 'add' | 'create'
}

const TournamentButton = ({ type }: ButtonProps) => {
  const [opened, setOpened] = useState(false)

  const handleTournamentCreate = (data: any) => {
    console.log('Tournament created:', data)
    // Add your tournament creation logic here
    // e.g., call API, update state, etc.
  }

  return (
    <>
      <Button variant="default" onClick={() => setOpened(true)}>
        {type === 'add' && 'Add Tournament'}
        {type === 'edit' && 'Edit Tournament'}
        {type === 'create' && 'Create Tournament'}
      </Button>

      <TournamentForm
        opened={opened} 
        onClose={() => setOpened(false)}
        onSubmit={handleTournamentCreate}
      />
    </>
  )
}

export default TournamentButton
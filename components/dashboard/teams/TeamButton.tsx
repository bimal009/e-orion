'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import TeamForm from './TeamForm'

type ButtonProps = {
  type: 'edit' | 'create' // Only allow valid types
  onClick?: () => void
  tournmentId: string
}

const TeamButton = ({ type, onClick, tournmentId }: ButtonProps) => {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Button variant="default" onClick={onClick ? onClick : () => setOpened(true)}>
        {type === 'edit' ? 'Edit Round' : 'Create Round'}
      </Button>

      {!onClick && (
        <RoundForm
          opened={opened}
          onClose={() => setOpened(false)}
          type={type}
          tournmentId={tournmentId}
        />
      )}
    </>
  )
}

export default TeamButton
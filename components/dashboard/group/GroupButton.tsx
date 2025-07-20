'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import GroupForm from './GroupForm'

type ButtonProps = {
  type: 'edit' | 'create' // Only allow valid types
  onClick?: () => void
  tournmentId: string
  roundId: string
}

const GroupButton = ({ type, onClick, tournmentId, roundId }: ButtonProps) => {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Button variant="default" onClick={onClick ? onClick : () => setOpened(true)}>
        {type === 'edit' ? 'Edit Group' : 'Create Group'}
      </Button>

      {!onClick && (
        <GroupForm
          roundId={roundId}
          opened={opened}
          onClose={() => setOpened(false)}
          type={type}
          tournmentId={tournmentId}
        />
      )}
    </>
  )
}

export default GroupButton
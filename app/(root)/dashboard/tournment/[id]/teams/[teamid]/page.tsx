
import TeamDetailsPage from '@/components/dashboard/teams/TeamDetails'
import React from 'react'

const page = async ({params}:{params:Promise<{id:string, teamid:string}>}) => {
  const {id, teamid} = await params
  return (
    <TeamDetailsPage id={id} teamid={teamid} />
  )
}

export default page
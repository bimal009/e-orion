import TeamList from '@/components/dashboard/teams/TeamList'
import React from 'react'

const page = async ({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params
  console.log(id)
  return (
    <div className="tournaments-page mx-auto py-6 px-4 max-w-7xl">
   
      <TeamList tournmentId={id as string}/>
      
    </div>
  )
}

export default page
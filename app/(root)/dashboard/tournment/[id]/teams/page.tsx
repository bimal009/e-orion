import TeamList from '@/components/dashboard/teams/TeamList'
import React from 'react'

const page = async ({params}:{params:{id:string}}) => {
  const {id} = await params
  console.log(id)
  return (
    <div className="tournaments-page mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-8">
        

        
      </div>
      <TeamList tournmentId={id as string}/>
      
    </div>
  )
}

export default page
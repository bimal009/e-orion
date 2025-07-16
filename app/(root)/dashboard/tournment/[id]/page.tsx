import RoundList from '@/components/dashboard/rounds/RoundList'
import React from 'react'

const page = async ({params}:{params:{id:string}}) => {
  const {id} = await params
  console.log(id)
  return (
    <div className="tournaments-page mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-8">
        

        
      </div>
      <RoundList tournmentId={id as string}/>
      
    </div>
  )
}

export default page
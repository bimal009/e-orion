import GroupList from '@/components/dashboard/group/GroupList'
import React from 'react'

const page = async ({params}:{params:Promise<{id:string,rid:string}>}) => {
  const {id,rid} = await params
  
  console.log("Page params:", { id, rid })
  console.log("Type of id:", typeof id, "Type of rid:", typeof rid)
  console.log("Is id undefined?", id === undefined)
  console.log("Is rid undefined?", rid === undefined)
  
  // Add validation
  if (!id || !rid) {
    console.error("Missing required parameters:", { id, rid })
    return <div>Error: Missing required parameters</div>
  }
  
  return (
    <div className="tournaments-page mx-auto py-6 px-4 max-w-7xl">
      <GroupList tournmentId={id} roundId={rid}/>
    </div>
  )
}

export default page
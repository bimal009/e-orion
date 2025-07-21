  import PointTableForm from '@/components/dashboard/point table/pointTableForm'
import PointTableList from '@/components/dashboard/point table/PointTableList'
import React from 'react'

const page = ({params}:{params:{id:string}}) => {
    const {id} = params
  return (
    <div className='tournaments-page mx-auto py-6 px-4 max-w-7xl'>  
    <PointTableList
    tournmentId={id}
    />
    </div>
  )
}

export default page
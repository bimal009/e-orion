import GameDetailsPage from '@/components/dashboard/GamesDetails/GameDetailsList'
import React from 'react'

const page = async ({params}:{params:{id:string,rid:string,gid:string}}) => {
    const {id,rid,gid} = params
    return (
        <div className='tournaments-page mx-auto py-6 px-4 max-w-7xl'>
            <GameDetailsPage tournmentId={id} roundId={rid} gameId={gid} />
        </div>
    )
}

export default page
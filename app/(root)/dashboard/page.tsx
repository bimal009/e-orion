import { Suspense } from 'react'
import { Metadata } from 'next'
import TournamentsList from '@/components/dashboard/tournments/TournamentsList'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Tournaments - Manage Your Gaming Events',
  description: 'Create and manage tournaments for your gaming community',
}

// This could fetch data at build time or request time
async function getTournaments() {
  // Replace with your actual data fetching logic
  // This runs on the server
  try {
    // const response = await fetch('your-api-endpoint/tournaments', {
    //   cache: 'force-cache', // or 'no-store' for dynamic data
    // })
    // return response.json()
    
    // Mock data for now
    return []
  } catch (error) {
    console.error('Failed to fetch tournaments:', error)
    return []
  }
}

// Main page component (Server Component)
const TournamentsPage = async () => {
  const tournaments = await getTournaments()

  return (
    <div className="tournaments-page mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-accent-foreground text-2xl font-bold md:text-3xl lg:text-4xl text-center mb-2">
          Your Tournaments
        </h1>
        <p className="text-muted-foreground text-center">
          Create and manage your gaming tournaments
        </p>
      </div>

      
        <TournamentsList initialTournaments={tournaments} />
    </div>
  )
}


export default TournamentsPage
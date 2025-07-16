import { Metadata } from 'next'
import TournamentsList from '@/components/dashboard/tournments/TournamentsList'
import SearchButton from '@/components/dashboard/tournments/SearchButton'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Erion - Tournaments - Manage Your Gaming Events',
  description: 'Create and manage tournaments for your gaming community',
}



// Main page component (Server Component)
const TournamentsPage = async () => {
 

  return (
    <div className="tournaments-page mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-accent-foreground text-3xl font-bold md:text-3xl lg:text-5xl text-center mb-2">
          Your Tournaments
        </h1>
        <p className="text-muted-foreground text-center">
          Create and manage your gaming tournaments
        </p>

        
      </div>

      
        <TournamentsList  />
    </div>
  )
}


export default TournamentsPage
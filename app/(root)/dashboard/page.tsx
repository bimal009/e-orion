import { Metadata } from 'next'
import { Suspense } from 'react'
import TournamentsList from '@/components/dashboard/tournments/TournamentsList'
import { FullScreenLoader } from '@/components/shared/Loader'


// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Erion - Tournaments - Manage Your Gaming Events',
  description: 'Create and manage tournaments for your gaming community',
}

// Main page component (Server Component)
const TournamentsPage = async () => {

  return (
    <div className="tournaments-page mx-auto py-6 px-4 max-w-7xl">
      <Suspense fallback={<FullScreenLoader />}>
        <TournamentsList />
      </Suspense>
    </div>
  )
}

export default TournamentsPage
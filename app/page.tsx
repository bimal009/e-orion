import React from 'react'
import Features from '@/components/shared/Features'
import HowItWorks from '@/components/shared/HowItWorks'
import Hero from '@/components/shared/Hero'
import CallToAction from '@/components/shared/CallToAction'
import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Navbar'

const Home = () => {
  return (
    <main>
      <Header/>
      {/* Hero Section */}
      <Hero />

      {/* Events Section */}
      <section id="events" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Features />

            <HowItWorks />


            <CallToAction />
          </div>
        </div>
        <Footer/>
      </section>
    </main>
  )
}

export default Home
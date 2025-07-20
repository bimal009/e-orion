import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const Hero = () => {
    return (
        <section className="relative overflow-hidden py-16 md:py-24">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                        <div className="space-y-6">
                            <p className="inline-block text-sm font-medium bg-primary/10 text-secondary-foreground px-4 py-1.5 rounded-full">
                                E-ORION
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                               Command <span className="text-primary">The</span> Game<br />
                               <span className="text-primary">Conquer</span> The Rankings
                            </h1>
                        </div>

                        <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Live esports production with real-time stats, rankings, and domination tracking – powered by innovation
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/menu">
                                <Button size="lg" className="rounded-full px-8 bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                                    Live Now
                                </Button>
                            </Link>
                            <Link href="/demo">
                                <Button size="lg" variant="outline" className="rounded-full px-8 border-primary/20 hover:bg-primary/5">
                                    Watch Demo
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/60">
                            <div className="text-center lg:text-left">
                                <p className="text-2xl lg:text-3xl font-bold text-primary">5+</p>
                                <p className="text-sm text-muted-foreground">Games</p>
                            </div>
                            <div className="text-center lg:text-left">
                                <p className="text-2xl lg:text-3xl font-bold text-primary">1k+</p>
                                <p className="text-sm text-muted-foreground">Users</p>
                            </div>
                            <div className="text-center lg:text-left">
                                <p className="text-2xl lg:text-3xl font-bold text-primary">50+</p>
                                <p className="text-sm text-muted-foreground">Tournaments</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-lg">
                            <div className="aspect-square relative">
                                <Image
                                    src="/hero.webp"
                                    alt="Gaming controller with esports elements"
                                    fill
                                    priority
                                    className="object-contain drop-shadow-2xl relative z-10"
                                />
                            </div>

                            {/* Balanced Glow Effects */}
                            <div className="absolute -z-10  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full bg-primary/15 blur-[60px] animate-pulse"></div>
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-gradient-to-r from-primary/25 to-blue-500/25 blur-[40px]"></div>
                            <div className="absolute -z-10 top-1/3 right-1/3 w-16 h-16 rounded-full bg-cyan-400/40 blur-[20px] animate-pulse delay-300"></div>
                            <div className="absolute -z-10 bottom-1/3 left-1/3 w-12 h-12 rounded-full bg-white blur-[15px] animate-pulse delay-700"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Background Effects */}
            <div className="absolute inset-0 -z-20">
                <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-primary/3 blur-[120px]"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/3 blur-[100px]"></div>
            </div>
        </section>
    )
}

export default Hero

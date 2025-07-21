"use client"
import React from 'react'
import { Play, Trophy, Users, Gamepad2, TrendingUp, Zap, Star, Target } from 'lucide-react'

const Hero = () => {

    return (
        <section className="relative overflow-hidden min-h-screen bg-background">
            {/* Enhanced Background Effects */}
            

            {/* Refined Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Main Hero Content */}
                <div className="flex flex-col items-center text-center max-w-7xl mx-auto pt-20 pb-16">
                    
                    {/* Brand Badge */}
                    <div className="mb-6 sm:mb-8">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold bg-secondary/80 text-secondary-foreground px-5 py-2.5 rounded-full border border-border backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-lg">
                            <Zap className="w-4 h-4 text-primary animate-pulse" />
                            E-ORION
                            <div className="w-1 h-1 bg-primary rounded-full animate-ping ml-1"></div>
                        </div>
                    </div>

                    {/* Hero Headline - Fixed for MD devices */}
                    <div className="mb-6 sm:mb-8 space-y-2">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9] text-foreground">
                            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
                                <span>Command</span>
                              
                                <span className='text-primary'>Game</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-2">
                                <span>Conquer</span>
                                <div className="inline-flex items-center gap-1 sm:gap-2 text-primary">
                                    <span>The Rankings</span>
                                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                                </div>
                            </div>
                        </h1>
                    </div>

                    {/* Enhanced Subtitle */}
                    <div className="mb-8 sm:mb-10">
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                            Live esports production with{' '}
                            <span className="text-primary inline-flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                real-time stats
                            </span>
                            ,{' '}
                            <span className="text-primary inline-flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                rankings
                            </span>
                            , and{' '}
                            <span className="text-primary inline-flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                domination tracking
                            </span>
                            {' '}– powered by innovation
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 sm:mb-20 w-full max-w-md mx-auto">
                        <button className="group relative px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-full shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10 inline-flex items-center gap-2">
                                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Live Now
                            </span>
                        </button>
                        
                        <button className="group px-8 py-3.5 bg-secondary/80 text-secondary-foreground font-semibold rounded-full border border-border transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-secondary backdrop-blur-sm">
                            <span className="inline-flex items-center gap-2">
                                <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Watch Demo
                            </span>
                        </button>
                    </div>

                    {/* Process Steps */}
                    <div className="w-full max-w-6xl mx-auto mb-16 sm:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                {
                                    icon: Gamepad2,
                                    title: "5+ Games",
                                    description: "Input team data, match schedule, and prepare overlays before going live."
                                },
                                {
                                    icon: Users,
                                    title: "1k+ Active Users",
                                    description: "Broadcast with real-time scoreboards, player stats, and smooth transitions."
                                },
                                {
                                    icon: Trophy,
                                    title: "50+ Tournaments Hosted",
                                    description: "Monitor live rankings, dominators, and match highlights as the game unfolds."
                                },
                            ].map((feature, index) => (
                                <div key={index} className="flex flex-col items-center text-center group">
                                    <div className="mb-4 relative">
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                            <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
                                        </div>
                                        <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <h3 className="text-base md:text-lg font-bold text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs px-2 md:px-0">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Progress Line */}
                        <div className="relative mt-12">
                            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Floating Decorative Elements - Fixed positioning for MD devices */}
                    <div className="absolute top-24 md:top-32 left-4 md:left-8 hidden md:block animate-float">
                        <div className="relative">
                            <Star className="w-5 h-5 md:w-6 md:h-6 text-primary/60 animate-pulse" />
                            <div className="absolute inset-0 w-5 h-5 md:w-6 md:h-6 bg-primary/10 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    
                    <div className="absolute top-32 md:top-40 right-6 md:right-12 hidden md:block animate-bounce">
                        <Trophy className="w-4 h-4 md:w-5 md:h-5 text-accent/70" />
                    </div>
                    
                    <div className="absolute bottom-24 md:bottom-32 left-6 md:left-12 hidden md:block animate-float">
                        <div className="relative">
                            <Zap className="w-6 h-6 md:w-7 md:h-7 text-accent/60 animate-pulse" />
                            <div className="absolute inset-0 w-6 h-6 md:w-7 md:h-7 bg-accent/10 rounded-full animate-ping delay-500"></div>
                        </div>
                    </div>

                    <div className="absolute top-1/2 right-4 md:right-8 hidden lg:block animate-pulse">
                        <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-primary/50" />
                    </div>

                    <div className="absolute bottom-1/2 left-4 md:left-8 hidden lg:block animate-bounce">
                        <Target className="w-5 h-5 md:w-6 md:h-6 text-accent/50" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    )
}

export default Hero
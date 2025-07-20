import React from 'react'
import { Play, Trophy, Users, Gamepad2, TrendingUp, Zap, Star, Target, Bolt, Eye, Search, MonitorPlay, SignalHigh, ThumbsUp } from 'lucide-react'

const Hero = () => {
    return (
        <section className="relative overflow-hidden max-h-screen h-screen flex items-center bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0">
                {/* Enhanced gradient backgrounds */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
                <div className="flex flex-col items-center text-center max-w-7xl mx-auto h-full justify-center py-4">
                    
                    {/* Badge with Icon */}
                    <div className="mb-2 sm:mb-3">
                        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-secondary text-secondary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-pulse" />
                            E-ORION
                        </div>
                    </div>

                    {/* Main Heading */}
                    <div className="mb-2 sm:mb-3 space-y-0 sm:space-y-1">
                        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] sm:leading-[0.9] text-foreground">
                            <span className="block sm:inline">Command</span>
                            <span className="text-primary mx-2 sm:mx-3 inline-flex items-center gap-1 sm:gap-2">
                                <Target className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 inline" />
                                The
                            </span>
                            <span className="block sm:inline">Game</span>
                            <br className="hidden sm:block" />
                            <span className="block sm:inline text-foreground">Conquer</span>
                            <span className="text-foreground ml-2 sm:ml-3 inline-flex items-center gap-1 sm:gap-2">
                                The Rankings
                                <Trophy className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary inline" />
                            </span>
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <div className="mb-3 sm:mb-4 px-2">
                        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-3xl mx-auto leading-tight sm:leading-relaxed font-medium">
                            Live esports production with <span className="text-primary inline-flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                real-time stats
                            </span>,
                            <span className="text-primary inline-flex items-center gap-1 mx-1">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                                rankings
                            </span>, and
                            <span className="text-primary inline-flex items-center gap-1 mx-1">
                                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                                domination tracking
                            </span> – powered by innovation
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center mb-4 sm:mb-6 w-full max-w-sm xs:max-w-md sm:max-w-lg mx-auto">
                        <button className="group relative w-full xs:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-primary text-primary-foreground font-semibold text-sm sm:text-base rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 active:scale-95">
                            <span className="relative z-10 inline-flex items-center gap-2">
                                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Live Now
                            </span>
                        </button>
                        
                        <button className="group relative w-full xs:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-secondary text-secondary-foreground font-semibold text-sm sm:text-base rounded-full border border-border transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-accent">
                            <span className="transition-all duration-300 inline-flex items-center gap-2">
                                <Gamepad2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                Watch Demo
                            </span>
                        </button>
                    </div>

                    {/* Enhanced Stats with Icons - Achievement Cards Layout */}
                    <div className="w-full max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            <div className="bg-muted/50 backdrop-blur-sm rounded-2xl border border-border shadow-lg p-4 sm:p-6 text-center group hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="mb-4 flex justify-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                        <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">
                                        5+
                                    </p>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Multiple Games</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Support for popular esports titles with seamless integration and real-time data tracking.
                                </p>
                            </div>
                            
                            <div className="bg-muted/50 backdrop-blur-sm rounded-2xl border border-border shadow-lg p-4 sm:p-6 text-center group hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="mb-4 flex justify-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">
                                        1k+
                                    </p>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Active Users</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Growing community of streamers, organizers, and viewers using our platform daily.
                                </p>
                            </div>
                            
                            <div className="bg-muted/50 backdrop-blur-sm rounded-2xl border border-border shadow-lg p-4 sm:p-6 text-center group hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="mb-4 flex justify-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">
                                        50+
                                    </p>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Tournaments Hosted</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Professional tournaments and matches broadcasted with our cutting-edge production tools.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Floating Elements with Icons - Repositioned for single screen */}
                    <div className="absolute top-16 left-4 sm:left-8 hidden lg:block">
                        <div className="relative">
                            <Star className="w-5 h-5 text-primary animate-pulse" />
                            <div className="absolute inset-0 w-5 h-5 bg-primary/20 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    
                    <div className="absolute top-20 right-8 sm:right-16 hidden lg:block">
                        <Trophy className="w-4 h-4 text-accent animate-bounce" />
                    </div>
                    
                    <div className="absolute bottom-16 left-8 sm:left-16 hidden lg:block">
                        <div className="relative">
                            <Zap className="w-6 h-6 text-accent animate-pulse" />
                            <div className="absolute inset-0 w-6 h-6 bg-accent/20 rounded-full animate-ping delay-500"></div>
                        </div>
                    </div>

                    <div className="absolute top-1/3 right-4 sm:right-8 hidden sm:block">
                        <Gamepad2 className="w-4 h-4 text-primary/60 animate-pulse delay-1000" />
                    </div>

                    <div className="absolute bottom-1/4 left-4 sm:left-8 hidden sm:block">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-accent/60 animate-bounce delay-700" />
                    </div>
                </div>
                {/* Features Row (like screenshot) */}
                <div className="w-full max-w-6xl mx-auto mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-stretch gap-8 md:gap-0 pb-6">
                        {/* Feature 1 */}
                        <div className="flex-1 flex flex-col items-center text-center px-2">
                            <div className="mb-4 flex items-center justify-center">
                                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                                    <Search className="w-7 h-7 text-primary-foreground" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Set Up Match</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Input team data, match schedule, and prepare overlays before going live.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="flex-1 flex flex-col items-center text-center px-2">
                            <div className="mb-4 flex items-center justify-center">
                                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                                    <MonitorPlay className="w-7 h-7 text-primary-foreground" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Go Live</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Broadcast with real-time scoreboards, player stats, and smooth transitions.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="flex-1 flex flex-col items-center text-center px-2">
                            <div className="mb-4 flex items-center justify-center">
                                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                                    <SignalHigh className="w-7 h-7 text-primary-foreground" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Track Stats</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Monitor live rankings, dominators, and match highlights as the game unfolds.
                            </p>
                        </div>
                        {/* Feature 4 */}
                        <div className="flex-1 flex flex-col items-center text-center px-2">
                            <div className="mb-4 flex items-center justify-center">
                                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                                    <ThumbsUp className="w-7 h-7 text-primary-foreground" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Engage Viewers</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Deliver an immersive viewer experience that keeps fans coming back.
                            </p>
                        </div>
                    </div>
                    {/* Thin green line under features */}
                    <div className="w-full h-0.5 bg-primary/30 rounded-full" />
                </div>
                {/* Stats Cards Row - large, separated style */}
                <div className="w-full max-w-6xl mx-auto mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="flex flex-col items-center text-center bg-background rounded-2xl shadow-lg border border-border p-8 transition-all">
                            <div className="mb-4 flex items-center justify-center">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                                    <Gamepad2 className="w-7 h-7 text-primary" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-primary mb-1">5+</div>
                            <div className="text-lg font-bold text-foreground mb-2">Multiple Games</div>
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                Support for popular esports titles with seamless integration and real-time data tracking.
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="flex flex-col items-center text-center bg-background rounded-2xl shadow-lg border border-border p-8 transition-all">
                            <div className="mb-4 flex items-center justify-center">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                                    <Users className="w-7 h-7 text-primary" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-primary mb-1">1k+</div>
                            <div className="text-lg font-bold text-foreground mb-2">Active Users</div>
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                Growing community of streamers, organizers, and viewers using our platform daily.
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="flex flex-col items-center text-center bg-background rounded-2xl shadow-lg border border-border p-8 transition-all">
                            <div className="mb-4 flex items-center justify-center">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                                    <Trophy className="w-7 h-7 text-primary" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-primary mb-1">50+</div>
                            <div className="text-lg font-bold text-foreground mb-2">Tournaments Hosted</div>
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                Professional tournaments and matches broadcasted with our cutting-edge production tools.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
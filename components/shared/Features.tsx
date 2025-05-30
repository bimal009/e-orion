// components/Features.tsx - ENHANCED TO MATCH HERO STYLE
import React from 'react';
import { Trophy, Bolt, Eye, Gamepad2 } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <Trophy className="h-12 w-12 text-primary" />,
            title: "Live Rankings",
            description: "Real-time leaderboard with dynamic stats to keep the competition intense and transparent."
        },
        {
            icon: <Bolt className="h-12 w-12 text-primary" />,
            title: "Instant Highlights",
            description: "Catch game-changing moments as they happen with our automated highlight system."
        },
        {
            icon: <Eye className="h-12 w-12 text-primary" />,
            title: "Spectator Focused",
            description: "Crafted for fans and analysts with immersive visuals, overlays, and match breakdowns."
        },
        {
            icon: <Gamepad2 className="h-12 w-12 text-primary" />,
            title: "Pro-Level Production",
            description: "Elevate your esports event with overlays, scoreboards, and broadcast-ready assets."
        }
    ];

    return (
        <section className="relative overflow-hidden py-16 md:py-24">
            {/* Content Container */}
            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section - Matching Hero Style */}
                <div className="text-center mb-16">
                    <p className="inline-block text-sm font-medium bg-primary/10 text-secondary-foreground px-4 py-1.5 rounded-full mb-4">
                        Why Choose E-ORION
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                        Features Built for <span className="text-primary">Champions</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Powering the next generation of esports broadcasting and live match production.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="group relative p-8 rounded-2xl border border-border/50  backdrop-blur-sm  transition-all duration-300 flex flex-col items-center text-center hover:scale-105 hover:shadow-xl"
                        >
                            {/* Icon with Glow Effect */}
                            <div className="relative mb-6">
                                <div className="relative z-10">
                                    {feature.icon}
                                </div>
                                {/* Icon Glow */}
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300"></div>
                            </div>
                            
                            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Decorative Elements */}
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Ambient Effects */}
            <div className="absolute inset-0 -z-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/3 blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-500/3 blur-[80px]"></div>
            </div>
        </section>
    );
};

export default Features;
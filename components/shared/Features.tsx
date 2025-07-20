import React from 'react';
import { Trophy, Bolt, Eye, Gamepad2 } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <Trophy className="h-8 w-8 text-primary" />,
            title: "Live Rankings",
            description: "Real-time leaderboard with dynamic stats to keep the competition intense and transparent."
        },
        {
            icon: <Bolt className="h-8 w-8 text-primary" />,
            title: "Instant Highlights",
            description: "Catch game-changing moments as they happen with our automated highlight system."
        },
        {
            icon: <Eye className="h-8 w-8 text-primary" />,
            title: "Spectator Focused",
            description: "Crafted for fans and analysts with immersive visuals, overlays, and match breakdowns."
        },
        {
            icon: <Gamepad2 className="h-8 w-8 text-primary" />,
            title: "Pro-Level Production",
            description: "Elevate your esports event with overlays, scoreboards, and broadcast-ready assets."
        }
    ];

    return (
        <section className="py-16 md:py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6">
                        Why Choose E-ORION
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground">
                        Features Built for <span className="text-primary">Champions</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Powering the next generation of esports broadcasting and live match production.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="group relative p-6 lg:p-8 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-sm hover:bg-muted/80 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg"
                        >
                            {/* Icon Container */}
                            <div className="relative mb-4 p-3 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                                {feature.icon}
                            </div>
                            
                            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/3 blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-500/3 blur-[80px]"></div>
            </div>
        </section>
    );
};

export default Features;

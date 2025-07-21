import React from 'react';
import { Search, MonitorPlay, SignalHigh, ThumbsUp } from 'lucide-react';
import MouseGlow from './MouseGlow';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Search className="h-6 w-6" />,
            title: "Set Up Match",
            description: "Input team data, match schedule, and prepare overlays before going live."
        },
        {
            icon: <MonitorPlay className="h-6 w-6" />,
            title: "Go Live",
            description: "Broadcast with real-time scoreboards, player stats, and smooth transitions."
        },
        {
            icon: <SignalHigh className="h-6 w-6" />,
            title: "Track Stats",
            description: "Monitor live rankings, dominators, and match highlights as the game unfolds."
        },
        {
            icon: <ThumbsUp className="h-6 w-6" />,
            title: "Engage Viewers",
            description: "Deliver an immersive viewer experience that keeps fans coming back."
        }
    ];

    return (
        <section className="py-16 md:py-24">
         
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6">
                        How E-ORION Works
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Streamlined <span className='text-primary'>Esports</span> Production
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From match setup to live domination – our platform simplifies every step of your esports broadcast.
                    </p>
                </div>

                <div className="relative">
                    {/* Connector Line */}
                    <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 z-0"></div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                                        {step.icon}
                                    </div>
                                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all"></div>
                                </div>
                                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

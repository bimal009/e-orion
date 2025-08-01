import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

const CallToAction = () => {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden bg-muted">
                    
                    <div className="relative z-10">
                        <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6">
                            Ready to Go Live?
                        </p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
                            Power Your Next <span className="text-primary">Esports Event</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            Join elite organizers and streamers using E-ORION to deliver high-impact, data-rich broadcasts.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/events/create">
                                <Button size="lg" className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                                    Start a Match
                                </Button>
                            </Link>
                            <Link href="/demo">
                                <Button size="lg" variant="outline" className="rounded-full px-8 border-primary/20 hover:bg-primary/5">
                                    Watch Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
"use client"
import { useState } from "react";
import { Check, Star, Zap, Shield } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 0,
    period: "Forever free",
    description: "Perfect for getting started",
    features: [
      "Live Stream",
      "Live Score",
      "Live Standings",
      "Basic analytics",
      "Community support"
    ],
    cta: "Get Started",
    highlight: false,
    icon: Star,
    popular: false,
  },
  {
    name: "Pro",
    price: 19,
    period: "per month",
    description: "Best for growing teams",
    features: [
      "Everything in Starter",
      "Advanced analytics",
      "Priority email support",
      "Unlimited projects",
      "Team collaboration",
      "Custom themes",
      "API access"
    ],
    cta: "Start Pro Trial",
    highlight: true,
    icon: Zap,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 49,
    period: "per month",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Custom SLAs",
      "SSO & advanced security",
      "Dedicated account manager",
      "Onboarding & training",
      "24/7 priority support",
      "Custom integrations"
    ],
    cta: "Contact Sales",
    highlight: false,
    icon: Shield,
    popular: false,
  },
];

export default function PricingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.1),transparent_50%)]" />
      
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Trusted by 10,000+ teams worldwide
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary leading-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your team. Start free, upgrade when you're ready. 
            No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`relative group transition-all duration-300 ${
                    plan.highlight ? 'md:-translate-y-4' : ''
                  }`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`h-full rounded-3xl border transition-all duration-300 ${
                      plan.highlight
                        ? 'border-border bg-muted shadow-2xl shadow-primary/50'
                        : 'border-border bg-muted backdrop-blur-sm hover:bg-background hover:shadow-xl hover:shadow-border/50'
                    } ${
                      hoveredCard === index ? 'scale-105 shadow-2xl' : ''
                    }`}
                  >
                    <div className="p-8">
                      {/* Plan header */}
                      <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                          plan.highlight 
                            ? 'bg-primary' 
                            : 'bg-accent'
                        }`}>
                          <IconComponent className={`w-8 h-8 ${
                            plan.highlight ? 'text-primary-foreground' : 'text-accent-foreground'
                          }`} />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                        <p className="text-muted-foreground text-sm">{plan.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-8">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            ${plan.price}
                          </span>
                          {plan.price > 0 && (
                            <span className="text-muted-foreground text-lg">/{plan.period.split(' ')[1]}</span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{plan.period}</p>
                      </div>

                      {/* Features */}
                      <div className="mb-8">
                        <ul className="space-y-4">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                                plan.highlight 
                                  ? 'bg-primary' 
                                  : 'bg-accent'
                              }`}>
                                <Check className={`w-3 h-3 ${
                                  plan.highlight ? 'text-primary-foreground' : 'text-accent-foreground'
                                }`} />
                              </div>
                              <span className="text-foreground text-sm leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <button
                        className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                          plan.highlight
                            ? 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transform'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-lg'
                        }`}
                      >
                        {plan.cta}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional info */}
        <div className="text-center mt-16 max-w-3xl mx-auto">
          <div className="bg-muted rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Need something custom?
            </h3>
            <p className="text-muted-foreground mb-6">
              We offer flexible solutions for enterprise teams with unique requirements. 
              Get in touch to discuss custom pricing and features.
            </p>
            <button className="bg-background text-foreground border border-input px-6 py-3 rounded-xl font-medium hover:bg-muted transition-colors">
              Talk to Sales
            </button>
          </div>
        </div>

        {/* Trust indicators */}
     
      </div>
    </div>
  );
}
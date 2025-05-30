import { 
  Users, 
  Target, 
  Zap, 
  Award, 
  Globe,
  Calendar
} from 'lucide-react';

// About Us Page Component
const AboutUs = () => {
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "CEO & Founder",
      bio: "Former esports broadcaster with 8+ years in competitive gaming production.",
      image: "👨‍💼"
    },
    {
      name: "Sarah Kim",
      role: "CTO",
      bio: "Full-stack developer specializing in real-time data systems and streaming tech.",
      image: "👩‍💻"
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Design",
      bio: "UI/UX expert focused on creating immersive gaming experiences.",
      image: "👨‍🎨"
    },
    {
      name: "Emma Johnson",
      role: "Community Manager",
      bio: "Connecting with esports communities and gathering feedback from organizers.",
      image: "👩‍🎤"
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "10K+", label: "Active Users" },
    { icon: <Globe className="h-6 w-6" />, value: "50+", label: "Countries" },
    { icon: <Calendar className="h-6 w-6" />, value: "500+", label: "Events Hosted" },
    { icon: <Award className="h-6 w-6" />, value: "99.9%", label: "Uptime" }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Innovation First",
      description: "We push the boundaries of what's possible in esports broadcasting, constantly innovating to stay ahead."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Driven",
      description: "Our platform is built by gamers, for gamers. Every feature comes from community feedback and real needs."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Performance Focused",
      description: "Speed and reliability are non-negotiable. We ensure your broadcasts run smoothly every time."
    }
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <p className="inline-block text-sm font-medium bg-primary/10 text-secondary-foreground px-4 py-1.5 rounded-full mb-6">
              About E-ORION
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Revolutionizing <span className="text-primary">Esports</span> Broadcasting
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We're a passionate team of gamers, developers, and designers committed to empowering 
              esports organizers with cutting-edge broadcast tools and real-time analytics.
            </p>
          </div>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-[80px]"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To democratize professional esports broadcasting by providing accessible, 
              powerful tools that help organizers create spectacular viewing experiences. 
              We believe every tournament deserves production-quality broadcasts.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-2xl border border-border/50  backdrop-blur-sm">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl ">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind E-ORION, working to make esports broadcasting accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center p-6 rounded-2xl border border-border/50">
                <div className="text-4xl mb-4">{member.image}</div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs
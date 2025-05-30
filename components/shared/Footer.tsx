import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Github } from 'lucide-react'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const footerLinks = [
        {
            title: "Platform",
            links: [
                { label: "How It Works", href: "/how-it-works" },
                { label: "Pricing", href: "/pricing" },
                { label: "Contact", href: "/contact" },
            ]
        },
        {
            title: "Community",
            links: [
                { label: "Blog", href: "/blog" },
                { label: "Support", href: "/support" },
                { label: "Discord", href: "https://discord.gg" },
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
            ]
        }
    ]

    const socialLinks = [
        { icon: <Facebook size={18} />, href: "https://facebook.com", label: "Facebook" },
        { icon: <Twitter size={18} />, href: "https://twitter.com", label: "Twitter" },
        { icon: <Instagram size={18} />, href: "https://instagram.com", label: "Instagram" },
        { icon: <Github size={18} />, href: "https://github.com", label: "Github" }
    ]

    return (
        <footer className="backdrop-blur border-t border-border/40 mt-16">
            <div className="container mx-auto px-4 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-8">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">EO</span>
                            </div>
                            <span className="text-xl font-bold">E-ORION</span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
                            E-ORION empowers esports organizers with live match insights, team stats, and stunning broadcast overlays — all in one powerful production suite.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-9 w-9 flex items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-white transition-all duration-200"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {currentYear} E-ORION. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Terms
                        </Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Privacy
                        </Link>
                        <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

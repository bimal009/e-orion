"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Navitems from './Navitems'
import MobileNav from './Mobilenav'
import { Button } from '../ui/button'
import { LogOut, User } from 'lucide-react'
import Image from 'next/image'

const Header = () => {
    const { data: session, status } = useSession()

    const handleSignOut = () => {
        signOut({
            callbackUrl: '/' 
        })
    }

    return (
        <header className='sticky top-0 z-50 w-full bg-background border-b border-border/40 backdrop-blur-md'>
            <div className='container bg-background flex h-16 px-4 mx-auto items-center justify-between'>
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">EO</span>
                    </div>
                    <h1 className='text-xl font-bold text-foreground'>E-ORION</h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className='hidden md:flex md:flex-1 md:justify-center'>
                    <Navitems />
                </nav>

                {/* Actions */}
                <div className='flex items-center gap-3'>
                    {status === "loading" ? (
                        // Loading state
                        <div className="w-16 h-8 bg-muted animate-pulse rounded-full"></div>
                    ) : session ? (
                        // Logged in state
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2">
                                {session.user?.image ? (
                                    <Image 
                                        src={session.user.image} 
                                        alt="Profile" 
                                        className="w-8 h-8 rounded-full object-cover"
                                        width={32}
                                        height={32}
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                        <User size={16} className="text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            {/* Logout button */}
                            <Button 
                                onClick={handleSignOut}
                                size="sm" 
                                variant="outline"
                                className='rounded-full px-4 flex items-center gap-2 bg-secondary border-none text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300'
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    ) : (
                        // Not logged in state
                        <Link href="/signin">
                            <Button size="sm" className='bg-primary text-primary-foreground rounded-full px-4 hover:bg-primary/90'>
                                Sign In
                            </Button>
                        </Link>
                    )}
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}

export default Header
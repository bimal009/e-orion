import React from 'react'
import Link from 'next/link'
import Navitems from './Navitems'
import MobileNav from './Mobilenav'
import { Button } from '../ui/button'

const Header = () => {
    return (
        <header className='sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md'>
            <div className='container flex h-16 px-4 mx-auto items-center justify-between'>
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">EO</span>
                    </div>
                    <h1 className='text-xl font-bold'>E-ORION</h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className='hidden md:flex md:flex-1 md:justify-center'>
                    <Navitems />
                </nav>

                {/* Actions */}
                <div className='flex items-center gap-3'>
                    
                    <Link href="/sign-up">
                        <Button size="sm" className='bg-primary text-white rounded-full px-4 hover:bg-primary/90'>
                            Sign In
                        </Button>
                    </Link>
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}

export default Header
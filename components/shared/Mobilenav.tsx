'use client';
import React, { useState, useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import Navitems from './Navitems'
import Link from 'next/link'

const MobileNav = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return a placeholder that matches the hydrated version
        return (
            <div className='md:hidden'>
                <div className="flex items-center justify-center p-2 rounded-md opacity-50">
                    <Menu size={24} />
                </div>
            </div>
        );
    }

    return (
        <div className='md:hidden'>
            <Sheet>
                <SheetTrigger className="flex items-center justify-center p-2 rounded-md hover:bg-accent text-foreground" aria-label="Menu">
                    <Menu size={24} />
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col bg-background border-border">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-foreground">
                            <Link href="/" className='flex items-center gap-2'>
                                <p className='text-xl font-bold text-foreground'>E-ORION</p>
                            </Link>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mb-4">
                        <p className='text-sm text-muted-foreground mb-2 px-4'>Quick Links</p>
                        <Separator className="mb-4" />
                        <Navitems />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileNav
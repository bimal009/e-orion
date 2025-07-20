import Link from 'next/link'
import React from 'react'

const Navigations = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Live Now',
        href: '/live',
    },
    {
        label: 'About Us',
        href: '/about',
    },
    {
        label: 'Contact Us',
        href: '/contact',
    },
]

const Navitems = () => {
    return (
        <ul className='flex flex-col md:flex-row md:items-center md:gap-8 gap-6 px-4'>
            {Navigations.map((item) => (
                <li key={item.href}>
                    <Link href={item.href} className="hover:text-primary text-foreground transition-colors">
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default Navitems

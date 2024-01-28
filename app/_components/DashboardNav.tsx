'use client';

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { navItems } from './UserNav';

type Props = {}


export default function DashboardNav({}: Props) {

    const pathname = usePathname();

  return (
    <nav className='grid items-start gap-2 py-6 pr-2'>
        {navItems.map((navItem, index) => (
            <Link href={navItem.href} key={index}>
                <span className={cn("group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                 pathname === navItem.href ? "bg-accent" : ""
                )}>
                    <navItem.icon className='mr-2 h-4 w-4 text-primary' />
                    {navItem.name}
                </span>
            </Link>
        ))}
    </nav>
  )
}
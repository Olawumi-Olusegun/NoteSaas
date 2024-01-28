'use client';

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { CreditCard, DoorClosed, HomeIcon, Settings } from 'lucide-react';
import { LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";

type Props = {
    name: string;
    email: string;
    image: string;
}


export const navItems = [
    {
        name: "Home",
        href: "/dashboard",
        icon: HomeIcon,
    },
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
    {
        name: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
    },
];


export default function UserNav({name, email, image}: Props) {
  return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className='relative w-10 h-10 rounded-full'>
                    <Avatar className='h-10 w-10 rounded-full'>
                        <AvatarImage src={image} alt='user-avatar' />
                        <AvatarFallback>
                            O
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className='text-sm font-bold leading-none'>{name}</p>
                        <p className='text-xs leading-none '>{email}</p>
                    </div>
                </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {
                    navItems.map((navItem, index) => (
                        <DropdownMenuItem asChild key={index} className='cursor-pointer'>
                            <Link href={navItem.href}>
                            <span className='flex items-center'>
                                <navItem.icon className='mr-2 h-4 w-4 text-primary' />
                                {navItem.name}
                            </span>
                            </Link>
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className='w-full flex items-center cursor-pointer'>
                <LogoutLink>
                    <span className='flex items-center'>
                    <DoorClosed className='mr-2 h-4 w-4 text-primary' />
                    Logout
                    </span>
                </LogoutLink>
            </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
  )
}
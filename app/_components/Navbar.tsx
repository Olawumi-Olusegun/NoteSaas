

import Link from 'next/link'
import React from 'react'
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import {RegisterLink, LoginLink,} from "@kinde-oss/kinde-auth-nextjs/components";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import UserNav from './UserNav';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/dist/types';

type Props = {}

export default async function Navbar({}: Props) {

    const { isAuthenticated, getUser } = getKindeServerSession();

    const user =  await getUser() as KindeUser | null;

  return (
    <nav className='border-b bg-background h-[10vh] flex items-center'>
        <div className="container flex items-center justify-between">
            <Link href={`/`} className='font-bold text-3xl'>
                <h1><span className='text-primary'>Saas</span>App</h1>
            </Link>
            <div className="flex items-center gap-x-4">
                <ThemeToggle />
                <div className="flex items-center gap-x-4">
                    {
                    await isAuthenticated() 
                        ? (
                            <UserNav email={user?.email as string} name={user?.given_name  as string} image={user?.picture  as string} />
                        )
                        : (
                            <>
                        <LoginLink>
                            <Button>Sign In</Button>
                        </LoginLink>

                        <RegisterLink>
                            <Button variant="secondary">Sign Up</Button>
                        </RegisterLink>
                            </>
                        )
                    }
                    
                </div>
            </div>
        </div>
    </nav>
  )
}
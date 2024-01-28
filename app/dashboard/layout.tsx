import React, { PropsWithChildren } from 'react'
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import DashboardNav from '../_components/DashboardNav'
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';
import { stripe } from '@/lib/stripe';
import { unstable_noStore as noStore } from 'next/cache'

type DataProps = {
  email: string; 
  id: string; 
  firstName: string | undefined | null; 
  lastName: string | undefined | null; 
  profileImage: string | undefined | null;
}

export async function getData({email, id, firstName, lastName, profileImage, }: DataProps) {
  noStore();
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      stripeCustomerId: true,
    }
  });

  if(!user) {
    const name = `${firstName ?? ""} ${lastName ?? ""}`
    await prisma.user.create({
      data: { id, email, name }
    })
  }

  if(!user?.stripeCustomerId) {
    const data = await stripe.customers.create({ email });
    await prisma.user.update({
      where: { id },
      data: { stripeCustomerId: data.id, }
    });
  }

}

export default async function DashboardLayout({children}: PropsWithChildren) {
  
  const {getUser} = getKindeServerSession();
  
  const user = await getUser();

  if(!user?.id) {
    return redirect("/");
  }

  const data = {
    id: user.id as string,
    email: user.email as string,
    firstName: user.given_name as string,
    lastName: user.family_name as string,
    profileImage: user.picture as string,
  }

  await getData(data);

  return (
    <div className='flex flex-col space-y-6 h-[90vh]'>
        <div className="container grid flex-1 gap-8 md:grid-cols-[200px_1fr]">
            <aside className='hidden w-[200px] flex-col md:flex border-r'>
                <DashboardNav />
            </aside>
            <main>
                {children}
            </main>
        </div>
    </div>
  )
}
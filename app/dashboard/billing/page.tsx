import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {  CheckCircle2 } from 'lucide-react'
import React from 'react'
import prisma from '@/app/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getStripeSession, stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { StripePortalButton, StripeSubcriptionCreationButton } from '@/app/_components/SubmitButtons';




type Props = {}

const featuresItems = [
  {name: "Lorem Ipsom somethings"},
  {name: "Lorem Ipsom somethings"},
  {name: "Lorem Ipsom somethings"},
  {name: "Lorem Ipsom somethings"},
  {name: "Lorem Ipsom somethings"},
  {name: "Lorem Ipsom somethings"},
]

async function getData(userId: string) {
  const data = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        }
      }
    }
  })

  return data;
}

export default async function BillingPage({}: Props) {
  const {getUser} = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);


  async function createSubscription() {
    "use server";

    
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id
      },
      select: {
        stripeCustomerId: true,
      }
    })

    if(!dbUser?.stripeCustomerId) {
      throw new Error("Unable to get customer id")
    }


    const subscriptionUrl = await getStripeSession({
      customerId: dbUser?.stripeCustomerId,
      domainUrl: process.env.NODE_ENV === "production" ? `${process.env.PRODUCTION_URL}` : "http://localhost:3000",
      priceId: process.env.SUBSCRIPTION_PRICE_ID as string,
    })

    return redirect(subscriptionUrl);
  }

  async function createCustomerPortal() {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.user.stripeCustomerId as string,
      return_url: process.env.NODE_ENV === "production" ? `${process.env.PRODUCTION_URL}/dashboard` : "http://localhost:3000/dashboard",
    });

    return redirect(session.url);
  }

  if(data?.status) {
    return <div className='grid items-start gap-8'>
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className='text-2xl md:text-3xl'>Subscription</h1>
          <p className='text-lg text-muted-foreground'>Settings regarding your subscription</p>
        </div>
      </div>
      <Card className='w-full lg:w-2/3'>
        <CardHeader>
          <CardTitle className=''>Edit Subscription</CardTitle>
          <CardDescription>Click on the button below to change your payment details and view your statement at the same time</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCustomerPortal}>
            <StripePortalButton />
          </form>
        </CardContent>
      </Card>
    </div>
  }

  return (
    <div className='py-8'>
      <div className=" max-w-md mx-auto space-y-4">
        <Card className='flex flex-col'>
          <CardContent className='py-8'>
            <div className=''>
              <h3 className='inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary'>Monthly</h3>
            
            </div>
            <div className="mt-4 flex items-baseline text-6xl font-extrabold">
              $30 <span className='ml-1 text-2xl text-muted-foreground'>/mo</span>
            </div>
            <p className='mt-5 text-lg text-muted-foreground'>Write as many notes as possible you want for $30 per month</p>
          </CardContent>
          <div className="flex-1 flex flex-col justify-between px-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6 ">
            <ul className='space-y-4'>
              {featuresItems.map((featureItem, index) => (
                <li key={index} className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <CheckCircle2 className='h-6 w-6 text-green-500' />                    
                  </div>
                  <p className='ml-3 text-base'>{featureItem.name}</p>
                </li>
              ))}
            </ul>
            <form action={createSubscription} className='w-full'>
              <StripeSubcriptionCreationButton />
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
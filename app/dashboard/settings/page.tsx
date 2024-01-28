import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import prisma from "@/app/lib/db";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import {SubmitButtons} from '@/app/_components/SubmitButtons'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'


type Props = {}

export async function getData(userId: string) {
  noStore()
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      colorSchema: true,
    }
  })

  return data;
}

export default async function SettingsPage({}: Props) {

  const {getUser} = getKindeServerSession();

  const user = await getUser();

  if(!user?.id) {
    return redirect("/")
  }

  const data = await getData(user.id);

  async function settingsData(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const colorSchema = formData.get("colorSchema") as string;

    await prisma.user.update({
      where: {
        id: user?.id
      },
      data: {
        name: name ?? undefined,
        colorSchema: colorSchema ?? undefined,
      }
    });

    revalidatePath("/", "layout")
  }



  return (
    <div className='py-4 items-start gap-8'>
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className='text-2xl md:text-3xl'>Settings</h1>
          <p className='text-lg text-muted-foreground'>Your profile settings</p>
        </div>
      </div>
      <Card className='my-3'>
        <form action={settingsData}>
          
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>Please provide general information about yourself and save</CardDescription>
          </CardHeader>
          <CardContent>
            
            <div className='my-2'>
              <div className="my-1">
                <Label htmlFor='name'>Your Name:</Label>
                <Input type='text' defaultValue={data?.name ?? ""} required id='name' name='name' placeholder='Your Name' />
              </div>
            </div>

            <div className='space-y-2'>
              <div className="space-y-1">
                <Label htmlFor='email'>Your Email:</Label>
                <Input
                type='email'
                required
                id='email'
                name='email'
                placeholder='Your Email'
                defaultValue={data?.email ?? ""}
                disabled
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className="space-y-1">
                <Label htmlFor='colorSchema'>Color Scheme:</Label>
                <Select name='colorSchema' defaultValue={data?.colorSchema ?? ""}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="select a color"/> 
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Color</SelectLabel>
                    <SelectItem value='theme-rose'>Rose</SelectItem>
                    <SelectItem value='theme-blue'>Blue</SelectItem>
                    <SelectItem value='theme-orange'>Orange</SelectItem>
                    <SelectItem value='theme-green'>Green</SelectItem>
                    <SelectItem value='theme-violet'>Violet</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </CardContent>
          <CardFooter>
            <SubmitButtons />
          </CardFooter>
        </form>
      </Card>

    </div>
  )
}
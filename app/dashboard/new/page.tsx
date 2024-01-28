import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SubmitButtons } from '@/app/_components/SubmitButtons'
import prisma from "@/app/lib/db";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'

type Props = {}



export default async function NewNotePage({}: Props) {
    noStore();
    const {getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user?.id) {
        throw new Error("Unauthorized");
    }

    async function PostFormData(formData: FormData) {
        "use server";
    
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        await prisma.note.create({
            data: { userId: user?.id, title, description }
        });
    
    return redirect("/dashboard");
    }


  return (
    <div className='py-8 w-full'>
        <Card>
            <form action={PostFormData}>
                <CardHeader>
                    <CardTitle>New Note</CardTitle>
                    <CardDescription>Right here your can create your note</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-y-5'>
                    <div className='gap-y-2 flex flex-col'>
                        <Label htmlFor='title'>Title</Label>
                        <Input required type='text' id='title' name='title' placeholder='Title of note' />
                    </div>

                    <div className='gap-y-2 flex flex-col'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea required id='description' name='description' placeholder='Description of note' className='resize-none' />
                    </div>
                </CardContent>

                <CardFooter className='flex justify-between'>
                    <Button asChild variant="destructive">
                        <Link href={`/dashboard`}>Cancel</Link>
                    </Button>
                    <SubmitButtons />
                </CardFooter>

            </form>
        </Card>
    </div>
  )
}
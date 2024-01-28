import { SubmitButtons } from '@/app/_components/SubmitButtons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import React from 'react'
import prisma from "@/app/lib/db";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'

type Props = {
    params: {
        noteId: string;
    }
}

async function getData({userId, noteId}: {userId: string, noteId: string}) {
    noStore();
    const data = await prisma.note.findUnique({
        where: {
            id: noteId,
            userId
        },
        select: {
            id: true,
            title: true,
            description: true,
        }
    })

    return data;
}

export default async function DynamicNoteRoute({params: { noteId }}: Props) {

    const { getUser } = await getKindeServerSession();
    const user = await getUser();

    const data = await getData({userId: user?.id as string, noteId});

    async function postData(formData: FormData) {
        "use server";
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        await prisma.note.update({
            where: {
                id: data?.id,
                userId: user?.id,
            },
            data: {
                title: title ?? undefined,
                description: description ?? undefined,
            }
        })
        revalidatePath("/dashboard");

        return redirect("/dashboard");
    }




  return (
    <div className='py-8 w-full'>
        <Card>
            <form action={postData}>
                <CardHeader>
                    <CardTitle>Edit Note</CardTitle>
                    <CardDescription>Right here your can create your note</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-y-5'>
                    <div className='gap-y-2 flex flex-col'>
                        <Label htmlFor='title'>Title</Label>
                        <Input required defaultValue={data?.title ?? ""} type='text' id='title' name='title' placeholder='Title of note' />
                    </div>

                    <div className='gap-y-2 flex flex-col'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea required defaultValue={data?.description ?? ""} id='description' name='description' placeholder='Description of note' className='resize-none' />
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
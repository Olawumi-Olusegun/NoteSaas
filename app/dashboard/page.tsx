import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import prisma from "@/app/lib/db";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Edit, File } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DeleteNoteButton } from '../_components/SubmitButtons';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'

type Props = {}

async function getData(userId: string) {
  noStore();
    // const data = await prisma.note.findMany({
    //   where: { userId },
    //   orderBy: {
    //     createdAt: "desc"
    //   }
    // });
    // return data;

    const data = await prisma.user.findUnique({
      where: {id: userId},
      select: {
        Notes: true,
        Subscription: {
          select: {
            status: true,
          }
        }
      }
    })
    return data;
}

export default async function DashboardPage({}: Props) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function deleteNote(formData: FormData) {
    "use server";
    const noteId = formData.get("noteId") as string;

    await prisma.note.delete({
      where: { id: noteId }
    });

    revalidatePath("/dashboard");
}

  return (
    <div className='py-8 grid items-start gap-y-8'>
      <div className="flex flex-col gap-y-2 md:gap-y-0 md:flex-row items-center justify-between px-2">
        <div className='grid gap-1'>
          <h1 className='text-center md:text-start text-2xl md:text-3xl'>Your Notes</h1>
          <p className='text-sm md:text-lg text-muted-foreground'>Here you can see and create new notes</p>
        </div>
        {
            data?.Subscription?.status === "active"
            ? (
            <Button>
              <Link href={`/dashboard/new`}>Create a new Note</Link>
            </Button>

            )
            : (
              <Button>
              <Link href={`/dashboard/billing`}>Create a new Note</Link>
            </Button>
            )
          }
      </div>

    {data?.Notes.length === 0 ? (
      <>
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <File className='w-10 h-10 text-primary' />
          </div>
          <h2 className='mt-6 text-xl font-semibold'>You {`don't`} have any notes created </h2>
          <p className='mb-8 mt-2 text-centet text-sm leading-6 text-muted-foreground max-w-sm mx-auto'>You currently {`don't`} have any notes. Please create some so that you can see them right here. </p>
          
          {
            data?.Subscription?.status === "active"
            ? (
            <Button>
              <Link href={`/dashboard/new`}>Create a new Note</Link>
            </Button>

            )
            : (
              <Button>
              <Link href={`/dashboard/billing`}>Create a new Note</Link>
            </Button>
            )
          }
        </div>

      </>
    ) : <>
      <div className='flex flex-col gap-y-4'>
        {data?.Notes.map((noteItem) => (
          <Card key={noteItem.id} className='flex items-center justify-between p-4'>
            <div>
              <h2 className='font-semibold text-xl text-primary'>{noteItem.title}</h2>
              <p>
                  {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "full",
                }).format(new Date(noteItem.createdAt))}
              </p>
            </div>
              <div className='flex gap-x-4'>
                <Link href={`/dashboard/new/${noteItem.id}`}>
                  <Button variant="outline" size="icon" >
                    <Edit className='w-4 h-4' />
                  </Button>
                </Link>
                <form action={deleteNote}>
                    <Input type='hidden' name='noteId' value={noteItem.id} />
                    <DeleteNoteButton />
                </form>
              </div>
          </Card>
        ))}
      </div>
    </> }

    </div>
  )
}
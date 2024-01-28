'use client'
import { Button } from '@/components/ui/button';
import { Loader2, Trash } from 'lucide-react';
import React from 'react'
import { useFormStatus } from 'react-dom'

type Props = {}

export function SubmitButtons({}: Props) {
    const {pending} = useFormStatus();
  return (
    <>
        {pending  
        ? <Button disabled={pending} className='w-fit'>
            <Loader2 className='mr-2 w-4 h-4 animate-spin' /> Submitting...
        </Button>
        : <Button type='submit' className='w-fit'>Save</Button> }
    </>
  )
}

export function StripeSubcriptionCreationButton({}: Props) {
    const {pending} = useFormStatus();
  return (
    <>
        {pending  
        ? <Button disabled={pending} className='w-full'>
            <Loader2 className='mr-2 w-4 h-4 animate-spin' /> Submitting...
        </Button>
        : <Button type='submit' className='w-full'>Create Subscription</Button> }
    </>
  )
}

export function StripePortalButton({}: Props) {
    const {pending} = useFormStatus();
  return (
    <>
        {pending  
        ? <Button disabled={pending} className='w-fit'>
            <Loader2 className='mr-2 w-4 h-4 animate-spin' /> Submitting...
        </Button>
        : <Button type='submit' className='w-fit'>View Payment Details</Button> }
    </>
  )
}

export function DeleteNoteButton({}: Props) {
    const {pending} = useFormStatus();
  return (
    <>
        {pending  
        ? <Button disabled variant="destructive" className='w-fit items-center justify-center'>
            <Loader2 className='w-4 h-4 animate-spin' />
        </Button>
        : <>
            <Button variant="destructive" size="icon" type='submit' >
              <Trash className='w-4 h-4' />
            </Button>
        </> }
    </>
  )
}
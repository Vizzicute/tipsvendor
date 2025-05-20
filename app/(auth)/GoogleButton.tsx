"use client";

import LoadingButton from '@/components/LoadingButton'
import { useGoogleAuth } from '@/lib/react-query/queriesAndMutations'
import Image from 'next/image'
import React from 'react'

const GoogleButton = ({ children }: { children: React.ReactNode }) => {


    const { mutateAsync: googleAuth, isPending: isLoading } = useGoogleAuth();

    const handleGoogleAuth = async () => {
        const session = await googleAuth();
        return session;
    }

  return (
    <LoadingButton
        loading={isLoading}
        onClick={handleGoogleAuth}
        variant={'outline'}
        className='flex ga-4 justify-center rounded-full w-full'
    >
        <Image
        src={'/google.png'}
        alt={'google'}
        width={24}
        height={24}
        />
        {children}
    </LoadingButton>
  )
}

export default GoogleButton
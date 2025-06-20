"use client";

import { getSingleSeoPage } from '@/lib/appwrite/fetch'
import { notFound, useParams } from 'next/navigation'
import EditPageForm from '../EditPageForm'

export default async function Page() {
  const { pageId } = useParams();

  if (typeof pageId !== 'string') {
    notFound();
  }

  const seoPage = await getSingleSeoPage(pageId);

  if(!seoPage) notFound();
  return (
    <div className='space-y-2'>
      <div className='w-full flex items-center justify-start'>
      <h1 className="text-2xl font-bold tracking-tight">Edit Page Content</h1>
      </div>

      <EditPageForm page={seoPage}/>
    </div>
  )
}
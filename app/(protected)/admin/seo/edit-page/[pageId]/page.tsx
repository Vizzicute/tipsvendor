import { getSingleSeoPage } from '@/lib/appwrite/fetch'
import { notFound } from 'next/navigation'
import EditPageForm from '../EditPageForm'

interface pageProps {
    params: { pageId: string }
}

export default async function Page({params: { pageId }}: pageProps) {
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
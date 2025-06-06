import React, { cache } from 'react'
import { getSingleBlog } from '@/lib/appwrite/fetch'
import { notFound } from 'next/navigation'
import EditBlogForm from '../EditBlogForm'
import { useParams } from 'next/navigation'
export default async function Page() {
    const params = useParams();
    const blogId = params?.blogId;

    if (typeof blogId !== 'string') {
      notFound();
    }

    const blog = await getSingleBlog(blogId);

    if(!blog) notFound();
  return (
    <div className='space-y-2'>
      <div className='w-full flex items-center justify-start'>
      <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
      </div>

      <EditBlogForm blog={blog}/>
    </div>
  )
}
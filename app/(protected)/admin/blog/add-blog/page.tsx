import React from 'react'
import AddBlogForm from '../AddBlogForm'

const page = () => {
  return (
    <div className='space-y-2'>
      <div className='w-full flex items-center justify-start'>
      <h1 className="text-2xl font-bold tracking-tight">Add Blog Post</h1>
      </div>

      <AddBlogForm />
    </div>
  )
}

export default page

"use client";

import { DialogTrigger } from './ui/dialog';
import { Plus } from 'lucide-react';
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import AddBlogCategoryForm from '@/app/(protected)/admin/blog/AddBlogCategoryForm';

const AddBlogCategory = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-secondary hover:bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Add Blog Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%] sm:max-h-[40%] sm:h-fit">
        <DialogHeader>
          <DialogTitle className="text-center text-stone-600">
            Add Blog Category           
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll">
          <AddBlogCategoryForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddBlogCategory

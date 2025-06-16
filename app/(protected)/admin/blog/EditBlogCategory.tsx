"use client";

import { DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditBlogCategoryForm from "@/app/(protected)/admin/blog/EditBlogCategoryForm";
import { Models } from "appwrite";

const EditBlogCategory = ({ category }: { category: Models.Document }) => {
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}> Edit Blog Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[40%] sm:max-h-[40%] sm:h-fit">
        <DialogHeader>
          <DialogTitle className="text-center text-stone-600">
            Edit Blog Category
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll">
          <EditBlogCategoryForm category={category} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogCategory;

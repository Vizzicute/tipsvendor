"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEditBlogCategory } from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Models } from "appwrite";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const EditBlogCategoryForm = ({category}: {category: Models.Document}) => {
  const queryClient = useQueryClient();
  const formSchema = z.object({
    name: z.string().nonempty("Add Post Title."),
    slug: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const { mutateAsync: editBlogCategory, isPending: isLoading } =
    useEditBlogCategory();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      values.slug = generateSlug(values.name);
      const updatedBlogCategory = await editBlogCategory({
        category: values,
        blogCategoryId: category.$id,
      });
      if (!updatedBlogCategory) {
        toast("Failed. Please try again.");
      } else {
        toast("Category added successfully.");
        await queryClient.setQueryData(["categories"], (oldData: any) => [...oldData, updatedBlogCategory]);
      }
    } catch (error) {
      console.error("Error adding blog category:", error);
      toast("Failed. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full gap-4 p-4 flex flex-col justify-center items-center"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full md:mt-2">
              <FormControl>
                <div className="w-full flex flex-col gap-2">
                  <Input
                    type="text"
                    placeholder="Blog Title"
                    className="bg-slate-100 rounded-none border-gray-500 border-0 border-b-1 focus-none"
                    {...field}
                  />
                  <div className="w-full flex flex-row flex-nowrap items-center justify-start gap-0 py-2">
                    <span className="p-1 font-oswald">Slug: </span>
                    <span className="bg-gray-200 rounded-l-sm py-2 ps-2 text-[12px] w-fit font-code">
                      {process.env.NEXT_PUBLIC_APP_URL}/blog/
                    </span>
                    <span className="bg-gray-100 rounded-r-sm flex-1 text-[12px] flex py-2 pe-2 font-code">
                      {generateSlug(field.value)}
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isLoading}
          type="submit"
          className="rounded-lg px-10 capitalize"
        >
          Edit Category
        </LoadingButton>
      </form>
    </Form>
  );
};

export default EditBlogCategoryForm;

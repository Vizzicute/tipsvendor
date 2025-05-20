"use client";

import LoadingButton from "@/components/LoadingButton";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditPage } from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Models } from "appwrite";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

interface EditPageFormProps {
  page: Models.Document;
}

const EditPageForm = ({ page }: EditPageFormProps) => {
  const queryClient = useQueryClient();
  const editorRef = React.useRef<{ input: string }>(null);
  const [keywordsInput, setKeywordsInput] = useState(page.keywords.join(', '));

  const formSchema = z.object({
    title: z.string().nonempty("Add Post Title."),
    h1tag: z.string(),
    content: z.string(),
    url: z.string(),
    description: z.string().min(100, "Must be more than 100 Characters"),
    keywords: z.array(z.string()).nonempty("Select at least one category."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page.title,
      h1tag: page.h1tag,
      url: page.url,
      content: page.content,
      keywords: page.keywords,
      description: page.description,
    },
  });

  const { mutateAsync: editpage, isPending: isLoading } = useEditPage();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      values.content = editorRef.current?.input || "";
      // Split keywords only when submitting
      values.keywords = keywordsInput.split(',').map(k => k.trim()).filter(Boolean);

      const newpage = await editpage({
        page: values,
        pageId: page.$id,
      });

      if (!newpage) {
        toast("Failed. Please try again.");
      } else {
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        toast.success("Page Updated");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again.");
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
          name="title"
          render={({ field }) => (
            <FormItem className="w-full md:mt-2">
              <Label>Page Title</Label>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter page title"
                  className="bg-slate-100 rounded-none border-gray-500 border-0 border-b-1 focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label>Page URL</Label>
              <FormControl>
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full flex flex-row flex-nowrap items-center justify-start gap-0 py-2">
                    <span className="bg-gray-200 rounded-l-sm p-2 w-fit text-[12px] md:text-sm font-code">
                      {process.env.NEXT_PUBLIC_APP_URL}/
                    </span>
                    <Input
                      type="text"
                      placeholder="e.g., over-1-5"
                      className="bg-gray-100 rounded-r-sm rounded-l-none flex-1 text-[12px] flex p-2 font-code"
                      {...field}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full md:mt-2">
              <Label>Page Description</Label>
              <FormControl>
                <Textarea
                  placeholder="Enter page description (minimum 100 characters)"
                  className="bg-slate-100 rounded-none border-gray-500 border-0 border-b-1 focus-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label>Keywords</Label>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter keywords separated by commas"
                  className="bg-slate-100 rounded-none border-gray-500 border-0 border-b-1 focus-none"
                  value={keywordsInput}
                  onChange={(e) => {
                    setKeywordsInput(e.target.value);
                    // Update form value with current array
                    field.onChange(e.target.value.split(',').map(k => k.trim()).filter(Boolean));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="h1tag"
          render={({ field }) => (
            <FormItem className="w-full md:mt-2">
              <Label>H1 Tag</Label>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter H1 tag text"
                  className="bg-slate-100 rounded-none border-gray-500 border-0 border-b-1 focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full md:mt-2">
              <Label>Page Content</Label>
              <FormControl>
                <SimpleEditor
                  ref={editorRef}
                  content={field.value}
                  onChange={(newContent: string) => {
                    editorRef.current = { input: newContent };
                    field.onChange(newContent);
                  }}
                />
              </FormControl>
                <Label className="mt-0 pt-0">Content Size: {field.value.length.toString()}</Label>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loading={isLoading}
          type="submit"
          className="rounded-lg px-10 bg-amber-600 capitalize"
        >
          Save Changes
        </LoadingButton>
      </form>
    </Form>
  );
};

export default EditPageForm;

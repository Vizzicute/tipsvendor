"use client";

import LoadingButton from "@/components/LoadingButton";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fileUrl, uploadFile } from "@/lib/appwrite/media";
import { useAddBlog } from "@/lib/react-query/queriesAndMutations";
import { truncate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CommandGroup } from "cmdk";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useBlogCategories } from "@/lib/react-query/queries";

const STORAGE_KEY = "draft-blog-post";

const AddBlogForm = () => {
  const { data: blogCategories } = useBlogCategories();
  const date = new Date();

  // Get components with padding
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const datetimeLocalValue = `${year}-${month}-${day}T${hours}:${minutes}`;

  const [status, setStatus] = useState("published");

  const queryClient = useQueryClient();
  const editorRef = React.useRef<{ input: string }>(null);

  const formSchema = z.object({
    title: z.string().nonempty("Add Post Title."),
    content: z.string(),
    slug: z.string(),
    status: z.string(),
    blogCategories: z
      .array(z.string())
      .nonempty("Select at least one category."),
    publishedAt: z.coerce.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date/time format.",
    }),
    featuredImage: z.union([z.instanceof(File), z.string()]).refine(
      (val) => {
        if (typeof val === "string") return val.length > 0;
        if (val instanceof File) return val.size > 0;
        return false;
      },
      {
        message: "Add a featured Image.",
      }
    ),
  });
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      blogCategories: [""],
      publishedAt: datetimeLocalValue,
      featuredImage: "",
      status: "published",
    },
  });

  const [previewUrl, setPreviewUrl] = useState(
    "/featuredImagePlaceholder.jpeg"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    field.onChange(file);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const { mutateAsync: addBlog, isPending: isLoading } = useAddBlog();
  const skipSaveRef = useRef(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.featuredImage instanceof File) {
        const fileId = await uploadFile(values.featuredImage);
        const featuredImageUrl = await fileUrl(fileId);
        values.featuredImage = featuredImageUrl;

        values.slug = generateSlug(values.title);
        values.status = status;
        values.content = editorRef.current?.input || "";

        const newBlog = await addBlog({ blog: values, fileId: fileId });

        if (!newBlog) {
          toast("Failed. Please try again.");
        } else {
          skipSaveRef.current = true;

          form.reset();

          setTimeout(() => {
            skipSaveRef.current = false;
          }, 0);

          localStorage.removeItem(STORAGE_KEY);
          setStatus("published");
          setPreviewUrl("/featuredImagePlaceholder.jpeg");
          await queryClient.setQueryData(["documents"], (oldData: any) => [...oldData, newBlog]);

          toast.success(
            status === "draft"
              ? "Blog Post Saved As Draft"
              : status === "scheduled"
              ? "Blog Post Scheduled"
              : "Blog Post Created"
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again.");
    }
  }

  // Auto-save/restore logic
  useEffect(() => {
    const subscription = form.watch(() => {
      if (!skipSaveRef.current) {
        setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(form.getValues()));
        }, 500);
      }
    });

    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        form.reset(parsedDraft);
        if (
          parsedDraft.featuredImage &&
          typeof parsedDraft.featuredImage === "string"
        ) {
          setPreviewUrl(parsedDraft.featuredImage);
        }
      } catch (err) {
        console.error("Failed to load saved draft:", err);
      }
    }

    const handleBeforeUnload = () => {
      const values = form.getValues();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      subscription.unsubscribe();
    };
  }, [form]);

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
                    <span className="bg-gray-200 rounded-l-sm p-2 w-fit font-code">
                      {process.env.NEXT_PUBLIC_APP_URL}/blog/
                    </span>
                    <span className="bg-gray-100 rounded-r-sm flex-1 text-[12px] flex p-2 font-code">
                    {truncate(generateSlug(field.value), 50)}
                    </span>
                  </div>
                </div>
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
              <FormMessage />
              <Label className="mt-0 pt-0">Content Size: {field.value.length.toString()}/10000</Label>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featuredImage"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="space-y-2 flex justify-center items-center flex-col">
                  <Label>Featured Image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e, field)}
                    className="hidden"
                  />

                  <div
                    onClick={handleImageClick}
                    className="cursor-pointer w-full max-w-[90%] h-fit flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Image Preview"
                        className="object-contain max-w-full rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400">
                        Click to upload image
                      </span>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="blogCategories"
          render={({ field }) => {
            const [open, setOpen] = useState(false);

            const handleCategoryChange = useCallback((itemId: string) => {
              const currentValue = field.value || [];
              const newValue = currentValue.includes(itemId)
                ? currentValue.filter((id) => id !== itemId)
                : [...currentValue, itemId];
              field.onChange(newValue);
            }, [field]);

            return (
              <FormItem className="w-full">
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {field.value?.filter(Boolean).length > 0
                          ? field.value
                              .map(
                                (id) =>
                                  blogCategories?.find(
                                    (item) => item.$id === id
                                  )?.name
                              )
                              .filter(Boolean)
                              .join(", ")
                          : "Select Blog Categories"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search categories..." />
                        <CommandList>
                          <CommandGroup>
                            {blogCategories?.map((item) => (
                              <CommandItem
                                key={item.$id}
                                onSelect={() => handleCategoryChange(item.$id)}
                                className="flex items-center justify-between"
                              >
                                <span>{item.name}</span>
                                <div
                                  role="checkbox"
                                  aria-checked={field.value?.includes(item.$id)}
                                  className={cn(
                                    "h-4 w-4 rounded border border-primary",
                                    field.value?.includes(item.$id) && "bg-primary"
                                  )}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCategoryChange(item.$id);
                                  }}
                                >
                                  {field.value?.includes(item.$id) && (
                                    <svg
                                      className="h-4 w-4 text-primary-foreground text-center"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="w-full flex justify-between items-center p-2 mt-3">
          <div className="flex flex-col gap-1">
            <span className="md:text-lg text-sm font-semibold">
              Submit Blog Post As:
            </span>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full md:mt-2">
                  <FormControl>
                    <div className="w-full flex flex-col gap-2">
                      <RadioGroup
                        defaultValue={field.value} //change to field.value in editform
                        onValueChange={(val) => {
                          form.setValue("status", val);
                          setStatus(val);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            className="border-1 border-primary"
                            value="draft"
                            id="r1"
                          />
                          <Label htmlFor="r1">Draft</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            className="border-1 border-primary"
                            value="published"
                            id="r2"
                          />
                          <Label htmlFor="r2">Publish</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            className="border-1 border-primary"
                            value="scheduled"
                            id="r3"
                          />
                          <Label htmlFor="r3">Schedule Publish</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row p-2 gap-2 items-center">
            {status === "scheduled" && (
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        placeholder="Date And Time"
                        className="w-full bg-slate-100 rounded-none border-gray-500 border-0 border-b-1 focus-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <LoadingButton
              loading={isLoading}
              type="submit"
              className={`rounded-lg px-10 ${
                status === "scheduled" && "bg-amber-700"
              } ${status === "draft" && "bg-cyan-600"} capitalize`}
            >
              {status === "draft"
                ? "Save as Draft"
                : status === "scheduled"
                ? "Schedule Publish"
                : "Publish"}
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddBlogForm;

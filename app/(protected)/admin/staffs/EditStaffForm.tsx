"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  africanCountries,
  americanCountries,
  asianCountries,
  europeanCountries,
  roles,
} from "@/data";
import { useEditStaff } from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getCurrentUser } from "@/lib/appwrite/api";

const EditStaffForm = ({ staff }: { staff: any }) => {
  const queryClient = useQueryClient();

  const formSchema = z.object({
    name: z.string().nonempty("Add name."),
    email: z.string().email(),
    country: z.string().nonempty("Select Country."),
    role: z.string().nonempty("Select Role."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staff.name,
      email: staff.email,
      country: staff.country ? staff.country : "",
      role: staff.role,
    },
  });
  const { mutateAsync: editstaff, isPending: isLoading } = useEditStaff();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newstaff = await editstaff({
      staff: values,
      accountId: staff.$id,
    });

    if (!newstaff) {
      return toast("Failed. Please try again.");
    } else {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      await getCurrentUser();
      toast.success("staff Updated");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full gap-4 p-4 flex flex-wrap justify-around items-start"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full md:mt-2">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Home Team"
                  className="bg-stone-100 rounded-sm border-secondary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full md:mt-2">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Email"
                  className="bg-stone-100 rounded-sm border-secondary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      <SelectLabel>European Countries</SelectLabel>
                      {europeanCountries.map((data) => (
                        <SelectItem key={data.name} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                      <SelectLabel>African Countries</SelectLabel>
                      {africanCountries.map((data) => (
                        <SelectItem key={data.name} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                      <SelectLabel>Americans</SelectLabel>
                      {americanCountries.map((data) => (
                        <SelectItem key={data.name} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                      <SelectLabel>Asian Countries</SelectLabel>
                      {asianCountries.map((data) => (
                        <SelectItem key={data.name} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary">
                    <SelectValue placeholder="League" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      <SelectLabel>Staff Role</SelectLabel>
                      {roles.map((data) => (
                        <SelectItem key={data} value={data}>
                          {data}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isLoading}
          type="submit"
          className="max-w-[30%] text-stone-100 rounded-lg uppercase"
        >
          Update
        </LoadingButton>
      </form>
    </Form>
  );
};

export default EditStaffForm;

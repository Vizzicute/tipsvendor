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
import { useAddUser } from "@/lib/react-query/queriesAndMutations";
import { newStaffMail } from "@/lib/utils/sendNewStaffMail";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getCurrentUser } from "@/lib/appwrite/api";

const AddStaffForm = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: addUser, isPending: isLoading } = useAddUser();

  const formSchema = z.object({
    name: z.string().nonempty("Add name."),
    email: z.string().email(),
    country: z.string().nonempty("Select Country."),
    role: z.string().nonempty("Select Role."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      role: "user",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const staffRole = values.role.replace(/_/g, " ");
    const newStaff = await addUser(values);

    if (!newStaff) {
      return toast("Failed. Please try again.");
    } else {
      toast.success("New Staff Added");
      await newStaffMail(
        values.name,
        values.email,
        `${process.env.NEXT_PUBLIC_APP_URL}/new-staff/${values.email}`,
        staffRole
      );
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      await getCurrentUser();
      return;
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
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Name"
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
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="email"
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
            <FormItem className="w-[48%]">
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
            <FormItem className="w-[48%]">
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
          className="max-w-[30%] text-stone-100 rounded-sm uppercase"
        >
          Add Staff
        </LoadingButton>
      </form>
    </Form>
  );
};

export default AddStaffForm;

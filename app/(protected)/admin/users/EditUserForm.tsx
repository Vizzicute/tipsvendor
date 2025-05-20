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
} from "@/data";
import { useEditUser } from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface EditUserFormProps {
  user: any;
}

const EditUserForm = ({ user }: EditUserFormProps) => {
  const queryClient = useQueryClient();

  const formSchema = z.object({
    name: z.string().nonempty("Add name."),
    email: z.string().email(),
    country: z.string().nonempty("Select Country."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      country: user.country ? user.country : "",
    },
  });

  const { mutateAsync: editUser, isPending: isLoading } = useEditUser();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedUser = await editUser({
      user: { ...values, role: "user" },
      userId: user.$id,
    });

    if (!updatedUser) {
      return toast("Failed. Please try again.");
    } else {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("User Updated");
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
            <FormItem className="w-full">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>African Countries</SelectLabel>
                    {africanCountries.map((country) => (
                      <SelectItem key={country.value} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>American Countries</SelectLabel>
                    {americanCountries.map((country) => (
                      <SelectItem key={country.value} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Asian Countries</SelectLabel>
                    {asianCountries.map((country) => (
                      <SelectItem key={country.value} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>European Countries</SelectLabel>
                    {europeanCountries.map((country) => (
                      <SelectItem key={country.value} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isLoading}
          type="submit"
          className="w-full text-stone-100 rounded-sm uppercase"
        >
          Update User
        </LoadingButton>
      </form>
    </Form>
  );
};

export default EditUserForm;

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
import { useAddUser } from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getCurrentUser } from "@/lib/appwrite/api";
import { updateCollectionCounts } from "@/lib/appwrite/update";
import { getCollectionCounts } from "@/lib/appwrite/fetch";

const AddUserForm = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: addUser, isPending: isLoading } = useAddUser();
  const {data: oldData} = useQuery({
    queryKey: ["collectionCounts"],
    queryFn: () => getCollectionCounts("user"),
  });
  const formSchema = z.object({
    name: z.string().nonempty("Add name."),
    email: z.string().email(),
    country: z.string().nonempty("Select Country."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newUser = await addUser({ ...values, role: "user" });

    if (!newUser) {
      return toast("Failed. Please try again.");
    } else {
      toast.success("New User Added");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      await getCurrentUser();
      if (oldData) {
        await updateCollectionCounts({
          users: oldData?.counts + 1
        }, oldData?.$id);
      }
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
            <FormItem className="w-full">
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>African Countries</SelectLabel>
                    {africanCountries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>American Countries</SelectLabel>
                    {americanCountries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Asian Countries</SelectLabel>
                    {asianCountries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>European Countries</SelectLabel>
                    {europeanCountries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
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
          Add User
        </LoadingButton>
      </form>
    </Form>
  );
};

export default AddUserForm;

"use client";

import React from "react";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { useAddResult } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AddResultProps {
  prediction: any;
}

const AddResult = ({ prediction }: AddResultProps) => {
  const formSchema = z.object({
    homescore: z.string().nonempty("Input Home Score."),
    awayscore: z.string().nonempty("Input Away Score."),
    status: z.string().nonempty("Select Result Type."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homescore: prediction.homescore,
      awayscore: prediction.awayscore,
      status: prediction.status,
    },
  });

  const queryClient = useQueryClient();

  const { mutateAsync: addResult, isPending: isLoading } =
      useAddResult();

  async function onSubmit(values: z.infer<typeof formSchema>) {
      const predictionResult = await addResult({
        prediction: values,
        gameId: prediction.$id,
      });

      if (!predictionResult) {
        return toast("Failed. Please try again.");
      } else {
        queryClient.invalidateQueries({ queryKey: ["predictions"] });
        toast.success("Result Added");
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
          name="homescore"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[30%] md:w-[30%]">
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Home Team"
                  className="bg-stone-100 rounded-sm border-secondary focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="awayscore"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[30%] md:w-[30%]">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Away Team"
                  className="bg-stone-100 rounded-sm border-secondary focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[25%]">
              <FormControl>
                <Select value={field.value === "n/a" ? undefined : field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary focus-none">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="win">Win</SelectItem>
                      <SelectItem value="loss">Loss</SelectItem>
                      <SelectItem value="void">Void</SelectItem>
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
          className="max-w-fit text-stone-100 rounded-lg uppercase"
        >
          Submit Prediction
        </LoadingButton>
      </form>
    </Form>
  );
};

export default AddResult;

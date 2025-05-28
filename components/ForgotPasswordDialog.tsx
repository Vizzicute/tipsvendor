"use client";
import React from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./LoadingButton";

const formSchema = z.object({
  email: z.string().email(),
});

const ForgotPasswordDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    // Simulate an API call to reset password
    console.log("Reset password for:", data.email);
    // Here you would typically call your API to handle the password reset
    // For example: await api.resetPassword(data.email);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="w-full ps-4 text-start font-inter text-sm text-red-600 font-semibold">
          Forgot Your Password?
        </span>
      </DialogTrigger>
      <DialogHeader className="text-center">Forgot Password</DialogHeader>
      <DialogContent className="w-96">
        <h2 className="font-semibold">Forgot Password</h2>
        <p className="text-sm text-gray-500">
          Please enter your email address to reset your password.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="bg-stone-100 rounded-full border-none focus-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              loading={false}
              type="submit"
              className="w-full bg-amber-600 text-stone-100 rounded-full uppercase"
            >
              Submit
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;

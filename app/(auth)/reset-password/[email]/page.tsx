"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/LoadingButton";
import { toast } from "sonner";
import { getSingleUserByEmail } from "@/lib/appwrite/fetch";
import Link from "next/link";
import Logo from "@/components/Logo";
import { PasswordInput } from "@/components/PasswordInput";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const { email: rawEmail } = useParams() as { email: string };
  const email = decodeURIComponent(rawEmail);
  if (!email) {
    console.error("Missing email in URL parameters");
    return <div className="text-red-500">Email is missing in the URL</div>;
  }
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = await getSingleUserByEmail(email);
    const userId = user?.$id;
    const accountId = user?.accountId;
    if (!userId || !accountId) {
      toast.error("User not found. Please check your email address.");
      console.error("User not found");
      return;
    }
    setIsLoading(true);
    try {
      // Call your API route to reset the password
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: accountId, password: values.password }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success("Password reset successful! Please log in.");
        router.push("/login");
      } else {
        toast.error(
          result.error || "Failed to reset password. Please try again."
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full space-y-4">
      <Link href={"/"}>
        <Logo width={100} />
      </Link>
      <h1 className="font-lilita-one w-full text-center text-lg text-stone-500">
        Reset Your Password
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-sm"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    type="password"
                    placeholder="New Password"
                    className="bg-stone-100 rounded-full border-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    type="password"
                    placeholder="Confirm New Password"
                    className="bg-stone-100 rounded-full border-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            type="submit"
            loading={isLoading}
            className="w-full text-stone-100 rounded-full uppercase"
          >
            Reset Password
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}

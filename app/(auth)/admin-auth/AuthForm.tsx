"use client";

import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { redirect } from "next/navigation";

const AuthForm = () => {
  const { checkAuthUser, isLoading: isUserLoading, user: authUser } = useUserContext();
  const { mutateAsync: signInAccount, isPending: isLoading } =
    useSignInAccount();

  const formSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleLogin = async (user: z.infer<typeof formSchema>) => {
    const session = await signInAccount(user);

    if (!session) {
      toast("Login Failed.");

      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn && authUser.role !== "user") {
      form.reset();
      redirect("/admin");
    }
    else if (isLoggedIn && authUser.role === "user") {
        form.reset();
        toast("Unauthorized Login! Redirecting to User Dashboard");
        redirect("/dashboard");
    }
    else {
      toast("Login Failed. Please try again.");

      return;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-stone-100 rounded-[2px] border-none focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  type="password"
                  placeholder="Password"
                  className="bg-stone-100 rounded-[2px] border-none focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isLoading || isUserLoading}
          type="submit"
          className="w-full text-primary bg-secondary hover:bg-secondary hover:opacity-90 rounded-[2px] uppercase"
        >
          Login
        </LoadingButton>
      </form>
    </Form>
  );
};

export default AuthForm;

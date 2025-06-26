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
import { useUserContext } from "@/context/AuthContext";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { verificationMail } from "@/lib/utils/verificationMail";
import { useMutation } from "@tanstack/react-query";
import { notifyNewUser } from "@/lib/appwrite/notificationTriggers";
import { useCurrentUser } from "@/lib/react-query/queries";

const RegisterForm = () => {
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningInUser } =
    useSignInAccount();
  const { data: user, isLoading: isFetchingUser } = useCurrentUser();

  // Add mutation for verificationMail
  const { mutateAsync: verifyMail, isPending: isVerifyingMail } = useMutation({
    mutationFn: async ({
      email,
      name,
      link,
    }: {
      email: string;
      name: string;
      link: string;
    }) => verificationMail(email, name, link),
  });

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast("Registration Failed. Please try again.");
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast("Registration Failed. Please try again");
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn && user) {
      await verifyMail({
        email: values.email,
        name: values.name ? values.name : "",
        link: `${process.env.NEXT_PUBLIC_APP_URL}/verification/${user.$id}`,
      });
      await notifyNewUser(user.$id, user.name);
      toast.success(
        "Registration successful! Please check your email for verification."
      );
      form.reset();
      redirect("/dashboard");
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Name"
                  className="bg-stone-100 rounded-full border-none focus-none"
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  type="password"
                  placeholder="Password"
                  className="bg-stone-100 rounded-full border-none focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={
            isCreatingAccount ||
            isSigningInUser ||
            isUserLoading ||
            isVerifyingMail ||
            isFetchingUser
          }
          type="submit"
          className="w-full text-stone-100 rounded-full uppercase"
        >
          Register
        </LoadingButton>
      </form>
    </Form>
  );
};

export default RegisterForm;

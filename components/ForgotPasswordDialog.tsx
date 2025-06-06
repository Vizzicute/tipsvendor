"use client";
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./LoadingButton";
import { sendMail } from "@/lib/utils/mail";
import { getSingleUserByEmail } from "@/lib/appwrite/fetch";
import { toast } from "sonner";
import { CheckCircleIcon } from "lucide-react";

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

  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const checkEmail = await getSingleUserByEmail(data.email);
    if (!checkEmail) {
      toast.error("Email not found. Please check your email address.");
      form.reset();
      setIsLoading(false);
      return;
    }
    try {
      const emailContent = forgotPasswordEmail(
        data.email,
        `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${data.email}`
      );
      await sendMail({
        to: data.email,
        subject: "Password Reset Request",
        html: emailContent,
      });
      setIsEmailSent(true);
      toast.success("Password reset email sent successfully!");
      form.reset();
    } catch (error) {
      console.error("Error sending password reset email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="w-full ps-4 text-start font-inter text-sm text-red-600 font-semibold">
          Forgot Your Password?
        </span>
      </DialogTrigger>
      <DialogContent className="w-96">
        <DialogTitle>Forget Password</DialogTitle>
        {isEmailSent === false ? (
          <>
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
                  loading={isLoading}
                  type="submit"
                  className="w-full bg-amber-700 text-stone-100 rounded-full uppercase"
                >
                  Submit
                </LoadingButton>
              </form>
            </Form>
          </>
        ) : (
          <div className="mt-4 text-center text-green-600 space-y-2">
            <CheckCircleIcon className="w-12 h-12 mx-auto mb-2" />
            <span className="font-inter text-sm font-semibold">
              A password reset link has been sent to your email.
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const forgotPasswordEmail = (email: string, resetLink: string) => {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 40px 0;">
      <div style="max-width: 420px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" width="64" alt="Tipsvendor" style="margin-bottom: 12px;" />
          <h2 style="margin: 0; color: #b45309;">Reset Your Password</h2>
        </div>
        <div style="color: #374151; font-size: 16px; margin-bottom: 16px;">
          Hi there,
        </div>
        <div style="color: #374151; font-size: 15px; margin-bottom: 16px;">
          We received a request to reset the password for your account associated with <b>${email}</b>.
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${resetLink}" style="display: inline-block; background: #b45309; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
          If you did not request a password reset, you can safely ignore this email.
        </div>
        <div style="color: #6b7280; font-size: 14px;">
          Thank you,<br/>The Tipsvendor Team
        </div>
      </div>
    </div>
  `;
};

export default ForgotPasswordDialog;

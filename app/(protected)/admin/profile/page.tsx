"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { editUser } from "@/lib/appwrite/update";
import { editAvatar } from "@/lib/appwrite/media";
import LoadingButton from "@/components/LoadingButton";
import { Camera, Phone, MapPin } from "lucide-react";
import { forgotPasswordEmail } from "@/components/ForgotPasswordDialog";
import { sendMail } from "@/lib/utils/mail";
import { useSignOutAllAccount } from "@/lib/react-query/queriesAndMutations";
import { INITIAL_USER, useUserContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
});

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const { mutateAsync: signoutAllAccount, isPending: isSigningOut } =
    useSignOutAllAccount();
  const { user, setUser, isAuthenticated, setIsAuthenticated, isLoading: isUserLoading } =
    useUserContext();

  const handleSignout = async () => {
    signoutAllAccount();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    redirect("/admin-auth");
  };

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      address: "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
        address: user.address || "",
      });
    }
  }, [user, form]);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG and GIF files are allowed");
        return;
      }

      setAvatarFile(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      setIsLoading(true);

      // Handle avatar upload if there's a new avatar
      let avatarUrl = null;
      let avatarId = null;
      if (avatarFile) {
        const result = await editAvatar({
          newAvatar: avatarFile,
          oldAvatarId: user?.imageId,
        });
        avatarUrl = result.avatarUrl;
        avatarId = result.avatarId;
      }

      // Update user profile using editUser function
      const updatedUser = await editUser(
        {
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          country: data.country || "",
          address: data.address || "",
          role: user?.role || "user",
          imageId: avatarId || user?.imageId,
          imageUrl: avatarUrl || user?.imageUrl,
        },
        user?.$id || ""
      );

      if (!updatedUser) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  async function changePassword() {
    try {
      setIsPasswordLoading(true);
      const emailContent = forgotPasswordEmail(
        user?.email,
        `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${user?.email}`
      ) as string;
      await sendMail({
        to: user?.email,
        subject: "Password Reset Request",
        html: emailContent,
      });
      toast.success("password reset mail sent");
    } catch (error) {
      console.error(error);
      toast.error("failed. please try again");
    } finally {
      setIsPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : user?.avatar || user?.imageUrl
                  }
                  alt={user?.name}
                  className="object-contain"
                />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  id="avatar"
                  onChange={onAvatarChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("avatar")?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {avatarFile ? "Change Selected Image" : "Change Avatar"}
                </Button>
                {avatarFile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAvatarFile(null)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              {avatarFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {avatarFile.name}
                </p>
              )}
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <LoadingButton
                  loading={isLoading}
                  type="submit"
                  className="w-full"
                >
                  Save Changes
                </LoadingButton>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure.
              </p>
              <LoadingButton
                loading={isPasswordLoading}
                disabled={isPasswordLoading}
                onClick={changePassword}
                variant="outline"
                className="w-full"
              >
                Change Password
              </LoadingButton>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
              <LoadingButton
                onClick={handleSignout}
                loading={isSigningOut}
                variant="outline"
                className="w-full capitalize"
              >
                Logout from all devices
              </LoadingButton>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
              <Button variant="destructive" className="w-full text-white">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

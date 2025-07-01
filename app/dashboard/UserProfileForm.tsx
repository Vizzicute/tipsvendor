import { Models } from "appwrite";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useEditUser } from "@/lib/react-query/queriesAndMutations";
import { useQueryClient } from "@tanstack/react-query";
import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { editAvatar } from "@/lib/appwrite/media";
import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";

// Define schema with zod
const profileSchema = z
  .object({
    imageUrl: z.string().optional(),
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    country: z.string().min(2, "Country is required"),
    phone: z.string().optional(),
    address: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;

const UserProfileForm = ({ user }: { user: Models.Document | IUser }) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      imageUrl: user?.imageUrl || "",
      name: user?.name || "",
      email: user?.email || "",
      country: user?.country || "",
      phone: user?.phone || "",
      address: user?.address || "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync: editUser, isPending: isEditing } = useEditUser();
  const queryClient = useQueryClient();

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      let avatarUrl = null;
      if (avatarFile) {
        const result = await editAvatar({
          newAvatar: avatarFile,
          oldAvatarId: user?.imageId,
        });
        avatarUrl = result.avatarUrl;
      }
      await editUser({
        user: {
          name: data.name,
          email: data.email,
          country: data.country,
          imageUrl: avatarUrl || data.imageUrl,
          phone: data.phone,
          address: data.address,
        },
        userId: user.$id,
      });

      if (data.password) {
        await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.accountId, password: data.password }),
      });
      }
      form.reset(data);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await getCurrentUser();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl mx-auto flex flex-col gap-4"
      >
        <FormField
          name="imageUrl"
          render={() => (
            <FormItem>
              <FormLabel htmlFor="imageUrl">Profile Image</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={
                        avatarFile
                          ? URL.createObjectURL(avatarFile)
                          : user?.avatar || user?.imageUrl
                      }
                      alt={user?.name}
                      className="object-contain"
                    />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <Input
                    id="avatarUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl>
                <Input id="name" type="text" {...field} className="mt-1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input id="email" type="email" {...field} className="mt-1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="country">Country</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="phone">
                Phone No. <span className="text-gray-400">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input id="phone" type="tel" {...field} className="mt-1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="address">
                Address <span className="text-gray-400">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input id="address" type="text" {...field} className="mt-1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <PasswordInput
                  id="password"
                  type="password"
                  {...field}
                  className="mt-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  id="confirmPassword"
                  type="password"
                  {...field}
                  className="mt-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" loading={isEditing} disabled={isEditing}>
          {isEditing ? "Updating..." : "Update Profile"}
        </LoadingButton>
      </form>
    </Form>
  );
};

export default UserProfileForm;

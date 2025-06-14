"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getUsers } from "@/lib/appwrite/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useEditSubscription } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";
import LoadingButton from "@/components/LoadingButton";
import { Models } from "appwrite";

const formSchema = z.object({
  user: z.string().min(1, "User is required"),
  subscriptionType: z.string().min(1, "Subscription type is required"),
  duration: z.string().min(1, "Duration is required"),
  updatedAt: z.date().optional(),
  isValid: z.boolean().optional(),
});

const subscriptionTypes = [
  { value: "investment", label: "Investment Plan" },
  { value: "vip", label: "Vip Tips" },
  { value: "mega", label: "Mega Odds" },
  { value: "investment&vip", label: "Investment Plan & Vip Tips" },
  { value: "investment&mega", label: "Investment Plan & Mega Odds" },
  { value: "vip&mega", label: "Vip Tips & Mega Odds" },
  { value: "all", label: "All Plans" },
];

const durations = [
  { value: "10", label: "10 days" },
  { value: "20", label: "20 days" },
  { value: "30", label: "30 days" },
];

const EditSubscriptionForm = ({ sub }: { sub: Models.Document }) => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const queryClient = useQueryClient();

  const regularUsers = users?.filter((user) => user.role === "user");
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: sub?.user.$id || "",
      subscriptionType: sub?.subscriptionType || "",
      duration: sub?.duration || "",
    },
  });

  const { mutateAsync: editSubscription, isPending } = useEditSubscription();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (sub.isValid === false) {
        values.updatedAt = new Date();
        values.isValid = true;
      }
      await editSubscription({
        subscription: values,
        subscriptionId: sub?.$id,
      });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription Edited");
    } catch (error) {
      console.error("Error editing subscription:", error);
      toast.error("Failed to edit subscription. Please try again.");
      return;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col">
              <FormLabel>User</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between bg-stone-100 rounded-sm border-secondary",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? users?.find((user) => user.$id === field.value)?.email
                        : "Select user"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                  style={{ zIndex: 1000 }}
                >
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-auto">
                      {regularUsers?.map((user) => (
                        <CommandItem
                          key={user.$id}
                          value={user.email}
                          onSelect={() => {
                            form.setValue("user", user.$id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === user.$id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {user.email}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subscriptionType"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col">
              <FormLabel>Subscription Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary">
                    <SelectValue placeholder="Select subscription type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subscriptionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col">
              <FormLabel>Duration</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isPending}
          type="submit"
          className="w-full bg-amber-500 text-white"
        >
          Edit Subscription
        </LoadingButton>
      </form>
    </Form>
  );
};

export default EditSubscriptionForm;

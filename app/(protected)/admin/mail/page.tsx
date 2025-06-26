"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


import { sendMail, sendBulkMail } from "@/lib/utils/mail";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Check,
  ChevronsUpDown,
  Mail,
  Users,
  CreditCard,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingButton from "@/components/LoadingButton";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { usePredictions, useSubscriptions, useUsers } from "@/lib/react-query/queries";

const formSchema = z.object({
  recipientType: z.string(),
  recipient: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export default function MailPage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const { data: users } = useUsers();

  const { data: subscriptions } = useSubscriptions();

  const { data: predictions } = usePredictions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientType: "single",
      recipient: "",
      subject: "",
      message: "",
    },
  });

  const getRecipients = () => {
    const recipientType = form.getValues().recipientType;
    const recipient = form.getValues().recipient;

    switch (recipientType) {
      case "single":
        return recipient ? [recipient] : [];
      case "all":
        return users?.map((user) => user.email) || [];
      case "subscribers":
        return (
          subscriptions
            ?.filter((sub) => sub.isValid)
            .map((sub) => users?.find((user) => user.$id === sub.user.$id)?.email)
            .filter(Boolean) || []
        );
      case "non-subscribers":
        const subscriberIds = new Set(subscriptions?.map((sub) => sub.user.$id));
        return (
          users
            ?.filter((user) => !subscriberIds.has(user.$id))
            .map((user) => user.email) || []
        );
      case "subscription-type":
        return (
          subscriptions
            ?.filter((sub) => sub.subscriptionType === recipient)
            .map((sub) => users?.find((user) => user.$id === sub.user.$id)?.email)
            .filter(Boolean) || []
        );
      default:
        return [];
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const recipients = getRecipients();

      if (recipients.length === 0) {
        toast.error("No recipients found");
        return;
      }

      if (recipients.length === 1) {
        await sendMail({
          to: recipients[0],
          subject: data.subject,
          html: messageContent,
        });
      } else {
        await sendBulkMail(recipients, data.subject, messageContent);
      }

      toast.success(
        `Email sent successfully to ${recipients.length} recipient(s)`
      );
      form.reset();
      setMessageContent("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  const sendPredictionsToAllSubscribers = async () => {
    try {
      setIsLoading(true);

      // Get today's predictions for all types
      const today = new Date().toISOString().split("T")[0];
      const todayPredictions =
        predictions?.filter((pred) => {
          const predDate = new Date(pred.datetime).toISOString().split("T")[0];
          return predDate === today;
        }) || [];

      if (todayPredictions.length === 0) {
        toast.error("No predictions found for today");
        return;
      }

      // Get all valid subscriptions
      const validSubscriptions =
        subscriptions?.filter((sub) => sub.isValid) || [];

      // Group predictions by type
      const predictionsByType = todayPredictions.reduce((acc, pred) => {
        if (!acc[pred.subscriptionType]) {
          acc[pred.subscriptionType] = [];
        }
        acc[pred.subscriptionType].push(pred);
        return acc;
      }, {} as Record<string, any[]>);

      let sentCount = 0;

      // Send predictions to each subscriber based on their subscription type
      const sendPromises = validSubscriptions.map(async (subscription) => {
        const subscriptionTypes = subscription.subscriptionType === "all"
          ? ["investment", "vip", "mega"]
          : subscription.subscriptionType.split("&");
        const subscriberPredictions = subscriptionTypes.flatMap(
          (type: string) => predictionsByType[type] || []
        );

        if (subscriberPredictions.length < 1) {
          toast.error(
            `No predictions found for subscription type: ${subscription.subscriptionType}`
          );
          return;
        }

        const user =
          users?.find((u) => u.$id === subscription.user?.$id);

        if (!user?.email) {
          toast.error(
            `No email found for user with subscription: ${subscription.subscriptionType}`
          );
          return;
        }

        await sendMail({
          to: user.email,
          subject: "Today's Predictions",
          predictions: subscriberPredictions,
          subscriptionType: subscription.subscriptionType,
        });
        sentCount++;
      });

      await Promise.all(sendPromises.filter(Boolean));

      if (sentCount > 0) {
        toast.success(
          `Predictions sent successfully to ${sentCount} subscriber(s) based on their subscription types`
        );
      } else {
        toast.error("No emails were sent. Please check your data.");
      }
    } catch (error) {
      console.error("Error sending prediction emails:", error);
      toast.error("Failed to send prediction emails");
    } finally {
      setIsLoading(false);
    }
  };

  const regularUsers = users?.filter((user) => user.role === "user") || [];
  const subscriptionTypes = [
    ...new Set(subscriptions?.map((sub) => sub.subscriptionType) || []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Mail Management</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General Mail</TabsTrigger>
          <TabsTrigger value="predictions">Prediction Games</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Send Email</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="recipientType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select recipient type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Single User
                              </div>
                            </SelectItem>
                            <SelectItem value="all">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                All Users
                              </div>
                            </SelectItem>
                            <SelectItem value="subscribers">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                All Subscribers
                              </div>
                            </SelectItem>
                            <SelectItem value="non-subscribers">
                              <div className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Non-Subscribers
                              </div>
                            </SelectItem>
                            <SelectItem value="subscription-type">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                By Subscription Type
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(form.watch("recipientType") === "single" ||
                    form.watch("recipientType") === "subscription-type") && (
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {form.watch("recipientType") === "single"
                              ? "Select User"
                              : "Select Subscription Type"}
                          </FormLabel>
                          {form.watch("recipientType") === "single" ? (
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? regularUsers.find(
                                          (user) => user.email === field.value
                                        )?.email
                                      : "Select user"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search user..." />
                                  <CommandEmpty>No user found.</CommandEmpty>
                                  <CommandGroup>
                                    {regularUsers.map((user) => (
                                      <CommandItem
                                        key={user.$id}
                                        value={user.email}
                                        onSelect={() => {
                                          form.setValue(
                                            "recipient",
                                            user.email
                                          );
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === user.email
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
                          ) : (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subscription type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subscriptionTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <div className="border rounded-md">
                            <SimpleEditor
                              content={messageContent}
                              onChange={(content) => {
                                setMessageContent(content);
                                field.onChange(content);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <LoadingButton
                    loading={isLoading}
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                  >
                    Send Email
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <CardTitle>Send Prediction Games</CardTitle>
                <LoadingButton
                  loading={isLoading}
                  type="button"
                  onClick={sendPredictionsToAllSubscribers}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading
                    ? "Sending..."
                    : "Send Predictions to All Subscribers"}
                </LoadingButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

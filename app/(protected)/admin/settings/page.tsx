"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import {
  Mail,
  Globe,
  Shield,
  Bell,
  CreditCard,
  Settings,
  Share2,
} from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getEmailSettings,
  getSiteSettings,
  getSecuritySettings,
  getNotificationSettings,
  getSubscriptionSettings,
  getSocialSettings,
  updateSettings,
} from "@/lib/appwrite/appConfig";
import { useQueryClient } from "@tanstack/react-query";

const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.string().min(1, "SMTP port is required"),
  smtpUser: z.string().min(1, "Invalid Email Username"),
  smtpPass: z.string().min(1, "SMTP password is required"),
  smtpFrom: z.string().email("Invalid email address"),
});

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteUrl: z.string().url("Invalid URL"),
  siteDescription: z.string().min(1, "Site description is required"),
  maintenanceMode: z.boolean().default(false),
});

const securitySettingsSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  sessionTimeout: z.number().min(5).max(120),
  maxLoginAttempts: z.number().min(3).max(10),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  notificationSound: z.boolean().default(true),
});

const subscriptionSettingsSchema = z.object({
  defaultSubscriptionType: z.string(),
  subscriptionPrice: z.number().min(0),
  trialPeriod: z.number().min(0),
  gracePeriod: z.number().min(0),
});

const appConfigSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

const socialLinksSchema = z.object({
  facebook: z.string().url("Invalid Facebook URL").optional(),
  twitter: z.string().url("Invalid Twitter URL").optional(),
  instagram: z.string().url("Invalid Instagram URL").optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  youtube: z.string().url("Invalid YouTube URL").optional(),
  supportEmail: z.string().email("Invalid support email"),
  infoEmail: z.string().email("Invalid info email"),
  advertEmail: z.string().email("Invalid advert email"),
});

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [appConfigs, setAppConfigs] = useState<
    { key: string; value: string }[]
  >([]);

  const queryClient = useQueryClient();

  const emailForm = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPass: "",
      smtpFrom: "",
    },
  });

  const siteForm = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "",
      siteUrl: "",
      siteDescription: "",
      maintenanceMode: false,
    },
  });

  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationSettingsSchema>>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      notificationSound: true,
    },
  });

  const subscriptionForm = useForm<z.infer<typeof subscriptionSettingsSchema>>({
    resolver: zodResolver(subscriptionSettingsSchema),
    defaultValues: {
      defaultSubscriptionType: "basic",
      subscriptionPrice: 30,
      trialPeriod: 7,
      gracePeriod: 3,
    },
  });

  const appConfigForm = useForm<z.infer<typeof appConfigSchema>>({
    resolver: zodResolver(appConfigSchema),
    defaultValues: {
      key: "",
      value: "",
    },
  });

  const socialLinksForm = useForm<z.infer<typeof socialLinksSchema>>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      supportEmail: "",
      infoEmail: "",
      advertEmail: "",
    },
  });

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (activeTab === "email") {
          const settings = await getEmailSettings();
          emailForm.reset(settings);
        } else if (activeTab === "site") {
          const settings = await getSiteSettings();
          siteForm.reset(settings);
        } else if (activeTab === "security") {
          const settings = await getSecuritySettings();
          securityForm.reset(settings);
        } else if (activeTab === "notifications") {
          const settings = await getNotificationSettings();
          notificationForm.reset(settings);
        } else if (activeTab === "subscriptions") {
          const settings = await getSubscriptionSettings();
          subscriptionForm.reset(settings);
        } else if (activeTab === "social-links") {
          const settings = await getSocialSettings();
          socialLinksForm.reset(settings);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} settings:`, error);
        toast.error(`Failed to fetch ${activeTab} settings`);
      }
    };

    fetchSettings();
  }, [
    activeTab,
    emailForm,
    siteForm,
    securityForm,
    notificationForm,
    subscriptionForm,
    socialLinksForm,
  ]);

  const onEmailSubmit = async (data: z.infer<typeof emailSettingsSchema>) => {
    try {
      setIsLoading(true);
      const success = await updateSettings("email", data);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["emailSettings"] });
        toast.success("Email settings updated successfully");
      } else {
        throw new Error("Failed to update email settings");
      }
    } catch (error) {
      console.error("Error updating email settings:", error);
      toast.error("Failed to update email settings");
    } finally {
      setIsLoading(false);
    }
  };

  const onSiteSubmit = async (data: z.infer<typeof siteSettingsSchema>) => {
    try {
      setIsLoading(true);
      const success = await updateSettings("site", data);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
        toast.success("Site settings updated successfully");
      } else {
        throw new Error("Failed to update site settings");
      }
    } catch (error) {
      console.error("Error updating site settings:", error);
      toast.error("Failed to update site settings");
    } finally {
      setIsLoading(false);
    }
  };

  const onSecuritySubmit = async (
    data: z.infer<typeof securitySettingsSchema>
  ) => {
    try {
      setIsLoading(true);
      const success = await updateSettings("security", data);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["securitySettings"] });
        toast.success("Security settings updated successfully");
      } else {
        throw new Error("Failed to update security settings");
      }
    } catch (error) {
      console.error("Error updating security settings:", error);
      toast.error("Failed to update security settings");
    } finally {
      setIsLoading(false);
    }
  };

  const onNotificationSubmit = async (
    data: z.infer<typeof notificationSettingsSchema>
  ) => {
    try {
      setIsLoading(true);
      const success = await updateSettings("notifications", data);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
        toast.success("Notification settings updated successfully");
      } else {
        throw new Error("Failed to update notification settings");
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubscriptionSubmit = async (
    data: z.infer<typeof subscriptionSettingsSchema>
  ) => {
    try {
      setIsLoading(true);
      const success = await updateSettings("subscriptions", data);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["subscriptionSettings"] });
        toast.success("Subscription settings updated successfully");
      } else {
        throw new Error("Failed to update subscription settings");
      }
    } catch (error) {
      console.error("Error updating subscription settings:", error);
      toast.error("Failed to update subscription settings");
    } finally {
      setIsLoading(false);
    }
  };

  const onAppConfigSubmit = async (data: z.infer<typeof appConfigSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings/app-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update app configuration");
      }

      toast.success("App configuration updated successfully");
      appConfigForm.reset();
      // Refresh the app configs list
      const updatedConfigs = await fetch("/api/settings/app-config").then(
        (res) => res.json()
      );
      setAppConfigs(updatedConfigs);
    } catch (error) {
      console.error("Error updating app configuration:", error);
      toast.error("Failed to update app configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const onSocialLinksSubmit = async (
    data: z.infer<typeof socialLinksSchema>
  ) => {
    try {
      setIsLoading(true);
      const success = await updateSettings("social", data);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["socialSettings"] });
        toast.success("Social links updated successfully");
      } else {
        throw new Error("Failed to update social links");
      }
    } catch (error) {
      console.error("Error updating social links:", error);
      toast.error("Failed to update social links");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs 
        defaultValue="email" 
        className="space-y-4"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="site">
            <Globe className="h-4 w-4 mr-2" />
            Site
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <CreditCard className="h-4 w-4 mr-2" />
            Price
          </TabsTrigger>
          <TabsTrigger value="social-links">
            <Share2 className="h-4 w-4 mr-2" />
            Socials
          </TabsTrigger>
          <TabsTrigger value="app-config">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={emailForm.control}
                    name="smtpHost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Host</FormLabel>
                        <FormControl>
                          <Input placeholder="smtp.gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="smtpPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Port</FormLabel>
                        <FormControl>
                          <Input placeholder="587" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="smtpUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your-email@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="smtpPass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="smtpFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="noreply@yourdomain.com"
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
                    className="w-full"
                  >
                    Save Email Settings
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...siteForm}>
                <form
                  onSubmit={siteForm.handleSubmit(onSiteSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={siteForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={siteForm.control}
                    name="siteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={siteForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                    Save Site Settings
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form
                  onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={securityForm.control}
                    name="sessionTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="maxLoginAttempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Login Attempts</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
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
                    Save Security Settings
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form
                  onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Email Notifications</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="pushNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                        <FormLabel>Push Notifications</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="notificationSound"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Notification Sound</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <LoadingButton
                    loading={isLoading}
                    type="submit"
                    className="w-full"
                  >
                    Save Notification Settings
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...subscriptionForm}>
                <form
                  onSubmit={subscriptionForm.handleSubmit(onSubscriptionSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={subscriptionForm.control}
                    name="subscriptionPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Subscription Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subscriptionForm.control}
                    name="trialPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trial Period (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subscriptionForm.control}
                    name="gracePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grace Period (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
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
                    Save Subscription Settings
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app-config">
          <Card>
            <CardHeader>
              <CardTitle>App Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...appConfigForm}>
                <form
                  onSubmit={appConfigForm.handleSubmit(onAppConfigSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={appConfigForm.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Configuration Key</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., maintenance_mode"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appConfigForm.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Configuration Value</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., true" {...field} />
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
                    Add Configuration
                  </LoadingButton>
                </form>
              </Form>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">
                  Current Configurations
                </h3>
                <div className="space-y-4">
                  {appConfigs.map((config) => (
                    <div
                      key={config.key}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{config.key}</p>
                        <p className="text-sm text-muted-foreground">
                          {config.value}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          try {
                            await fetch(
                              `/api/settings/app-config/${config.key}`,
                              {
                                method: "DELETE",
                              }
                            );
                            setAppConfigs(
                              appConfigs.filter((c) => c.key !== config.key)
                            );
                            toast.success("Configuration deleted successfully");
                          } catch (error) {
                            console.error(
                              "Error deleting configuration:",
                              error
                            );
                            toast.error("Failed to delete configuration");
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social-links">
          <Card>
            <CardHeader>
              <CardTitle>Social Links & Contact Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...socialLinksForm}>
                <form
                  onSubmit={socialLinksForm.handleSubmit(onSocialLinksSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={socialLinksForm.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://facebook.com/your-page"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialLinksForm.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://twitter.com/your-handle"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialLinksForm.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://instagram.com/your-handle"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialLinksForm.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/company/your-company"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialLinksForm.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://youtube.com/your-channel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-medium mb-4">Contact Emails</h3>

                    <FormField
                      control={socialLinksForm.control}
                      name="supportEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="support@yourdomain.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={socialLinksForm.control}
                      name="infoEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Info Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="info@yourdomain.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={socialLinksForm.control}
                      name="advertEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Advertisement Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="advert@yourdomain.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <LoadingButton
                    loading={isLoading}
                    type="submit"
                    className="w-full"
                  >
                    Save Social Links & Emails
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 

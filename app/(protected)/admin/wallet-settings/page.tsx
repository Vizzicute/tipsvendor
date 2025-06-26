"use client";

import React, { useState } from "react";
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
import LoadingButton from "@/components/LoadingButton";
import { updateSettings } from "@/lib/appwrite/appConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettings } from "@/lib/react-query/queries";

const walletSettingsSchema = z.object({
  // Paystack Settings
  paystack: z.object({
    publicKey: z.string().min(1, "Public key is required"),
    secretKey: z.string().min(1, "Secret key is required"),
    webhookSecret: z.string().optional(),
  }),

  // Bank Account Details
  bankAccount: z.object({
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    bankName: z.string().min(1, "Bank name is required"),
    swiftCode: z.string().optional(),
    routingNumber: z.string().optional(),
  }),

  // USD Bank Account Details
  usdBankAccount: z.object({
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    bankName: z.string().min(1, "Bank name is required"),
    swiftCode: z.string().min(1, "SWIFT code is required"),
    routingNumber: z.string().min(1, "Routing number is required"),
  }),

  // Mobile Money Details
  mobileMoney: z.object({
    provider: z.string().min(1, "Provider is required"),
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
  }),

  // Crypto Details
  crypto: z.object({
    bitcoin: z.object({
      address: z.string().min(1, "Bitcoin address is required"),
      network: z.string().default("Bitcoin"),
    }),
    ethereum: z.object({
      address: z.string().min(1, "Ethereum address is required"),
      network: z.string().default("Ethereum"),
    }),
    usdt: z.object({
      address: z.string().min(1, "USDT address is required"),
      network: z.string().default("TRC20"),
    }),
  }),
});

export default function WalletSettingsPage() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: settings, isLoading: isLoadingSettings } = useSettings();

  const updateSettingsMutation = useMutation({
    mutationFn: (data: z.infer<typeof walletSettingsSchema>) => updateSettings("wallet", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-settings"] });
      toast.success("Wallet settings updated successfully");
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    },
  });

  const form = useForm<z.infer<typeof walletSettingsSchema>>({
    resolver: zodResolver(walletSettingsSchema),
    defaultValues: {
      paystack: {
        publicKey: "",
        secretKey: "",
        webhookSecret: "",
      },
      bankAccount: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        swiftCode: "",
        routingNumber: "",
      },
      usdBankAccount: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        swiftCode: "",
        routingNumber: "",
      },
      mobileMoney: {
        provider: "",
        accountName: "",
        accountNumber: "",
        apiKey: "",
        apiSecret: "",
      },
      crypto: {
        bitcoin: {
          address: "",
          network: "Bitcoin",
        },
        ethereum: {
          address: "",
          network: "Ethereum",
        },
        usdt: {
          address: "",
          network: "TRC20",
        },
      },
    },
  });

  // Update form when settings are loaded
  React.useEffect(() => {
    if (settings) {
      console.log("Loaded settings:", settings); // Debug log
      const formattedSettings = {
        paystack: {
          publicKey: settings.paystack?.publicKey || "",
          secretKey: settings.paystack?.secretKey || "",
          webhookSecret: settings.paystack?.webhookSecret || "",
        },
        bankAccount: {
          accountName: settings.bankAccount?.accountName || "",
          accountNumber: settings.bankAccount?.accountNumber || "",
          bankName: settings.bankAccount?.bankName || "",
          swiftCode: settings.bankAccount?.swiftCode || "",
          routingNumber: settings.bankAccount?.routingNumber || "",
        },
        usdBankAccount: {
          accountName: settings.usdBankAccount?.accountName || "",
          accountNumber: settings.usdBankAccount?.accountNumber || "",
          bankName: settings.usdBankAccount?.bankName || "",
          swiftCode: settings.usdBankAccount?.swiftCode || "",
          routingNumber: settings.usdBankAccount?.routingNumber || "",
        },
        mobileMoney: {
          provider: settings.mobileMoney?.provider || "",
          accountName: settings.mobileMoney?.accountName || "",
          accountNumber: settings.mobileMoney?.accountNumber || "",
          apiKey: settings.mobileMoney?.apiKey || "",
          apiSecret: settings.mobileMoney?.apiSecret || "",
        },
        crypto: {
          bitcoin: {
            address: settings.crypto?.bitcoin?.address || "",
            network: settings.crypto?.bitcoin?.network || "Bitcoin",
          },
          ethereum: {
            address: settings.crypto?.ethereum?.address || "",
            network: settings.crypto?.ethereum?.network || "Ethereum",
          },
          usdt: {
            address: settings.crypto?.usdt?.address || "",
            network: settings.crypto?.usdt?.network || "TRC20",
          },
        },
      };
      console.log("Formatted settings:", formattedSettings); // Debug log
      form.reset(formattedSettings);
    }
  }, [settings, form]);

  const onSubmit = async (data: z.infer<typeof walletSettingsSchema>) => {
    setIsLoading(true);
    try {
      console.log("Submitting data:", data); // Debug log
      await updateSettingsMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Wallet Settings</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="paystack" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="paystack">Paystack</TabsTrigger>
              <TabsTrigger value="bank">Bank Account</TabsTrigger>
              <TabsTrigger value="usd">USD Account</TabsTrigger>
              <TabsTrigger value="momo">Mobile Money</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
            </TabsList>

            <TabsContent value="paystack">
              <Card>
                <CardHeader>
                  <CardTitle>Paystack Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="paystack.publicKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Public Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paystack.secretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paystack.webhookSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook Secret</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bank">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bankAccount.accountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankAccount.accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankAccount.bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankAccount.swiftCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SWIFT Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankAccount.routingNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Routing Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usd">
              <Card>
                <CardHeader>
                  <CardTitle>USD Bank Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="usdBankAccount.accountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usdBankAccount.accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usdBankAccount.bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usdBankAccount.swiftCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SWIFT Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usdBankAccount.routingNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Routing Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="momo">
              <Card>
                <CardHeader>
                  <CardTitle>Mobile Money Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mobileMoney.provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobileMoney.accountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobileMoney.accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobileMoney.apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobileMoney.apiSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Secret</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crypto">
              <Card>
                <CardHeader>
                  <CardTitle>Crypto Wallet Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="crypto.bitcoin.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bitcoin Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="crypto.bitcoin.network"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bitcoin Network</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="crypto.ethereum.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ethereum Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="crypto.ethereum.network"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ethereum Network</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="crypto.usdt.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>USDT Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="crypto.usdt.network"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>USDT Network</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <LoadingButton loading={isLoading} type="submit" className="w-full">
            Save Settings
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}

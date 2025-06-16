"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { CreditCard, Banknote, Bitcoin, Phone, Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchExchangeRates } from "@/lib/utils/exchangeRates";
import Link from "next/link";
import { getWalletSettings } from "@/lib/appwrite/appConfig";
import { useQuery } from "@tanstack/react-query";

interface ExchangeRate {
  currency: string;
  rate: number;
  lastUpdated: string;
}

export default function WalletPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["wallet-settings"],
    queryFn: getWalletSettings,
  });

  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error("Error loading exchange rates:", error);
        toast.error("Failed to load exchange rates");
      }
    };

    loadExchangeRates();
    // Refresh rates every hour
    const interval = setInterval(loadExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getExchangeRate = (currency: string) => {
    return exchangeRates.find((rate) => rate.currency === currency)?.rate || 1;
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <Tabs defaultValue="paystack" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="paystack">Paystack</TabsTrigger>
          <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          <TabsTrigger value="usd">USD Transfer</TabsTrigger>
          <TabsTrigger value="momo">MTN MoMo</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
        </TabsList>

        <TabsContent value="paystack">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Paystack Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Supported Countries</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {exchangeRates.map((rate) => (
                        <div
                          key={rate.currency}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <span>{rate.currency}</span>
                          <span className="text-sm text-muted-foreground">
                            1 USD = {rate.rate.toFixed(2)} {rate.currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Api Keys</Label>
                    <div className="grid gap-2">
                      <div className="p-2 border rounded">
                        <p className="text-sm font-medium">
                          Public Key: {settings.paystack?.publicKey}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Secret Key: {settings.paystack?.secretKey}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Web Hook Secret: {settings.paystack?.webhookSecret}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Nigerian Bank Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Bank Details</Label>
                    <div className="grid gap-2">
                      <div className="p-2 border rounded">
                        <p className="text-sm font-medium">
                          Bank: {settings.bankAccount?.bankName}
                        </p>
                        <p className="text-sm">
                          Account Name: {settings.bankAccount?.accountName}
                        </p>
                        <p className="text-sm">
                          Account Number: {settings.bankAccount?.accountNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Exchange Rate</Label>
                    <div className="p-2 border rounded">
                      <p className="text-sm">
                        1 USD = {getExchangeRate("NGN").toFixed(2)} NGN
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usd">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                USD Bank Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Bank Details</Label>
                    <div className="grid gap-2">
                      <div className="p-2 border rounded">
                        <p className="text-sm font-medium">
                          Bank: {settings.usdBankAccount?.bankName}
                        </p>
                        <p className="text-sm">
                          Account Name: {settings.usdBankAccount?.accountName}
                        </p>
                        <p className="text-sm">
                          Account Number:{" "}
                          {settings.usdBankAccount?.accountNumber}
                        </p>
                        <p className="text-sm">
                          Routing Number:{" "}
                          {settings.usdBankAccount?.routingNumber}
                        </p>
                        <p className="text-sm">
                          SWIFT/BIC: {settings.usdBankAccount?.swiftCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="momo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                MTN Mobile Money
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Supported Countries</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["GHA", "UGA", "CMR"].map((country) => (
                        <div key={country} className="p-2 border rounded">
                          <p className="text-sm font-medium">{country}</p>
                          <p className="text-sm text-muted-foreground">
                            1 USD ={" "}
                            {getExchangeRate(
                              country === "CMR" ? "XAF" : country === "GHA" ? "GHS" : "UGX"
                            ).toFixed(2)}{" "}
                            {country === "CMR" ? "XAF" : country  === "GHA" ? "GHS" : "UGX"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>MTN MoMo Number</Label>
                    <div className="p-2 border rounded">
                      <p className="text-sm font-medium">
                        {settings.mobileMoney?.accountNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Please include your email as reference
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5" />
                Cryptocurrency Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Supported Cryptocurrencies</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { name: "Bitcoin", symbol: "BTC" },
                        { name: "Ethereum", symbol: "ETH" },
                        { name: "USDT", symbol: "USDT" },
                      ].map((crypto) => (
                        <div
                          key={crypto.symbol}
                          className="p-2 border rounded"
                        >
                          <p className="text-sm font-medium">{crypto.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {crypto.symbol}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Wallet Addresses</Label>
                    <div className="grid gap-2">
                      <div className="p-2 border rounded">
                        <p className="text-sm font-medium">BTC Address</p>
                        <p className="text-xs break-all">
                          {settings.crypto?.bitcoin?.address}
                        </p>
                      </div>
                      <div className="p-2 border rounded">
                        <p className="text-sm font-medium">ETH Address</p>
                        <p className="text-xs break-all">
                          {settings.crypto?.ethereum?.address}
                        </p>
                      </div>
                      <div className="p-2 border rounded">
                        <p className="text-sm font-medium">
                          USDT Address (TRC20)
                        </p>
                        <p className="text-xs break-all">
                          {settings.crypto?.usdt?.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Link
        className="w-full text-sm text-center text-muted-foreground"
        href="/admin/wallet-settings?tab=wallet"
      >
        --Go To Wallet Settings--
      </Link>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Wallet, CreditCard, Banknote, History } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import { getWalletSettings } from "@/lib/appwrite/appConfig";

interface WalletSettings {
  minimumDeposit: number;
  maximumDeposit: number;
  minimumWithdrawal: number;
  maximumWithdrawal: number;
  withdrawalFee: number;
  depositFee: number;
  processingTime: string;
  supportedCurrencies: string[];
  bankAccounts: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  }[];
  paymentMethods: string[];
  maintenanceMode: boolean;
}

export default function WalletPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("deposit");
  const [walletSettings, setWalletSettings] = useState<WalletSettings | null>(null);
  const [amount, setAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  useEffect(() => {
    const fetchWalletSettings = async () => {
      try {
        const settings = await getWalletSettings();
        setWalletSettings(settings);
      } catch (error) {
        console.error("Error fetching wallet settings:", error);
        toast.error("Failed to fetch wallet settings");
      }
    };

    fetchWalletSettings();
  }, []);

  const handleDeposit = async () => {
    if (!walletSettings) return;

    const depositAmount = Number(amount);
    if (isNaN(depositAmount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (depositAmount < walletSettings.minimumDeposit) {
      toast.error(`Minimum deposit amount is ${walletSettings.minimumDeposit}`);
      return;
    }

    if (depositAmount > walletSettings.maximumDeposit) {
      toast.error(`Maximum deposit amount is ${walletSettings.maximumDeposit}`);
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      setIsLoading(true);
      // Implement deposit logic here
      toast.success("Deposit request submitted successfully");
    } catch (error) {
      console.error("Error processing deposit:", error);
      toast.error("Failed to process deposit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!walletSettings) return;

    const withdrawalAmount = Number(amount);
    if (isNaN(withdrawalAmount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (withdrawalAmount < walletSettings.minimumWithdrawal) {
      toast.error(`Minimum withdrawal amount is ${walletSettings.minimumWithdrawal}`);
      return;
    }

    if (withdrawalAmount > walletSettings.maximumWithdrawal) {
      toast.error(`Maximum withdrawal amount is ${walletSettings.maximumWithdrawal}`);
      return;
    }

    if (!selectedBank) {
      toast.error("Please select a bank account");
      return;
    }

    try {
      setIsLoading(true);
      // Implement withdrawal logic here
      toast.success("Withdrawal request submitted successfully");
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("Failed to process withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  if (!walletSettings) {
    return <div>Loading...</div>;
  }

  if (walletSettings.maintenanceMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold mb-4">Wallet Maintenance</h2>
        <p className="text-muted-foreground">The wallet system is currently under maintenance. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
      </div>

      <Tabs 
        defaultValue="deposit" 
        className="space-y-4"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="deposit">
            <CreditCard className="h-4 w-4 mr-2" />
            Deposit
          </TabsTrigger>
          <TabsTrigger value="withdraw">
            <Banknote className="h-4 w-4 mr-2" />
            Withdraw
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (NGN)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={walletSettings.minimumDeposit}
                    max={walletSettings.maximumDeposit}
                  />
                  <p className="text-sm text-muted-foreground">
                    Min: {walletSettings.minimumDeposit} NGN | Max: {walletSettings.maximumDeposit} NGN
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select
                    value={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {walletSettings.paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <LoadingButton
                  loading={isLoading}
                  onClick={handleDeposit}
                  className="w-full"
                >
                  Deposit
                </LoadingButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (NGN)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={walletSettings.minimumWithdrawal}
                    max={walletSettings.maximumWithdrawal}
                  />
                  <p className="text-sm text-muted-foreground">
                    Min: {walletSettings.minimumWithdrawal} NGN | Max: {walletSettings.maximumWithdrawal} NGN
                    {walletSettings.withdrawalFee > 0 && ` | Fee: ${walletSettings.withdrawalFee} NGN`}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank">Bank Account</Label>
                  <Select
                    value={selectedBank}
                    onValueChange={setSelectedBank}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank account" />
                    </SelectTrigger>
                    <SelectContent>
                      {walletSettings.bankAccounts.map((bank) => (
                        <SelectItem key={bank.accountNumber} value={bank.accountNumber}>
                          {bank.bankName} - {bank.accountNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <LoadingButton
                  loading={isLoading}
                  onClick={handleWithdrawal}
                  className="w-full"
                >
                  Withdraw
                </LoadingButton>

                <p className="text-sm text-muted-foreground">
                  Processing time: {walletSettings.processingTime}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Implement transaction history here */}
              <p className="text-muted-foreground">Transaction history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
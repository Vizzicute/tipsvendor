import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Button } from "./ui/button";
import { Copy, Check } from "lucide-react";
import { getWalletSettings } from "@/lib/appwrite/appConfig";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/types";

interface PaymentDialogProps {
  open: boolean;
  amount: string;
  currency: string;
  duration: string;
  plan: string;
  user: IUser;
  onClose: () => void;
}

const PaymentDialog = ({
  open,
  amount,
  currency,
  duration,
  plan,
  user,
  onClose,
}: PaymentDialogProps) => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["wallet-settings"],
    queryFn: getWalletSettings,
  });

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  // Format amount with commas and 2 decimals
  const formattedAmount = `${currency} ${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 640);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
  }

  const isMobile = useIsMobile();

  // Payment content (shared by Dialog and Drawer)
  const PaymentContent = () => (
    <div className="flex flex-col gap-6 justify-center items-center w-full">
      <div className="w-full flex justify-between items-center mb-2">
        <span className="font-semibold text-base">Subscription for:</span>
        <span className="font-mono text-lg">
          {plan} ({duration} days)
        </span>
      </div>
      <div className="w-full flex justify-between items-center mb-2">
        <span className="font-semibold text-base">Amount:</span>
        <span className="text-md">{formattedAmount}</span>
      </div>
      <div className="w-full flex justify-between items-center mb-2">
        <span className="font-semibold text-base">User:</span>
        <span className="font-mono text-sm">{user.email}</span>
      </div>
      {isLoading && (
        <div className="text-center py-8">Loading payment methods...</div>
      )}
      {!isLoading && settings && (
        <div className="flex flex-col gap-4 w-full">
          {/* Paystack */}
          {settings.paystack?.publicKey && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-stone-50">
              <div className="font-semibold text-base">
                Paystack (Card/Bank/USSD)
              </div>
              <div className="text-xs text-muted-foreground">
                Pay securely with Paystack (Nigeria, Ghana, South Africa, etc.)
              </div>
              <Button className="w-full bg-green-600 text-white mt-2">
                Pay with Paystack
              </Button>
            </div>
          )}

          {/* Bank Transfer (NGN) */}
          {settings.bankAccount?.accountNumber && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-stone-50">
              <div className="font-semibold text-base">
                Bank Transfer (NGN)
              </div>
              <div className="text-xs text-muted-foreground">
                Transfer to the Nigerian bank account below
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {settings.bankAccount.bankName} -{" "}
                  {settings.bankAccount.accountNumber} -{" "}
                  {settings.bankAccount.accountName}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(settings.bankAccount.accountNumber)}
                  className={
                    copied === settings.bankAccount.accountNumber
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === settings.bankAccount.accountNumber ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* USD Bank Transfer */}
          {settings.usdBankAccount?.accountNumber && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-stone-50">
              <div className="font-semibold text-base">
                USD Bank Transfer
              </div>
              <div className="text-xs text-muted-foreground">
                Transfer USD to the bank account below
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {settings.usdBankAccount.bankName} -{" "}
                  {settings.usdBankAccount.accountNumber} -{" "}
                  {settings.usdBankAccount.accountName}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(settings.usdBankAccount.accountNumber)}
                  className={
                    copied === settings.usdBankAccount.accountNumber
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === settings.usdBankAccount.accountNumber ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Money */}
          {settings.mobileMoney?.accountNumber && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-stone-50">
              <div className="font-semibold text-base">MTN MoMo</div>
              <div className="text-xs text-muted-foreground">
                Send to MTN Mobile Money ({settings.mobileMoney.provider})
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {settings.mobileMoney.accountNumber} -{" "}
                  {settings.mobileMoney.accountName}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(settings.mobileMoney.accountNumber)}
                  className={
                    copied === settings.mobileMoney.accountNumber
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === settings.mobileMoney.accountNumber ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Crypto - Bitcoin */}
          {settings.crypto?.bitcoin?.address && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-stone-50">
              <div className="font-semibold text-base">Crypto (BTC)</div>
              <div className="text-xs text-muted-foreground">
                Send BTC to the address below
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {settings.crypto.bitcoin.address}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(settings.crypto.bitcoin.address)}
                  className={
                    copied === settings.crypto.bitcoin.address
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === settings.crypto.bitcoin.address ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Crypto - USDT */}
          {settings.crypto?.usdt?.address && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-stone-50">
              <div className="font-semibold text-base">
                Crypto (USDT - {settings.crypto.usdt.network || "TRC20"})
              </div>
              <div className="text-xs text-muted-foreground">
                Send USDT to the address below
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {settings.crypto.usdt.address}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(settings.crypto.usdt.address)}
                  className={
                    copied === settings.crypto.usdt.address
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === settings.crypto.usdt.address ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* PayPal */}
          {settings.paypal?.link && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-stone-50">
              <div className="font-semibold text-base">PayPal</div>
              <div className="text-xs text-muted-foreground">
                Pay with PayPal
              </div>
              <a
                href={settings.paypal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2"
              >
                <Button className="w-full bg-blue-600 text-white">
                  Pay with PayPal
                </Button>
              </a>
            </div>
          )}

          {/* Skrill */}
          {settings.skrill?.email && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-stone-50">
              <div className="font-semibold text-base">Skrill</div>
              <div className="text-xs text-muted-foreground">
                Pay with Skrill
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {settings.skrill.email}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(settings.skrill.email)}
                  className={
                    copied === settings.skrill.email
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === settings.skrill.email ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onClose}>
          <DrawerContent className="p-4">
            <DrawerHeader>
              <DrawerTitle>Payment Details</DrawerTitle>
            </DrawerHeader>
            <PaymentContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onClose} modal={false}>
          <DialogContent className="w-[60%] h-[70%] overflow-y-scroll p-4 rounded-sm">
            <DialogHeader className="py-5 text-center">
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>
            <PaymentContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PaymentDialog;

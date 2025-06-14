"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  africanCountries,
  americanCountries,
  asianCountries,
  europeanCountries,
} from "@/data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingCart } from "lucide-react";
import LoadingButton from "./LoadingButton";
import {
  fetchExchangeRates,
  calculateSubscriptionPrice,
  formatCurrency,
} from "@/lib/utils/exchangeRates";
import { toast } from "sonner";
import { useUserContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import PaymentDialog from "./PaymentDialog";

interface Props {
  className?: string;
}

const SubscriptionCard = ({ className }: Props) => {
  const { user, isAuthenticated } = useUserContext();
  const formSchema = z.object({
    plan: z.string(),
    duration: z.string(),
    country: z.string(),
    amount: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: "",
      duration: "",
      country: user.country || "",
      amount: "",
    },
  });

  const basePrice = 30;
  const [isLoading, setIsLoading] = useState(false);
  const [isRatesLoading, setIsRatesLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setIsRatesLoading(true);
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error("Error loading exchange rates:", error);
        toast.error("Failed to load exchange rates");
      } finally {
        setIsRatesLoading(false);
      }
    };

    loadExchangeRates();
    // Refresh rates every hour
    const interval = setInterval(loadExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const isAnyOptionSelected = () => {
    const values = form.getValues();
    return Boolean(values.plan && values.duration && values.country);
  };

  // Improved: calculate price based on selected plan, duration, and country
  const calculateTotalPrice = () => {
    const values = form.getValues();
    if (!isAnyOptionSelected() || isRatesLoading) return 0;

    const currency = getCurrency(values.country);
    let price = calculateSubscriptionPrice(
      basePrice,
      values.plan,
      values.duration,
      currency
    );

    // Apply country discount if available
    const discount = countryDiscounts[values.country?.toLowerCase()] || 0;
    if (discount > 0) {
      price = price - price * discount;
    }

    return price;
  };

  // Improved: get currency code based on country value
  const getCurrency = (country: string) => {
    switch (country.toLowerCase()) {
      case "nga":
        return "NGN";
      case "gha":
        return "GHS";
      case "ken":
        return "KES";
      case "cmr":
        return "XAF";
      case "zaf":
        return "ZAR";
      case "uga":
        return "UGX";
      default:
        return "USD";
    }
  };

  // Improved: set amount field automatically when options change
  useEffect(() => {
    if (isAnyOptionSelected() && !isRatesLoading) {
      form.setValue("amount", String(calculateTotalPrice()));
    }
  }, [
    form.watch("plan"),
    form.watch("duration"),
    form.watch("country"),
    isRatesLoading,
  ]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!isAuthenticated) {
        toast.error("Please log in to subscribe.");
        redirect("/login");
        return;
      }
      setOpenPaymentDialog(true);
      setIsLoading(true);
    } catch (error) {
      console.error(error);
      toast.error("Subscription failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const countryDiscounts: Record<string, number> = {
    // country value: discount percentage (e.g., 0.1 for 10%)
    nga: 0.785, // Nigeria gets 78.5% off
    ken: 0.7, // Kenya gets 70% off
    zaf: 0.33, // South Africa gets 33% off
    uga: 0.81, // Uganda gets 81% off
    cmr: 0.2, // Cameroon gets 20% off
    gha: 0.05, // Ghana gets 5% off
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Subscription Counter</CardTitle>
      </CardHeader>
      <CardContent className="m-0 p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 items-center justify-center"
          >
            <div className="w-full flex flex-row justify-around items-center gap-2">
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem className="w-[45%]">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-stone-100 p-2 rounded-full focus-none">
                          <SelectValue placeholder="Desired Plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select Desired Plan</SelectLabel>
                            <SelectItem value="investment">
                              Investment Plan
                            </SelectItem>
                            <SelectItem value="vip">Vip Tips</SelectItem>
                            <SelectItem value="mega">Mega Odds</SelectItem>
                            <SelectItem value="investment&vip">
                              Investment & Vip
                            </SelectItem>
                            <SelectItem value="investment&mega">
                              Investment & Mega
                            </SelectItem>
                            <SelectItem value="vip&mega">Vip & Mega</SelectItem>
                            <SelectItem value="all">All Plans</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="w-[45%]">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-stone-100 p-2 rounded-full focus-none">
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select Duration</SelectLabel>
                            <SelectItem value="10">10 Days Plan</SelectItem>
                            <SelectItem value="20">20 Days Plan</SelectItem>
                            <SelectItem value="30">30 Days Plan</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-[45%]">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-stone-100 p-2 rounded-full focus-none">
                        <SelectValue placeholder="Your Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Your Country</SelectLabel>
                          <SelectLabel>Africa</SelectLabel>
                          {africanCountries.map((data) => (
                            <SelectItem key={data.name} value={data.name}>
                              {data.name}
                            </SelectItem>
                          ))}
                          <SelectLabel>Europe</SelectLabel>
                          {europeanCountries.map((data) => (
                            <SelectItem key={data.name} value={data.name}>
                              {data.name}
                            </SelectItem>
                          ))}
                          <SelectLabel>America</SelectLabel>
                          {americanCountries.map((data) => (
                            <SelectItem key={data.name} value={data.name}>
                              {data.name}
                            </SelectItem>
                          ))}
                          <SelectLabel>Asia</SelectLabel>
                          {asianCountries.map((data) => (
                            <SelectItem key={data.name} value={data.name}>
                              {data.name}
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

            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold">Total Price: </span>
              <span className={`${!isAnyOptionSelected() && "text-[10px]"}`}>
                {isRatesLoading
                  ? "Calculating..."
                  : isAnyOptionSelected()
                  ? formatCurrency(
                      calculateTotalPrice(),
                      getCurrency(form.getValues().country)
                    )
                  : "Choose options to see price"}
              </span>
            </div>

            <LoadingButton
              loading={isLoading}
              type="submit"
              className="rounded-full bg-amber-600 px-10 capitalize"
              disabled={!isAnyOptionSelected() || isRatesLoading}
            >
              <ShoppingCart />
              Subscribe Now
            </LoadingButton>
          </form>
        </Form>
        {/* Payment dialog can be implemented here */}
        {openPaymentDialog && isAuthenticated && (
          <PaymentDialog
            open={openPaymentDialog}
            user={user}
            currency={getCurrency(form.getValues().country)}
            amount={form.getValues().amount}
            plan={form.getValues().plan}
            duration={form.getValues().duration}
            onClose={() => setOpenPaymentDialog(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;

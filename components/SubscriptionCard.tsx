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
import { fetchExchangeRates, calculateSubscriptionPrice, formatCurrency } from "@/lib/utils/exchangeRates";
import { toast } from "sonner";

interface Props {
  className?: string;
}

const SubscriptionCard = ({ className }: Props) => {
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
      country: "",
      amount: "",
    },
  });

  const basePrice = 30;
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [isRatesLoading, setIsRatesLoading] = useState(true);

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setIsRatesLoading(true);
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error('Error loading exchange rates:', error);
        toast.error('Failed to load exchange rates');
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      // Add your form submission logic here
      console.log(data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrency = (country: string) => {
    switch (country.toLowerCase()) {
      case "nga": return "NGN";
      case "gha": return "GHS";
      case "ken": return "KES";
      case "cmr": return "XAF";
      case "zaf": return "ZAR";
      case "uga": return "UGX";
      default: return "USD";
    }
  };

  const calculateTotalPrice = () => {
    const values = form.getValues();
    if (!isAnyOptionSelected() || isRatesLoading) return 0;

    const currency = getCurrency(values.country);
    return calculateSubscriptionPrice(
      basePrice,
      values.plan,
      values.duration,
      currency
    );
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
                            <SelectItem value="investment+vip">
                              Investment & Vip
                            </SelectItem>
                            <SelectItem value="investment+mega">
                              Investment & Mega
                            </SelectItem>
                            <SelectItem value="vip+mega">Vip & Mega</SelectItem>
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
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full bg-stone-100 p-2 rounded-full focus-none">
                        <SelectValue placeholder="Your Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Your Country</SelectLabel>
                          <SelectLabel>Africa</SelectLabel>
                          {africanCountries.map((data) => (
                            <SelectItem key={data.name} value={data.value}>
                              {data.name}
                            </SelectItem>
                          ))}
                          <SelectLabel>Europe</SelectLabel>
                          {europeanCountries.map((data) => (
                            <SelectItem key={data.name} value={data.value}>
                              {data.name}
                            </SelectItem>
                          ))}
                          <SelectLabel>America</SelectLabel>
                          {americanCountries.map((data) => (
                            <SelectItem key={data.name} value={data.value}>
                              {data.name}
                            </SelectItem>
                          ))}
                          <SelectLabel>Asia</SelectLabel>
                          {asianCountries.map((data) => (
                            <SelectItem key={data.name} value={data.value}>
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
                    ? formatCurrency(calculateTotalPrice(), getCurrency(form.getValues().country))
                    : "Choose options to see price"}
              </span>
            </div>

            <LoadingButton
              loading={isLoading}
              type="submit"
              className="rounded-full bg-amber-600 px-10 capitalize"
            >
              <ShoppingCart />
              Subscribe Now
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;

"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { africanCountries, americanCountries, asianCountries, europeanCountries, internationalCompetitions, topleagues, uefaClubCompetitions } from "@/data";
import { useAddPrediction } from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const AddPredictionForm = () => {
  const queryClient = useQueryClient();

  const formSchema = z.object({
    hometeam: z.string().nonempty("Add Hometeam."),
    awayteam: z.string().nonempty("Add Awayteam."),
    datetime: z.coerce.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date/time format.",
    }),
    sportType: z.string().nonempty("Select SportType."),
    league: z.string().nonempty("Select League."),
    tip: z.string().nonempty("Add Tip"),
    odd: z.coerce.number().gt(1, { message: "Input Valid Odd" }),
    over: z.string().optional(),
    chance: z.string().optional(),
    htft: z.string().optional(),
    either: z.string().optional(),
    isBanker: z.boolean(),
    isBtts: z.boolean().optional(),
    subscriptionType: z.string().nonempty("Choose Plan Type"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hometeam: "",
      awayteam: "",
      datetime: "",
      sportType: "",
      league: "",
      tip: "",
      subscriptionType: "",
      odd: 0,
      over: undefined,
      chance: undefined,
      htft: undefined,
      either: undefined,
      isBanker: false,
      isBtts: false,
    },
  });

  const [sportTypeValue, setSportTypeValue] = useState("");

  const { mutateAsync: addPrediction, isPending: isLoading } =
    useAddPrediction();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Subtract 1 hour from the datetime
    const date = new Date(values.datetime);
    date.setHours(date.getHours() - 1);
    const adjustedValues = {
      ...values,
      datetime: date.toISOString(),
    };

    const newPrediction = await addPrediction(adjustedValues);

    if (!newPrediction) {
      return toast("Failed. Please try again.");
    } else {
      toast.success("Prediction Added");
      form.reset();
      setSportTypeValue("");
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
      return;
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full gap-4 p-4 flex flex-wrap justify-around items-start"
      >
        <FormField
          control={form.control}
          name="hometeam"
          render={({ field }) => (
            <FormItem className="w-full md:w-[25%] md:mt-2">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Home Team"
                  className="bg-stone-100 rounded-sm border-secondary focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full md:w-[42%] flex flex-col p-3 bg-stone-600 rounded-sm shadow-sm gap-2 items-center justify-center">
          <div className="bg-transparent rounded-full w-fit h-fit px-2 py-1 border-slate-500 border-1 text-slate-500">
            vs
          </div>

          <FormField
            control={form.control}
            name="sportType"
            render={({ field }) => (
              <FormItem className="w-[70%]">
                <FormControl>
                  <Select
                    value={sportTypeValue}
                    onValueChange={(val) => {
                      setSportTypeValue(val);
                      field.onChange(val);
                    }}
                  >
                    <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary focus-none">
                      <SelectValue placeholder="Sport Type" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup>
                        <SelectLabel>Sport Types</SelectLabel>
                        <SelectItem value="football">Football</SelectItem>
                        <SelectItem value="basketball">BasketBall</SelectItem>
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
            name="datetime"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="datetime-local"
                    placeholder="Date And Time"
                    className="w-full text-sm placeholder:text-sm bg-stone-100 rounded-sm border-secondary focus-none overflow-auto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="awayteam"
          render={({ field }) => (
            <FormItem className="w-full md:w-[25%] md:mt-2">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Away Team"
                  className="bg-stone-100 rounded-sm border-secondary focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="league"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[25%]">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary focus-none">
                    <SelectValue placeholder="League" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      <SelectLabel>Top Leagues</SelectLabel>
                      {topleagues.map((data) => (
                        <SelectItem key={data.name} value={data.value}>{data.name}</SelectItem>
                      ))}
                      <SelectLabel>UEFA Club Competitions</SelectLabel>
                      {uefaClubCompetitions.map((data) => (
                        <SelectItem key={data.name} value={data.value}>{data.name}</SelectItem>
                      ))}
                      <SelectLabel>International Competitions</SelectLabel>
                      {internationalCompetitions.map((data) => (
                        <SelectItem key={data.name} value={data.value}>{data.name}</SelectItem>
                      ))}
                      <SelectLabel>Europe</SelectLabel>
                      {europeanCountries.map((data) => (
                        <SelectItem key={data.name} value={data.value}>{data.name}</SelectItem>
                      ))}
                      <SelectLabel>Africa</SelectLabel>
                      {africanCountries.map((data) => (
                        <SelectItem key={data.name} value={data.value}>{data.name}</SelectItem>
                      ))}
                      <SelectLabel>America</SelectLabel>
                      {americanCountries.map((data) => (
                        <SelectItem key={data.name} value={data.value}>{data.name}</SelectItem>
                      ))}
                      <SelectLabel>Asia</SelectLabel>
                      {asianCountries.map((data) => (
                        <SelectItem key={data.name} value={data.value}>{data.name}</SelectItem>
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
          control={form.control}
          name="tip"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[20%]">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your Prediction"
                  className="bg-stone-100 rounded-sm border-secondary focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="odd"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[20%]">
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Odds"
                  className="bg-stone-100 rounded-sm border-secondary focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subscriptionType"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[25%]">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary focus-none">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      <SelectLabel>Plan</SelectLabel>
                      <SelectItem value="free">Free Tips</SelectItem>
                      <SelectItem value="investment">
                        Investment Plan
                      </SelectItem>
                      <SelectItem value="vip">Vip Tips</SelectItem>
                      <SelectItem value="mega">Mega Odds</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {sportTypeValue === "football" && (
          <>
            <FormField
              control={form.control}
              name="over"
              render={({ field }) => (
                <FormItem className="w-full sm:w-[45%] md:w-[25%]">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary focus-none">
                        <SelectValue placeholder="Overs/Unders" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectGroup>
                          <SelectLabel>Select Total Goals</SelectLabel>
                          <SelectItem value="OV1.5">Over 1.5</SelectItem>
                          <SelectItem value="OV2.5">Over 2.5</SelectItem>
                          <SelectItem value="OV3.5">Over 3.5</SelectItem>
                          <SelectItem value="OV4.5">Over 4.5</SelectItem>
                          <SelectItem value="UN4.5">Under 4.5</SelectItem>
                          <SelectItem value="UN3.5">Under 3.5</SelectItem>
                          <SelectItem value="UN2.5">Under 2.5</SelectItem>
                          <SelectItem value="UN1.5">Under 1.5</SelectItem>
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
              name="chance"
              render={({ field }) => (
                <FormItem className="w-full sm:w-[45%] md:w-[20%]">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary focus-none">
                        <SelectValue placeholder="Chance" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectGroup>
                          <SelectLabel>Select Double Chance</SelectLabel>
                          <SelectItem value="1X">Home Or Draw</SelectItem>
                          <SelectItem value="12">Home Or Away</SelectItem>
                          <SelectItem value="X2">Draw Or Away</SelectItem>
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
              name="either"
              render={({ field }) => (
                <FormItem className="w-full sm:w-[45%] md:w-[20%]">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary focus-none">
                        <SelectValue placeholder="Either Halfs" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectGroup>
                          <SelectLabel>Plan</SelectLabel>
                          <SelectItem value="HWEH">HWEH</SelectItem>
                          <SelectItem value="AWEH">AWEH</SelectItem>
                          <SelectItem value="DEH">DEH</SelectItem>
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
              name="htft"
              render={({ field }) => (
                <FormItem className="w-full sm:w-[45%] md:w-[25%]">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary focus-none">
                        <SelectValue placeholder="Halftime/FullTime" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectGroup>
                          <SelectLabel>Halftime/Fulltime</SelectLabel>
                          <SelectItem value="1/1">Home/Home</SelectItem>
                          <SelectItem value="1/X">Home/Draw</SelectItem>
                          <SelectItem value="1/2">Home/Away</SelectItem>
                          <SelectItem value="X/1">Draw/Home</SelectItem>
                          <SelectItem value="X/X">Draw/Draw</SelectItem>
                          <SelectItem value="X/2">Draw/Away</SelectItem>
                          <SelectItem value="2/1">Away/Home</SelectItem>
                          <SelectItem value="2/X">Away/Draw</SelectItem>
                          <SelectItem value="2/2">Away/Away</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="w-full flex flex-nowrap justify-around">
          <FormField
            control={form.control}
            name="isBanker"
            render={({ field }) => (
              <FormItem className="w-[30%] space-x-2 flex flex-nowrap items-center p-2 bg-stone-600 rounded-full">
                <FormControl>
                  <div className="w-full flex flex-nowrap">
                    <Switch
                      id="isBanker"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label className="text-white" htmlFor="airplane-mode">
                      Banker Bet?
                    </Label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          {sportTypeValue === "football" && (
            <FormField
              control={form.control}
              name="isBtts"
              render={({ field }) => (
                <FormItem className="w-[30%] space-x-2 flex flex-nowrap items-center p-2 bg-stone-600 rounded-full">
                  <FormControl>
                    <div className="flex flex-nowrap w-full">
                      <Switch
                        id="isBtts"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label className="text-white" htmlFor="airplane-mode">
                        BTTS?
                      </Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <LoadingButton
            loading={isLoading}
            type="submit"
            className="max-w-[30%] text-stone-100 rounded-lg uppercase"
          >
            Submit Prediction
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default AddPredictionForm;

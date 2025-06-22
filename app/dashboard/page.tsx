"use client";

import BlogCard from "@/components/BlogCard";
import BlogHeadingTextWrapper from "@/components/BlogHeadingTextWrapper";
import LoadingButton from "@/components/LoadingButton";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import SubscriptionCard from "@/components/SubscriptionCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserProfileEdit from "@/components/UserProfileEdit";
import { INITIAL_USER, useUserContext } from "@/context/AuthContext";
import { getCurrentUser } from "@/lib/appwrite/api";
import { getBlog, getFromYesterdaysPredictions } from "@/lib/appwrite/fetch";
import {
  useEditSubscription,
  useSignOutAccount,
} from "@/lib/react-query/queriesAndMutations";
import { checkAndUpdateSubscription } from "@/lib/utils/SubscriptionLogic";
import { verificationMail } from "@/lib/utils/verificationMail";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Models } from "appwrite";
import { formatDate } from "date-fns";
import { CircleAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const formattedTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toTimeString().split(":").slice(0, 2).join(":");
};

const getDateOnly = (input: string | Date) => {
  const date = new Date(input);
  return date.toISOString().split("T")[0];
};

const Page = () => {
  const { mutateAsync: signOutAccount, isPending: isSigningOut } =
    useSignOutAccount();
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useUserContext();

  const { mutateAsync: verifyMail, isPending: isVerifyingMail } = useMutation({
    mutationFn: async ({
      email,
      name,
      link,
    }: {
      email: string;
      name: string;
      link: string;
    }) => verificationMail(email, name, link),
  });

  // Only fetch user if authenticated to avoid Appwrite 401 error
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
  });

  const { data: predictions } = useQuery({
    queryKey: ["predictions"],
    queryFn: getFromYesterdaysPredictions,
  });

  const today = getDateOnly(new Date());
  const yesterday = getDateOnly(new Date(Date.now() - 86400000));
  const tomorrow = getDateOnly(new Date(Date.now() + 86400000));
  const [day, setDay] = useState(today);

  const bankerPredictions = predictions?.filter(
    (prediction) =>
      getDateOnly(prediction.datetime) === day && prediction.isBanker === true
  );

  const dateButtons = [
    { label: "Yesterday", date: yesterday },
    { label: "Today", date: today },
    { label: "Tomorrow", date: tomorrow },
  ];

  const handleSignout = async () => {
    await signOutAccount();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    redirect("/login");
  };

  // Get all subscriptions as array
  const subscriptions: Models.Document[] = currentUser?.subscription
    ? Array.isArray(currentUser.subscription)
      ? currentUser.subscription
      : [currentUser.subscription]
    : [];

  // Helper functions
  const anyFreezed = subscriptions.some((sub) => sub.isFreeze);
  const anyValid = subscriptions.some((sub) => sub.isValid && !sub.isFreeze);
  const anyExpiring = subscriptions.some(
    (sub) => sub.isValid && !sub.isFreeze && isExpiring(sub)
  );
  const allExpired =
    subscriptions.length > 0 &&
    subscriptions.every((sub) => !sub.isValid && !sub.isFreeze);

  let status = "Inactive";
  let statusColor = "bg-red-500";
  if (anyFreezed) {
    status = "Freezed";
    statusColor = "bg-blue-400";
  } else if (anyExpiring) {
    status = "Expiring";
    statusColor = "bg-yellow-500";
  } else if (anyValid) {
    status = "Active";
    statusColor = "bg-green-500";
  } else if (allExpired) {
    status = "Expired";
    statusColor = "bg-red-500";
  }

  const { data: blogs, isLoading: isBlogsLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlog,
  });

  const interestingBlogs = blogs
    ?.sort((a, b) => a.comments.length - b.comments.length)
    .slice(0, 6);

  const { mutateAsync: editSubscription } = useEditSubscription();

  useEffect(() => {
    if (currentUser?.subscription) {
      // If subscription is an array, check all; else, check the single subscription
      const subs = Array.isArray(currentUser.subscription)
        ? currentUser.subscription
        : [currentUser.subscription];
      subs.forEach((sub) => {
        checkAndUpdateSubscription(sub, editSubscription);
      });
    }
  }, [currentUser, editSubscription]);

  async function ResendMail() {
    try {
      await verifyMail({
      email: currentUser?.email,
      name: currentUser?.name ? currentUser.name : "",
      link: `${process.env.NEXT_PUBLIC_APP_URL}/verification/${currentUser?.$id}`,
    });

    toast.success("Verification sent. Please check your Mailbox!");
    } catch (error) {
      console.error("Error resending verification mail:", error);
      // Optionally, you can show a toast or notification here
      toast.error("Failed to resend verification mail. Please try again.");
    }
  }

  // Early return: block unverified users from seeing dashboard content
  if (isAuthenticated && currentUser && currentUser.isVerified === false) {
    return (
      <div className="text-lg flex flex-col gap-4 size-full justify-center items-center">
        <CircleAlert size={100} className="text-amber-500" />
        <span>Please verify your account to access the dashboard.</span>
        <LoadingButton loading={isVerifyingMail} onClick={ResendMail} variant={"ghost"} className="text-cyan-500 hover:underline">
          Send Verification Mail
        </LoadingButton>
      </div>
    );
  }

  return (
    <>
      <main>
        <section className="w-full flex items-center flex-col bg-black text-white py-8 px-1">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <div className="min-md:w-2/3 max-md:w-full flex flex-col bg-primary rounded-md min-md:p-5 max-md:p-2">
            <div className="flex items-center justify-between mb-4 px-5 max-md:px-2">
              <p className="text-xl font-semibold">User Profile</p>
              <LoadingButton
                loading={isSigningOut}
                disabled={isSigningOut}
                onClick={handleSignout}
                variant={"ghost"}
                className="font-semibold text-amber-600 hover:bg-transparent hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 rounded-full underline-offset-4 hover:underline decoration-amber-600 decoration-2 focus:decoration-amber-500 focus:decoration-2"
              >
                Logout
              </LoadingButton>
            </div>
            <div className="w-full flex md:flex-row max-md:flex-col gap-2 p-2 items-center justify-around">
              <div className="min-md:size-auto max-md:w-full flex flex-col py-5 px-10 rounded-md bg-stone-500 items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={currentUser?.imageUrl}
                    alt={currentUser?.name}
                    className="object-contain"
                  />
                  <AvatarFallback>
                    {currentUser?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-center text-lg text-black font-semibold my-2">
                  {currentUser?.name}
                </p>
                {currentUser && (
                  <div className="w-fit flex flex-row items-center gap-1 justify-center">
                    <UserProfileEdit user={currentUser} />
                    <NotificationsDropdown className="bg-black text-secondary" />
                  </div>
                )}
              </div>
              <div className="flex min-md:flex-1 max-md:w-full flex-col space-y-2 text-black font-semibold">
                <div className="w-full bg-secondary flex items-center justify-between rounded-sm p-3">
                  <span>Email:</span>
                  <span>{currentUser?.email}</span>
                </div>
                <div className="w-full bg-secondary flex items-center justify-between rounded-sm p-3">
                  <span>Country:</span>
                  <span>
                    {currentUser?.country ? currentUser.country : "N/A"}
                  </span>
                </div>
                <div className="w-full bg-secondary flex items-center justify-between rounded-sm p-3">
                  <span>Registered:</span>
                  <span>
                    {currentUser?.$createdAt
                      ? formatDate(currentUser.$createdAt, "PPP")
                      : "N/A"}
                  </span>
                </div>
                <div className="w-full bg-secondary flex items-center justify-between rounded-sm p-3">
                  <span>Subscription Status:</span>
                  <span
                    className={`text-white rounded-full font-normal text-sm px-2 py-1 ${statusColor}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col justify-center items-center">
          <div className="p-5 w-full flex items-center justify-center gap-5">
            {(subscriptions.length > 0 ||
              (bankerPredictions && bankerPredictions.length > 0)) &&
              dateButtons.map(({ label, date }) => (
                <Button
                  key={date}
                  onClick={() => setDay(date)}
                  className={`p-2 md:w-[20%] w-[30%] text-sm ${
                    day === date
                      ? "bg-transparent border border-primary text-primary"
                      : "bg-primary text-white"
                  }`}
                >
                  {label}
                </Button>
              ))}
          </div>
        </section>
        <section className="w-full flex flex-col items-center mt-8">
          {subscriptions.length === 0 ? (
            <div className="w-full max-w-3xl text-center my-6">
              <h2 className="text-xl font-bold mb-2 capitalize">
                No Active Subscription
              </h2>
              {bankerPredictions?.length === 0 ? (
                <p className="text-gray-500 py-8">
                  No Banker Predictions Available
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="border-collapse w-full text-center text-[10px] overflow-x-scroll no-scrollbar">
                    <thead>
                      <tr className="bg-primary text-secondary">
                        <th className="py-2">Time</th>
                        <th className="py-2">Leagues</th>
                        <th className="py-2">Matches</th>
                        <th className="py-2">Tips</th>
                        <th className="py-2">Scores</th>
                        <th className="py-2">Odds</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankerPredictions?.map((pred: Models.Document) => (
                        <tr
                          key={pred.$id}
                          className="text-[12px] odd:bg-white even:bg-gray-100 border-b"
                        >
                          <td className="py-2">
                            {formattedTime(pred.datetime)}
                          </td>
                          <td className="py-2 uppercase">
                            {pred.league || "N/A"}
                          </td>
                          <td className="py-2">
                            {pred.hometeam + " vs " + pred.awayteam}
                          </td>
                          <td className="py-2">{pred.tip}</td>
                          <td
                            className={` ${
                              pred.status === "win"
                                ? "text-green-500"
                                : pred.status === "loss"
                                ? "text-red-500"
                                : "text-gray-600"
                            } py-2`}
                          >
                            {pred.homescore + ":" + pred.awayscore}
                          </td>
                          <td className="py-2">{pred.odd?.toString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            // For each type, show status based on all subscriptions
            (() => {
              // Collect all types from all subscriptions
              const allTypes = subscriptions
                .flatMap((sub) =>
                  sub.subscriptionType === "all"
                    ? ["investment", "vip", "mega"]
                    : sub.subscriptionType.split("&")
                )
                .filter((v, i, a) => a.indexOf(v) === i); // unique

              return allTypes.map((type, idx) => {
                // Find all subscriptions for this type
                const subsForType = subscriptions.filter(
                  (sub) =>
                    sub.subscriptionType === "all" ||
                    sub.subscriptionType.split("&").includes(type)
                );

                const isTypeFreezed = subsForType.some((sub) => sub.isFreeze);
                const isTypeValid = subsForType.some(
                  (sub) => sub.isValid && !sub.isFreeze
                );
                const isTypeExpiring = subsForType.some(
                  (sub) => sub.isValid && !sub.isFreeze && isExpiring(sub)
                );
                const isTypeAllExpired =
                  subsForType.length > 0 &&
                  subsForType.every((sub) => !sub.isValid && !sub.isFreeze);

                // Filter predictions for this type and selected day
                const predictionsForType = (predictions || [])
                  .filter(
                    (pred: Models.Document) =>
                      getDateOnly(pred.datetime) === day &&
                      pred.subscriptionType === type
                  )
                  .sort(
                    (a: Models.Document, b: Models.Document) =>
                      new Date(b.datetime).getTime() -
                      new Date(a.datetime).getTime()
                  );

                // Message for empty state
                let msg = "No prediction added yet";
                if (day === yesterday) msg = "No prediction was added";
                else if (day === today) msg = "No prediction added yet";
                else if (day === tomorrow) msg = "No prediction available yet";

                if (isTypeFreezed) {
                  return (
                    <div
                      key={type + idx}
                      className="w-full max-w-3xl text-center my-6"
                    >
                      <h2 className="text-xl font-bold mb-2 capitalize">
                        {type} Predictions
                      </h2>
                      <div className="text-gray-500 py-8">
                        Predictions are temporarily frozen
                      </div>
                    </div>
                  );
                }

                if (isTypeAllExpired) {
                  return (
                    <div
                      key={type + idx}
                      className="w-full max-w-3xl text-center my-6"
                    >
                      <h2 className="text-xl font-bold mb-2 capitalize">
                        {type} Predictions
                      </h2>
                      <div className="text-gray-500 py-8">
                        Your subscription has expired. Please renew to access
                        predictions.
                      </div>
                    </div>
                  );
                }

                if (predictionsForType.length === 0) {
                  return (
                    <div
                      key={type + idx}
                      className="w-full max-w-3xl text-center my-6"
                    >
                      <h2 className="text-xl font-bold mb-2 capitalize">
                        {type} Predictions
                      </h2>
                      <div className="text-gray-500 py-8">{msg}</div>
                    </div>
                  );
                }

                return (
                  <div key={type + idx} className="w-full max-w-3xl my-6 p-2">
                    <h2 className="text-xl font-bold mb-2 capitalize">
                      {type} Predictions
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="border-collapse w-full text-center text-[10px] overflow-x-scroll no-scrollbar">
                        <thead>
                          <tr className="bg-primary text-secondary">
                            <th className="py-2">Time</th>
                            <th className="py-2">Leagues</th>
                            <th className="py-2">Matches</th>
                            <th className="py-2">Tips</th>
                            <th className="py-2">Scores</th>
                            <th className="py-2">Odds</th>
                          </tr>
                        </thead>
                        <tbody>
                          {predictionsForType.map((pred: Models.Document) => (
                            <tr
                              key={pred.$id}
                              className="text-[12px] odd:bg-white even:bg-gray-100 border-b"
                            >
                              <td className="py-2">
                                {formattedTime(pred.datetime)}
                              </td>
                              <td className="py-2 uppercase">
                                {pred.league || "N/A"}
                              </td>
                              <td className="py-2">
                                {pred.hometeam + " vs " + pred.awayteam}
                              </td>
                              <td className="py-2">{pred.tip}</td>
                              <td
                                className={` ${
                                  pred.status === "win"
                                    ? "text-green-500"
                                    : pred.status === "loss"
                                    ? "text-red-500"
                                    : "text-gray-600"
                                } py-2`}
                              >
                                {pred.homescore + ":" + pred.awayscore}
                              </td>
                              <td className="py-2">{pred.odd?.toString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold p-2">
                      Accumulated Odds:{" "}
                      {predictionsForType.length > 0
                        ? predictionsForType
                            .reduce(
                              (acc, pred) => acc * (Number(pred.odd) || 1),
                              1
                            )
                            .toFixed(2)
                        : "N/A"}
                    </p>
                  </div>
                );
              });
            })()
          )}
        </section>
        {!subscriptions ||
          (!anyValid && (
            <section className="p-2">
              <SubscriptionCard />
            </section>
          ))}
        <section className="w-full flex flex-col p-2">
          <div className="space-y-2">
            <BlogHeadingTextWrapper
              text="Interesting Blogs"
              bgColor="bg-primary"
              textColor="text-secondary"
            />
            {isBlogsLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-2 grid max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {interestingBlogs?.map((blog) => (
                  <BlogCard key={blog.$id} blog={blog} textSize={100} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

function isExpiring(subscription: Models.Document) {
  if (!subscription?.isValid) return false;
  const duration = Number(subscription.duration) || 0;
  const freezeStart = subscription.freezeStart;
  const freezeEnd = subscription.freezeEnd;
  const createdAt = subscription.$createdAt;
  const updatedAt = subscription.updatedAt;
  const now = new Date();

  const startDate = new Date(updatedAt || createdAt);
  const freezeDuration =
    freezeStart && freezeEnd
      ? new Date(freezeEnd).getTime() - new Date(freezeStart).getTime()
      : 0;

  const expiryDate = new Date(
    startDate.getTime() + duration * 24 * 60 * 60 * 1000 + freezeDuration
  );

  // Consider expiring if less than or equal to 3 days left
  const daysLeft =
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysLeft <= 3 && daysLeft > 0;
}

export default Page;

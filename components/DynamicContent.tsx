"use client";

import BlogSection from "@/components/BlogSection";
import CategorySection from "@/components/CategorySection";
import Hero from "@/components/Hero";
import InvestmentResult from "@/components/InvestmentResult";
import PageContent from "@/components/PageContent";
import PredictionTable from "@/components/PredictionTable";
import SubscriptionCard from "@/components/SubscriptionCard";
import WBTLinks from "@/components/WBTLinks";
import {
  singleSeoPageByUrl,
  use4MostRecentBlogs,
  usePredictionFromYesterday,
} from "@/lib/react-query/queries";

const DynamicContent = ({
  name,
  title,
  totalGoals,
}: {
  name: string;
  title: string;
  totalGoals?: string;
}) => {
  // const [adlink, adimgurl] = advert;

  const {
    data: predictions,
    isPending: isLoading,
    error: predictionsError,
  } = usePredictionFromYesterday();

  const { data: blog, isPending: isBlogLoading } = use4MostRecentBlogs();

  const sortedBlog = blog?.sort((a, b) => {
    return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
  });

  const trimmedBlog = sortedBlog?.slice(0, 4);

  const filteredPredictions = predictions?.filter((prediction) => {
    if (name === "draw") {
      return prediction.tip === "X";
    }
    if (name === "isBtts") {
      return prediction.isBtts;
    }
    if (name === "chance") {
      return (
        prediction.chance === "1X" ||
        prediction.chance === "12" ||
        prediction.chance === "X2"
      );
    }
    if (name === "either") {
      return (
        prediction.either === "HWEH" ||
        prediction.either === "AWEH" ||
        prediction.either === "DEH"
      );
    }
    if (name === "over") {
      if (totalGoals) {
        return prediction.over === totalGoals;
      }
      return (
        prediction.over === "OV1.5" ||
        prediction.over === "OV2.5" ||
        prediction.over === "OV3.5" ||
        prediction.over === "OV4.5" ||
        prediction.over === "UN4.5" ||
        prediction.over === "UN3.5" ||
        prediction.over === "UN2.5" ||
        prediction.over === "UN1.5"
      );
    }
    if (name === "htft") {
      return (
        prediction.htft === "1/X" ||
        prediction.htft === "1/2" ||
        prediction.htft === "X/2" ||
        prediction.htft === "2/X" ||
        prediction.htft === "2/1" ||
        prediction.htft === "X/1" ||
        prediction.htft === "1/1" ||
        prediction.htft === "X/X" ||
        prediction.htft === "2/2"
      );
    }
    if (name === "isBanker") {
      return prediction.isBanker;
    }

    return prediction.subscriptionType === "free";
  });

  const pageTitle =
    name === "free"
      ? ""
      : name === "isBanker"
      ? "banker"
      : name === "isBtts"
      ? "btts"
      : name;

  const {
    data: seopage,
    isPending: isSeoLoading,
    error: seoError,
  } = singleSeoPageByUrl(pageTitle);

  if (predictionsError || seoError) {
    console.error("Error loading data:", { predictionsError, seoError });
  }

  return (
    <main>
      <section>
        <Hero
          h1tag={seopage?.h1tag}
          description={seopage?.description}
          isSeoLoading={isSeoLoading}
        />
      </section>
      <section className="md:mx-[5rem] m-0">
        <CategorySection />
        <PredictionTable
          title={title}
          tableStat={filteredPredictions}
          category={name}
          loading={isLoading}
        />
        <WBTLinks />
        <InvestmentResult />
        <BlogSection blog={trimmedBlog} isLoading={isBlogLoading} />
        <SubscriptionCard className="m-2" />
        <PageContent content={seopage?.content} />
      </section>
    </main>
  );
};

export default DynamicContent;

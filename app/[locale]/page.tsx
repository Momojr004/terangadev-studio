import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { StatsBar } from "@/components/home/stats-bar";
import { ICPPaths } from "@/components/home/icp-paths";
import { ProductsTeaser } from "@/components/home/products-teaser";
import { WorkTeaser } from "@/components/home/work-teaser";
import { WhyUs } from "@/components/home/why-us";
import { ContactCTA } from "@/components/home/contact-cta";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <StatsBar />
      <ICPPaths />
      <ProductsTeaser />
      <WorkTeaser />
      <WhyUs />
      <ContactCTA />
    </>
  );
}

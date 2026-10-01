import { useLayoutEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookingDrawer } from "@/components/booking-drawer";
import { CarePromise } from "@/components/care-promise";
import { CartBar } from "@/components/cart-bar";
import { CatalogGrid } from "@/components/catalog-grid";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { ServiceArea } from "@/components/service-area";
import { Testimonials } from "@/components/testimonials";
import { TrustBar } from "@/components/trust-bar";
import { Visit } from "@/components/visit";
import { listPublicCatalog } from "@/lib/catalog-api";
import { seoHead } from "@/lib/seo";
import { getSiteOrigin } from "@/lib/site-origin";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [catalog, origin] = await Promise.all([listPublicCatalog(), getSiteOrigin()]);
    return { ...catalog, origin };
  },
  head: ({ loaderData }) => seoHead(loaderData?.origin ?? ""),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const setListings = useAppStore((s) => s.setListings);

  useLayoutEffect(() => {
    setListings(data.items, data.categories, data.subcategories);
  }, [data.items, data.categories, data.subcategories, setListings]);

  return (
    <div id="top" className="min-h-dvh bg-linen text-ink">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <CatalogGrid items={data.items} categories={data.categories} subcategories={data.subcategories} />
        <CarePromise />
        <Testimonials />
        <ServiceArea />
        <Visit />
        <Faq />
      </main>
      <Footer />
      <CartBar />
      <BookingDrawer />
    </div>
  );
}

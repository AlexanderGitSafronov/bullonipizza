import { Hero } from "@/components/sections/hero";
import { PromoBanner } from "@/components/sections/promo-banner";
import { Popular } from "@/components/sections/popular";
import { Categories } from "@/components/sections/categories";
import { Features } from "@/components/sections/features";
import { DeliveryInfo } from "@/components/sections/delivery-info";
import { Testimonials } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <PromoBanner />
      <Hero />
      <Popular />
      <Categories />
      <Features />
      <DeliveryInfo />
      <Testimonials />
      <CTA />
    </>
  );
}

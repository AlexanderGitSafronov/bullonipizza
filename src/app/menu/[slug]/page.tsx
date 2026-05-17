import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/get-product";
import { ProductDetail } from "./product-detail";

// Generate routes for known products at build time so they're snappy.
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "BulloniPizza" };
  return {
    title: `${product.nameUk} · BulloniPizza`,
    description: product.descUk,
    openGraph: {
      title: `${product.nameUk} · BulloniPizza`,
      description: product.descUk,
      images: [{ url: product.image }],
    },
  };
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bullonipizza.vercel.app";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product.categorySlug, product.slug);

  // schema.org Product / Offer — gets surfaced in Google rich results.
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.nameUk,
    description: product.descUk,
    image: [product.image],
    sku: product.slug,
    brand: { "@type": "Brand", name: "BulloniPizza" },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/menu/${product.slug}`,
      priceCurrency: "UAH",
      price: product.basePrice,
      availability:
        product.inStock !== false
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} related={related} />
    </>
  );
}

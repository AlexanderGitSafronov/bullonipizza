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

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product.categorySlug, product.slug);
  return <ProductDetail product={product} related={related} />;
}

import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/get-product";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bullonipizza.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllProductSlugs();
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/menu",
    "/delivery",
    "/about",
    "/favorites",
    "/login",
    "/register",
    "/legal/privacy",
    "/legal/cookies",
    "/legal/terms",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
  const products: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/menu/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));
  return [...staticPages, ...products];
}

import { sampleProducts, type SampleProduct } from "./sample-data";

// Used by /menu/[slug] — server-side. Tries DB first, falls back to bundled
// sample data so the detail page works even without DATABASE_URL.
export async function getProductBySlug(
  slug: string
): Promise<SampleProduct | null> {
  if (!process.env.DATABASE_URL) {
    return sampleProducts.find((p) => p.slug === slug) ?? null;
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const product = await prisma.product.findFirst({
      where: { slug, isAvailable: true },
      include: { category: true },
    });
    if (!product) {
      return sampleProducts.find((p) => p.slug === slug) ?? null;
    }
    return {
      id: product.id,
      slug: product.slug,
      nameUk: product.nameUk,
      nameEn: product.nameEn,
      nameRu: product.nameRu,
      descUk: product.descUk,
      descEn: product.descEn,
      descRu: product.descRu,
      image: product.image,
      basePrice: Number(product.basePrice),
      categorySlug: product.category.slug,
      isPopular: product.isPopular,
      hasSize: product.hasSize,
      hasCrust: product.hasCrust,
      discount: product.discount,
    };
  } catch {
    return sampleProducts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 4
): Promise<SampleProduct[]> {
  if (!process.env.DATABASE_URL) {
    return sampleProducts
      .filter((p) => p.categorySlug === categorySlug && p.slug !== excludeSlug)
      .slice(0, limit);
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const products = await prisma.product.findMany({
      where: {
        category: { slug: categorySlug },
        slug: { not: excludeSlug },
        isAvailable: true,
      },
      include: { category: true },
      take: limit,
    });
    return products.map((p) => ({
      id: p.id,
      slug: p.slug,
      nameUk: p.nameUk,
      nameEn: p.nameEn,
      nameRu: p.nameRu,
      descUk: p.descUk,
      descEn: p.descEn,
      descRu: p.descRu,
      image: p.image,
      basePrice: Number(p.basePrice),
      categorySlug: p.category.slug,
      isPopular: p.isPopular,
      hasSize: p.hasSize,
      hasCrust: p.hasCrust,
      discount: p.discount,
    }));
  } catch {
    return sampleProducts
      .filter((p) => p.categorySlug === categorySlug && p.slug !== excludeSlug)
      .slice(0, limit);
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (!process.env.DATABASE_URL) {
    return sampleProducts.map((p) => p.slug);
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.product.findMany({
      where: { isAvailable: true },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch {
    return sampleProducts.map((p) => p.slug);
  }
}

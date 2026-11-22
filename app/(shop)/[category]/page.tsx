import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductCatalog from "@/components/products/ProductCatalog";
import formatCategoryName from "@/components/home/formatCategoryName";
import LoadingScreen from "@/components/navigation/LoadingScreen";
import { getCategories } from "@/lib/categories";
import { getProducts, getProductsByCategory } from "@/lib/products";

interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category: categorySlug } = await params;

    if (categorySlug !== "all-products" && !(await getCategories()).includes(categorySlug)) {
        notFound();
    }

    return (
        <Suspense fallback={<LoadingScreen isRouteFallback />}>
            <CategoryProducts categorySlug={categorySlug} />
        </Suspense>
    );
}

async function CategoryProducts({ categorySlug }: { categorySlug: string }) {
    const isAllProducts = categorySlug === "all-products";
    const products = isAllProducts ? await getProducts() : await getProductsByCategory(categorySlug);

    return (
        <ProductCatalog
            key={categorySlug}
            title={isAllProducts ? "All products" : formatCategoryName(categorySlug)}
            products={products}
        />
    );
}

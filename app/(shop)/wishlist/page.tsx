

"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import ProductCatalog from "@/components/products/ProductCatalog";
import type { RootState } from "@/redux/store";

const WishListPage = () => {
    const products = useSelector((state: RootState) => state.wishlist.products);

    if (products.length > 0) {
        return <ProductCatalog title="Wishlist" products={products} />;
    }

    return (
        <section className="empty-state-enter mx-auto w-full px-4 py-8 text-center sm:px-6 lg:pr-8 min-[992px]:-ml-16 min-[992px]:w-[calc(100%+4rem)] min-[992px]:pl-16 lg:pl-24">
            <h1 className="text-3xl font-bold">Wishlist</h1>
            <p className="mt-3 text-ca-black/70 dark:text-ca-grey">
                You haven&apos;t saved any products yet.
            </p>
            <Link
                href="/all-products"
                className="mt-6 inline-flex rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black"
            >
                Browse products
            </Link>
        </section>
    );
};

export default WishListPage;
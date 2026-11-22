import Link from "next/link";
import { FaBagShopping, FaTags, FaTruckFast } from "react-icons/fa6";
import { HiArrowRight } from "react-icons/hi2";
import formatCategoryName from "@/components/home/formatCategoryName";
import type { FeaturedProduct } from "@/components/home/types";

interface ShoppingBenefitsSectionProps {
    popularCategories: FeaturedProduct[];
}

const ShoppingBenefitsSection = ({ popularCategories }: ShoppingBenefitsSectionProps) => (
    <section data-home-panel className="relative w-full shrink-0 px-4 py-12 sm:px-6 min-[992px]:motion-safe:pl-16 min-[992px]:motion-safe:pr-6 min-[992px]:motion-safe:flex min-[992px]:motion-safe:h-full min-[992px]:motion-safe:items-start min-[992px]:motion-safe:py-8 lg:motion-safe:pl-24 lg:motion-safe:pr-8">
        <div className="relative z-10 w-full">
            <div data-reveal-heading>
                <p className="text-sm font-semibold uppercase tracking-widest text-ca-black/60 dark:text-white/60">
                    A better way to shop
                </p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                    Everything you need, all in one place.
                </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div data-reveal-item className="min-h-48 rounded-2xl border border-ca-grey/60 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
                    <FaBagShopping aria-hidden="true" className="text-2xl text-ca-black dark:text-ca-orange" />
                    <h3 className="mt-4 font-semibold">Convenient shopping</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ca-black/70 dark:text-white/70">
                        Find everyday essentials and more in one place. Use search or browse categories to get started.
                    </p>
                </div>
                <div data-reveal-item className="min-h-48 rounded-2xl border border-ca-grey/60 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
                    <FaTags aria-hidden="true" className="text-2xl text-ca-black dark:text-ca-orange" />
                    <h3 className="mt-4 font-semibold">Great deals</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ca-black/70 dark:text-white/70">
                        Compare product details, ratings, and reviews across the catalog to find what fits you.
                    </p>
                </div>
                <div data-reveal-item className="min-h-48 rounded-2xl border border-ca-grey/60 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
                    <FaTruckFast aria-hidden="true" className="text-2xl text-ca-black dark:text-ca-orange" />
                    <h3 className="mt-4 font-semibold">Fast delivery</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ca-black/70 dark:text-white/70">
                        Choose your favorites and enjoy convenient delivery right to your door.
                    </p>
                </div>
            </div>
            <Link
                data-reveal-item
                href="/all-products"
                className="explore-products-link relative isolate mt-8 flex w-fit items-center gap-2 overflow-hidden rounded-full bg-ca-orange px-6 py-3 font-semibold text-ca-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black dark:focus-visible:outline-white"
            >
                <span className="relative">Explore all products</span>
                <HiArrowRight aria-hidden="true" className="explore-products-link__arrow relative shrink-0" />
            </Link>
            {popularCategories.length > 0 && (
                <div className="mt-12 border-t border-ca-grey/50 pt-6 dark:border-white/10">
                    <p data-reveal-item className="mb-3 text-sm font-semibold uppercase tracking-wide text-ca-black/60 dark:text-white/60">
                        Or browse a popular category
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {popularCategories.slice(0, 4).map((product) => (
                            <Link
                                key={product.category}
                                href={`/${encodeURIComponent(product.category)}`}
                                data-reveal-item
                                className="rounded-full bg-ca-grey/35 px-4 py-2 text-sm font-semibold transition-colors hover:bg-ca-orange/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:bg-white/10 dark:hover:bg-ca-orange/20"
                            >
                                {formatCategoryName(product.category)}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </section>
);

export default ShoppingBenefitsSection;

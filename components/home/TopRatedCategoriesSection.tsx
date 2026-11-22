import Image from "next/image";
import Link from "next/link";
import { HiSquares2X2 } from "react-icons/hi2";
import formatCategoryName from "@/components/home/formatCategoryName";
import getCategoryIcon from "@/components/navigation/categoryIcons";
import type { FeaturedProduct } from "@/components/home/types";

interface TopRatedCategoriesSectionProps {
    products: FeaturedProduct[];
}

const TopRatedCategoriesSection = ({ products }: TopRatedCategoriesSectionProps) => (
    <section data-home-panel data-no-item-blur className="relative w-full shrink-0 px-4 py-12 sm:px-6 min-[992px]:motion-safe:pl-16 min-[992px]:motion-safe:pr-6 min-[992px]:motion-safe:flex min-[992px]:motion-safe:h-full min-[992px]:motion-safe:items-start min-[992px]:motion-safe:py-8 lg:motion-safe:pl-24 lg:motion-safe:pr-8">
        <div className="relative z-10 w-full">
            <div data-reveal-heading className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-ca-black/60 dark:text-white/60">
                    Handpicked for you
                </p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                    Explore top-rated categories
                </h2>
            </div>
            {products.length > 0 ? (
                <div className="category-card-grid grid grid-cols-2 gap-4 min-[992px]:grid-cols-3 lg:gap-6">
                    {products.map((product) => {
                        const CategoryIcon = getCategoryIcon(product.category) ?? HiSquares2X2;

                        return (
                            <Link
                                key={product.category}
                                href={`/${encodeURIComponent(product.category)}`}
                                data-reveal-item
                                className="category-card relative isolate min-h-48 min-w-0 overflow-hidden bg-transparent p-3 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ca-orange"
                            >
                                <div aria-hidden="true" className="aspect-[16/9] min-[992px]:motion-safe:aspect-[16/7]" />
                                <div aria-hidden="true" className="h-[3.75rem]" />
                                <div className="category-card__image-wrap absolute inset-0 -z-[1]">
                                    {product.thumbnail && (
                                        <Image
                                            src={product.thumbnail}
                                            alt=""
                                            fill
                                            unoptimized
                                            sizes="(max-width: 992px) 50vw, 30vw"
                                            className="category-card__image object-contain"
                                        />
                                    )}
                                </div>
                                <span aria-hidden="true" className="category-card__veil category-card__veil--top pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-black/70" />
                                <span aria-hidden="true" className="category-card__veil category-card__veil--bottom pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-black/70" />
                                <div className="pointer-events-none absolute inset-0 text-center">
                                    <CategoryIcon aria-hidden="true" className="category-card__icon absolute left-1/2 size-10 sm:size-12" />
                                    <h3 className="category-card__title absolute inset-x-2 line-clamp-2 text-lg font-bold sm:text-xl">
                                        {formatCategoryName(product.category)}
                                    </h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <p className="text-ca-black/70 dark:text-white/70">
                    Product categories will appear here when rated products are available.
                </p>
            )}
        </div>
    </section>
);

export default TopRatedCategoriesSection;

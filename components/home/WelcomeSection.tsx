import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { HiArrowRight, HiChatBubbleLeftRight } from "react-icons/hi2";
import type { IconType } from "react-icons";
import formatCategoryName from "@/components/home/formatCategoryName";
import type { FeaturedProduct } from "@/components/home/types";

interface WelcomeSectionProps {
    product?: FeaturedProduct;
    popularCategories: FeaturedProduct[];
    showNextProduct: boolean;
    onNextProduct: () => void;
}

interface ProductStatProps {
    icon: IconType;
    accessibleLabel: string;
    value: string;
}

const ProductStat = ({ icon: Icon, accessibleLabel, value }: ProductStatProps) => (
    <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="text-xl text-ca-black dark:text-ca-orange" />
        <span className="font-semibold">
            <span className="sr-only">{accessibleLabel}: </span>
            {value}
        </span>
    </div>
);

const WelcomeSection = ({
    product,
    popularCategories,
    showNextProduct,
    onNextProduct,
}: WelcomeSectionProps) => (
    <section data-home-panel className="relative w-full shrink-0 overflow-hidden px-4 py-12 sm:px-6 min-[992px]:motion-safe:pl-16 min-[992px]:motion-safe:pr-6 min-[992px]:motion-safe:flex min-[992px]:motion-safe:h-full min-[992px]:motion-safe:items-start min-[992px]:motion-safe:py-8 lg:motion-safe:pl-24 lg:motion-safe:pr-8">
        <div className="relative z-10 w-full">
            <h1 data-reveal-heading className="mb-8 text-left text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Welcome to Amazon! Your online store for everything you need.
            </h1>
            <div className="grid items-start gap-10 min-[992px]:grid-cols-2 min-[992px]:gap-12 lg:gap-16">
                <div className="max-w-2xl space-y-4 text-left text-base leading-relaxed sm:text-lg">
                    <p data-reveal-item>
                        Discover a wide selection of products, from electronics and home essentials to fashion and books.
                    </p>
                    <p data-reveal-item>With Amazon, everything is at your fingertips.</p>
                    <p data-reveal-item>
                        Enjoy convenient shopping, great deals, and fast delivery right to your door.
                    </p>
                    {popularCategories.length > 0 && (
                        <div className="pt-3" data-reveal-item>
                            <p className="my-4 text-sm font-semibold">Popular categories</p>
                            <div className="flex flex-wrap gap-2">
                                {popularCategories.slice(0, 3).map((categoryProduct) => (
                                    <Link
                                        key={categoryProduct.category}
                                        href={`/${encodeURIComponent(categoryProduct.category)}`}
                                        className="rounded-full border border-ca-grey/70 px-4 py-2 text-sm font-semibold transition-colors hover:bg-ca-orange/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:border-white/15"
                                    >
                                        {formatCategoryName(categoryProduct.category)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    {product ? (
                        <>
                            <div
                                data-reveal-item
                                className="relative mx-auto aspect-[4/3] w-full max-w-2xl overflow-hidden"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {product.thumbnail ? (
                                    <>
                                        <Image
                                            src={product.thumbnail}
                                            alt={product.title}
                                            fill
                                            unoptimized
                                            preload
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            data-reveal-image
                                            className="object-contain p-4 sm:p-8"
                                        />
                                        <span
                                            data-reveal-image-cover
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 z-10 bg-ca-orange opacity-0"
                                        />
                                    </>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-ca-black/60 dark:text-white/60">
                                        Product image unavailable
                                    </div>
                                )}
                                {showNextProduct && (
                                    <button
                                        type="button"
                                        aria-label="Show next featured product"
                                        onClick={onNextProduct}
                                        className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ca-orange text-xl text-ca-black shadow-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black dark:focus-visible:outline-white sm:right-4"
                                    >
                                        <HiArrowRight aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                            <div data-reveal-item className="mx-auto mt-4 flex w-fit max-w-full items-center gap-6 rounded-full border border-ca-grey/60 bg-ca-grey/35 px-6 py-3 dark:border-white/10 dark:bg-white/5">
                                <ProductStat
                                    icon={FaStar}
                                    accessibleLabel="Average rating"
                                    value={product.averageRating.toFixed(1)}
                                />
                                <span
                                    className="h-6 w-px bg-ca-black/20 dark:bg-white/20"
                                    aria-hidden="true"
                                />
                                <ProductStat
                                    icon={HiChatBubbleLeftRight}
                                    accessibleLabel="Reviews"
                                    value={String(product.reviewCount)}
                                />
                            </div>
                        </>
                    ) : (
                        <p className="py-12 text-center text-ca-black/70 dark:text-white/70">
                            No rated products are available yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    </section>
);

export default WelcomeSection;

'use client';

import Image from "next/image";
import Link from "next/link";
import formatCategoryName from "@/components/home/formatCategoryName";
import type { ProductSearchSuggestion } from "@/types/product-search.types";

interface SearchSuggestionsProps {
    normalizedQuery: string;
    products: ProductSearchSuggestion[];
    matchingCategories: string[];
    isLoading: boolean;
    inputError: string | null;
    requestError: string | null;
    onSuggestionSelect: () => void;
}

const SearchSuggestions = ({
    normalizedQuery,
    products,
    matchingCategories,
    isLoading,
    inputError,
    requestError,
    onSuggestionSelect,
}: SearchSuggestionsProps) => (
    <div
        id="search-results"
        role="region"
        aria-label="Search suggestions"
        className="absolute left-0 top-12 z-[70] max-h-[min(70vh,28rem)] w-full overflow-y-auto rounded-2xl border border-ca-grey/60 bg-white p-3 text-ca-black shadow-xl md:w-96 dark:border-white/10 dark:bg-ca-black dark:text-white"
    >
        {inputError ? (
            <p role="alert" className="p-3 text-sm text-red-700 dark:text-red-300">
                {inputError}
            </p>
        ) : (
            <>
                <section aria-labelledby="search-products-heading">
                    <h2
                        id="search-products-heading"
                        className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ca-black/60 dark:text-white/60"
                    >
                        Products
                    </h2>
                    {normalizedQuery.length < 2 ? (
                        <p className="px-3 pb-2 text-sm text-ca-black/60 dark:text-white/60">
                            Type at least 2 characters to search products.
                        </p>
                    ) : isLoading ? (
                        <p role="status" className="px-3 pb-2 text-sm text-ca-black/60 dark:text-white/60">
                            Searching products…
                        </p>
                    ) : requestError ? (
                        <p role="alert" className="px-3 pb-2 text-sm text-red-700 dark:text-red-300">
                            {requestError}
                        </p>
                    ) : products.length > 0 ? (
                        <ul>
                            {products.map((product) => (
                                <li key={product.id}>
                                    <Link
                                        href={`/${encodeURIComponent(product.category)}`}
                                        onClick={onSuggestionSelect}
                                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-ca-grey/30 focus-visible:outline-2 focus-visible:outline-ca-orange dark:hover:bg-white/10"
                                    >
                                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ca-grey/20">
                                            {product.thumbnail && (
                                                <Image
                                                    src={product.thumbnail}
                                                    alt=""
                                                    fill
                                                    unoptimized
                                                    sizes="48px"
                                                    className="object-contain p-1"
                                                />
                                            )}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-semibold">
                                                {product.title}
                                            </span>
                                            <span className="block truncate text-xs text-ca-black/60 dark:text-white/60">
                                                {formatCategoryName(product.category)}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : requestError ? null : isLoading ? null : (
                        <p className="px-3 pb-2 text-sm text-ca-black/60 dark:text-white/60">
                            No matching products found.
                        </p>
                    )}
                </section>

                <section
                    aria-labelledby="search-categories-heading"
                    className="mt-2 border-t border-ca-grey/50 pt-2 dark:border-white/10"
                >
                    <h2
                        id="search-categories-heading"
                        className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ca-black/60 dark:text-white/60"
                    >
                        Categories
                    </h2>
                    {matchingCategories.length > 0 ? (
                        <ul>
                            {matchingCategories.map((category) => (
                                <li key={category}>
                                    <Link
                                        href={`/${encodeURIComponent(category)}`}
                                        onClick={onSuggestionSelect}
                                        className="block rounded-xl px-3 py-2 text-sm transition-colors hover:bg-ca-grey/30 focus-visible:outline-2 focus-visible:outline-ca-orange dark:hover:bg-white/10"
                                    >
                                        {formatCategoryName(category)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="px-3 pb-2 text-sm text-ca-black/60 dark:text-white/60">
                            No matching categories found.
                        </p>
                    )}
                </section>
            </>
        )}
    </div>
);

export default SearchSuggestions;

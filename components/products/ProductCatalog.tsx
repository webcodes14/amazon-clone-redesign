"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import ProductFilters, { type ProductFilterValues } from "./ProductFilters";
import type { Product } from "@/types";

gsap.registerPlugin(useGSAP);

type SortOption = "recommended" | "price-asc" | "price-desc" | "rating" | "title";
const PRODUCTS_PER_PAGE = 8;

interface ProductCatalogProps {
    title: string;
    products: Product[];
}

const getAverageRating = (product: Product) => {
    const ratings = (product.reviews ?? [])
        .map(({ rating }) => rating)
        .filter((rating) => Number.isFinite(rating) && rating >= 0 && rating <= 5);

    return ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
};

const getFilteredProducts = (
    products: Product[],
    filters: ProductFilterValues,
    sortBy: SortOption
) =>
    products
        .filter((product) => product.price >= filters.priceFrom && product.price <= filters.priceTo)
        .filter(
            (product) =>
                filters.selectedBrands.length === 0 ||
                (product.brand && filters.selectedBrands.includes(product.brand))
        )
        .filter((product) => !filters.ratingOnly || getAverageRating(product) >= 4)
        .filter((product) => !filters.inStockOnly || product.stock > 0)
        .sort((first, second) => {
            if (sortBy === "price-asc") return first.price - second.price;
            if (sortBy === "price-desc") return second.price - first.price;
            if (sortBy === "rating") return getAverageRating(second) - getAverageRating(first);
            if (sortBy === "title") return first.title.localeCompare(second.title);

            return (
                getAverageRating(second) - getAverageRating(first) ||
                (second.reviews?.length ?? 0) - (first.reviews?.length ?? 0) ||
                second.discount_percentage - first.discount_percentage
            );
        });

const ProductCatalog = ({ title, products }: ProductCatalogProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const prices = products.map(({ price }) => price).filter(Number.isFinite);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const brands = [
        ...new Set(
            products
                .map(({ brand }) => brand?.trim())
                .filter((brand): brand is string => Boolean(brand))
        ),
    ].sort((first, second) => first.localeCompare(second));
    const initialFilters = (): ProductFilterValues => ({
        priceFrom: minPrice,
        priceTo: maxPrice,
        selectedBrands: [],
        ratingOnly: false,
        inStockOnly: false,
    });

    const [filters, setFilters] = useState<ProductFilterValues>(initialFilters);
    const [draftFilters, setDraftFilters] = useState<ProductFilterValues>(initialFilters);
    const [sortBy, setSortBy] = useState<SortOption>("recommended");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const catalogRef = useRef<HTMLElement>(null);
    const shouldAnimatePageChangeRef = useRef(false);
    const filterPanelRef = useRef<HTMLDivElement>(null);
    const filterTriggerRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const productsRef = useRef<HTMLDivElement>(null);

    const filteredProducts = useMemo(
        () => getFilteredProducts(products, filters, sortBy),
        [products, filters, sortBy]
    );
    const draftProducts = useMemo(
        () => getFilteredProducts(products, draftFilters, sortBy),
        [products, draftFilters, sortBy]
    );
    const pageCount = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const requestedPage = Number(searchParams.get("page"));
    const currentPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const activePage = Math.min(currentPage, Math.max(pageCount, 1));
    const pageProducts = filteredProducts.slice(
        (activePage - 1) * PRODUCTS_PER_PAGE,
        activePage * PRODUCTS_PER_PAGE
    );
    useGSAP(
        () => {
            if (!shouldAnimatePageChangeRef.current) return;
            shouldAnimatePageChangeRef.current = false;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            gsap.from("[data-product-card]", {
                y: 22,
                autoAlpha: 0,
                scale: 0.98,
                duration: 0.5,
                stagger: 0.055,
                ease: "power2.out",
                clearProps: "all",
            });
        },
        { scope: catalogRef, dependencies: [activePage], revertOnUpdate: true }
    );

    const updatePageQuery = (page: number, replace = false) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page > 1) {
            params.set("page", String(page));
        } else {
            params.delete("page");
        }

        const query = params.toString();
        const href = query ? `${pathname}?${query}` : pathname;
        if (replace) {
            router.replace(href, { scroll: false });
        } else {
            router.push(href, { scroll: false });
        }
    };

    const resetPage = () => {
        if (searchParams.has("page")) {
            updatePageQuery(1, true);
        }
    };

    useEffect(() => {
        if (!isFilterOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setDraftFilters(filters);
                setIsFilterOpen(false);
                filterTriggerRef.current?.focus();
                return;
            }

            if (event.key === "Tab" && filterPanelRef.current) {
                const focusableElements = filterPanelRef.current.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (!firstElement) {
                    event.preventDefault();
                    filterPanelRef.current.focus();
                } else if (
                    event.shiftKey &&
                    (document.activeElement === firstElement ||
                        !filterPanelRef.current.contains(document.activeElement))
                ) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (
                    !event.shiftKey &&
                    (document.activeElement === lastElement ||
                        !filterPanelRef.current.contains(document.activeElement))
                ) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isFilterOpen, filters]);

    const clearFilters = () => {
        const clearedFilters = initialFilters();
        if (isFilterOpen) {
            setDraftFilters(clearedFilters);
        } else {
            setFilters(clearedFilters);
            setDraftFilters(clearedFilters);
            resetPage();
        }
    };

    const closeFilterPanel = () => {
        setDraftFilters(filters);
        setIsFilterOpen(false);
        filterTriggerRef.current?.focus();
    };

    const applyMobileFilters = () => {
        setFilters(draftFilters);
        resetPage();
        setIsFilterOpen(false);
        filterTriggerRef.current?.focus();
    };

    const selectPage = (page: number) => {
        if (page === activePage) return;
        shouldAnimatePageChangeRef.current = true;
        updatePageQuery(page);
        productsRef.current?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start",
        });
    };

    return (
        <section
            ref={catalogRef}
            className="mx-auto w-full px-4 py-8 sm:px-6 lg:pr-8 min-[992px]:-ml-16 min-[992px]:w-[calc(100%+4rem)] min-[992px]:pl-16 lg:pl-24"
        >
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="mt-1 text-sm text-ca-black/70 dark:text-ca-grey">
                        {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                    </p>
                </div>
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                    <button
                        ref={filterTriggerRef}
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded={isFilterOpen}
                        aria-controls="mobile-product-filters"
                        onClick={() => {
                            setDraftFilters(filters);
                            setIsFilterOpen(true);
                        }}
                        className="cursor-pointer rounded-md border border-ca-grey bg-white px-4 py-2 text-sm font-semibold text-ca-black shadow-sm transition-colors hover:bg-ca-grey/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:bg-ca-grey dark:hover:bg-ca-grey/80 lg:hidden"
                    >
                        Filters
                    </button>
                    <label className="flex items-center gap-3 text-sm font-medium">
                        Sort by
                        <select
                            value={sortBy}
                            onChange={(event) => {
                                setSortBy(event.target.value as SortOption);
                                resetPage();
                            }}
                            className="cursor-pointer rounded-md border border-ca-grey bg-white px-3 py-2 text-ca-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:bg-ca-black dark:text-white"
                        >
                            <option value="recommended">Recommended</option>
                            <option value="price-asc">Price: low to high</option>
                            <option value="price-desc">Price: high to low</option>
                            <option value="rating">Top rated</option>
                            <option value="title">Name: A to Z</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="hidden self-start lg:block" aria-label="Product filters">
                    <ProductFilters
                        brands={brands}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        values={filters}
                        onChange={(nextFilters) => {
                            setFilters(nextFilters);
                            setDraftFilters(nextFilters);
                            resetPage();
                        }}
                        onClear={clearFilters}
                    />
                </aside>

                <div ref={productsRef} className="min-w-0 scroll-mt-24">
                    {filteredProducts.length === 0 ? (
                        <p className="rounded-lg bg-white p-8 text-center text-ca-black dark:bg-ca-grey dark:text-ca-black">
                            No products match these filters.
                        </p>
                    ) : (
                        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {pageProducts.map((product) => (
                                <li key={product.id}>
                                    <ProductCard product={product} />
                                </li>
                            ))}
                        </ul>
                    )}
                    {pageCount > 1 && (
                        <nav aria-label="Product pagination" className="mt-8">
                            <ul className="flex flex-wrap justify-center gap-2">
                                {Array.from({ length: pageCount }, (_, index) => {
                                    const page = index + 1;
                                    const isCurrentPage = page === activePage;

                                    return (
                                        <li key={page}>
                                            <button
                                                type="button"
                                                aria-label={`Page ${page}`}
                                                aria-current={isCurrentPage ? "page" : undefined}
                                                onClick={() => selectPage(page)}
                                                className={`flex size-10 cursor-pointer items-center justify-center rounded-md border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange ${
                                                    isCurrentPage
                                                        ? "border-ca-black bg-ca-black text-white dark:border-ca-orange dark:bg-ca-orange dark:text-ca-black"
                                                        : "border-ca-grey bg-white text-ca-black hover:bg-ca-grey/30 dark:bg-ca-grey dark:hover:bg-ca-grey/70"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    )}
                </div>
            </div>

            <div
                id="mobile-product-filters"
                ref={filterPanelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-product-filters-title"
                aria-hidden={!isFilterOpen}
                inert={!isFilterOpen}
                tabIndex={-1}
                className={`fixed inset-0 z-[80] flex h-[100dvh] flex-col bg-white text-ca-black transition-transform duration-300 ease-in-out motion-reduce:transition-none dark:bg-ca-black dark:text-white lg:hidden ${
                    isFilterOpen ? "translate-y-0" : "pointer-events-none translate-y-full"
                }`}
            >
                <div className="flex shrink-0 items-center justify-between border-b border-ca-grey/50 px-5 py-4 dark:border-white/15">
                    <h2 id="mobile-product-filters-title" className="text-xl font-bold">
                        Filters
                    </h2>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Close filters without applying"
                        onClick={closeFilterPanel}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-full text-2xl hover:bg-ca-grey/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:hover:bg-white/10"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                    <ProductFilters
                        brands={brands}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        values={draftFilters}
                        onChange={setDraftFilters}
                        onClear={clearFilters}
                    />
                </div>
                <div className="shrink-0 border-t border-ca-grey/50 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-white/15 dark:bg-ca-black">
                    <button
                        type="button"
                        onClick={applyMobileFilters}
                        className="w-full cursor-pointer rounded-lg bg-ca-black px-5 py-3 font-semibold text-white transition-colors hover:bg-ca-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:bg-ca-orange dark:text-ca-black dark:hover:bg-ca-orange/90"
                    >
                        Show {draftProducts.length} {draftProducts.length === 1 ? "product" : "products"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductCatalog;

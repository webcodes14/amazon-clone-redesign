'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { isSafeProductSearchQuery, normalizeProductSearchQuery } from "@/lib/product-search";
import type { Category } from "@/types";
import type { ProductSearchSuggestion } from "@/types/product-search.types";
import SearchSuggestions from "./SearchSuggestions";

interface SearchBarProps {
    categories: Category[];
}

interface ProductSearchResponse {
    products: ProductSearchSuggestion[];
}

const isProductSearchResponse = (value: unknown): value is ProductSearchResponse => {
    if (
        typeof value !== "object" ||
        value === null ||
        !("products" in value) ||
        !Array.isArray(value.products)
    ) {
        return false;
    }

    return value.products.every(
        (product) =>
            typeof product === "object" &&
            product !== null &&
            "id" in product &&
            typeof product.id === "number" &&
            "title" in product &&
            typeof product.title === "string" &&
            "thumbnail" in product &&
            typeof product.thumbnail === "string" &&
            "category" in product &&
            typeof product.category === "string"
    );
};

const SearchBar = ({ categories }: SearchBarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<ProductSearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputError, setInputError] = useState<string | null>(null);
    const [requestError, setRequestError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const normalizedQuery = normalizeProductSearchQuery(query);
    const isValidQuery = isSafeProductSearchQuery(query);
    const matchingCategories = isValidQuery && normalizedQuery.length > 0
        ? categories.filter((category) =>
              category.toLocaleLowerCase().includes(normalizedQuery.toLocaleLowerCase())
          )
        : [];

    const closeSearch = useCallback((restoreFocus = false) => {
        const input = inputRef.current;
        if (input && input === document.activeElement) {
            input.blur();
        }
        setIsOpen(false);
        if (restoreFocus) {
            triggerRef.current?.focus();
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        setIsLoading(false);
        setRequestError(null);

        if (!isOpen || normalizedQuery.length < 2 || !isValidQuery) {
            setProducts([]);
            return;
        }

        const controller = new AbortController();
        const debounceTimer = window.setTimeout(async () => {
            setIsLoading(true);

            try {
                const response = await fetch("/api/search/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query: normalizedQuery }),
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Product search failed with status ${response.status}.`);
                }

                const result: unknown = await response.json();

                if (!isProductSearchResponse(result)) {
                    throw new Error("Product search returned an invalid response.");
                }

                setProducts(result.products.slice(0, 3));
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                console.error("Could not load product search suggestions.", error);
                setProducts([]);
                setRequestError("Search is temporarily unavailable. Please try again.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }, 250);

        return () => {
            window.clearTimeout(debounceTimer);
            controller.abort();
        };
    }, [isOpen, isValidQuery, normalizedQuery]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                event.target instanceof Node &&
                !inputRef.current?.contains(event.target) &&
                !triggerRef.current?.contains(event.target) &&
                !dropdownRef.current?.contains(event.target)
            ) {
                closeSearch();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeSearch(true);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [closeSearch, isOpen]);

    const handleQueryChange = (value: string) => {
        if (value.trim() && !isSafeProductSearchQuery(value)) {
            setInputError("Use letters, numbers, spaces, and common punctuation.");
            return;
        }

        setQuery(value);
        setInputError(null);
    };

    const handleSuggestionSelect = () => closeSearch();

    const showSuggestions = isOpen && normalizedQuery.length > 0;

    return (
        <div className="pointer-events-auto relative m-4 h-11 w-[calc(100%_-_2rem)] md:w-11">
            <input
                ref={inputRef}
                className={`absolute left-0 top-0 h-11 rounded-full bg-ca-grey pl-12 pr-8 outline-none transition-[width,opacity] duration-300 ease-in-out ${
                    isOpen ? "w-full md:w-96" : "w-11"
                } ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
                type="search"
                name="search"
                id="search"
                aria-label="Search products and categories"
                aria-controls="search-results"
                aria-hidden={!isOpen}
                autoComplete="off"
                placeholder="Search products or categories"
                tabIndex={isOpen ? 0 : -1}
                maxLength={30}
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
            />
            <button
                ref={triggerRef}
                type="button"
                className="absolute left-0 top-0 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ca-orange text-xl text-white"
                aria-label={isOpen ? "Close search" : "Open search"}
                aria-expanded={isOpen}
                aria-controls="search"
                onClick={() => setIsOpen((open) => !open)}
            >
                <HiMagnifyingGlass aria-hidden="true" />
            </button>

            {showSuggestions && (
                <div ref={dropdownRef}>
                    <SearchSuggestions
                        normalizedQuery={normalizedQuery}
                        products={products}
                        matchingCategories={matchingCategories}
                        isLoading={isLoading}
                        inputError={inputError}
                        requestError={requestError}
                        onSuggestionSelect={handleSuggestionSelect}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchBar;

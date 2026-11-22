import { useState } from "react";

export interface ProductFilterValues {
    priceFrom: number;
    priceTo: number;
    selectedBrands: string[];
    ratingOnly: boolean;
    inStockOnly: boolean;
}

interface ProductFiltersProps {
    brands: string[];
    minPrice: number;
    maxPrice: number;
    values: ProductFilterValues;
    onChange: (values: ProductFilterValues) => void;
    onClear: () => void;
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(price);

const ProductFilters = ({
    brands,
    minPrice,
    maxPrice,
    values,
    onChange,
    onClear,
}: ProductFiltersProps) => {
    const [showAllBrands, setShowAllBrands] = useState(false);
    const priceRange = maxPrice - minPrice;
    const minPercent = priceRange ? ((values.priceFrom - minPrice) / priceRange) * 100 : 0;
    const maxPercent = priceRange ? ((values.priceTo - minPrice) / priceRange) * 100 : 100;
    const visibleBrands = showAllBrands ? brands : brands.slice(0, 5);

    return (
        <div className="rounded-xl border border-ca-grey/70 bg-white p-5 text-ca-black shadow-sm dark:border-white/15 dark:bg-ca-grey dark:text-ca-black">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold">Refine your results</h2>
                <button
                    type="button"
                    onClick={onClear}
                    className="cursor-pointer text-sm font-semibold underline underline-offset-2 hover:text-ca-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black"
                >
                    Clear all
                </button>
            </div>

            <fieldset className="border-b border-ca-black/15 pb-6">
                <legend className="font-semibold">Price range</legend>
                <div className="mt-4 flex items-center justify-between gap-3">
                    <output
                        htmlFor="price-range-min price-range-max"
                        className="rounded-md border border-ca-grey bg-white px-2.5 py-1.5 text-sm font-semibold shadow-sm"
                    >
                        {formatPrice(values.priceFrom)}
                    </output>
                    <span aria-hidden="true" className="h-px flex-1 bg-ca-black/20" />
                    <output
                        htmlFor="price-range-min price-range-max"
                        className="rounded-md border border-ca-grey bg-white px-2.5 py-1.5 text-sm font-semibold shadow-sm"
                    >
                        {formatPrice(values.priceTo)}
                    </output>
                </div>
                <div className="price-range mt-4">
                    <div className="price-range__track" aria-hidden="true">
                        <span
                            className="price-range__selected"
                            style={{
                                left: `${minPercent}%`,
                                width: `${Math.max(0, maxPercent - minPercent)}%`,
                            }}
                        />
                    </div>
                    <input
                        id="price-range-min"
                        className="price-range__input price-range__input--min"
                        aria-label="Minimum price"
                        aria-valuetext={formatPrice(values.priceFrom)}
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step="0.01"
                        value={values.priceFrom}
                        onChange={(event) =>
                            onChange({
                                ...values,
                                priceFrom: Math.min(Number(event.target.value), values.priceTo),
                            })
                        }
                    />
                    <input
                        id="price-range-max"
                        className="price-range__input price-range__input--max"
                        aria-label="Maximum price"
                        aria-valuetext={formatPrice(values.priceTo)}
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step="0.01"
                        value={values.priceTo}
                        onChange={(event) =>
                            onChange({
                                ...values,
                                priceTo: Math.max(Number(event.target.value), values.priceFrom),
                            })
                        }
                    />
                </div>
                <div className="mt-1 flex justify-between text-xs text-ca-black/65">
                    <span>{formatPrice(minPrice)}</span>
                    <span>{formatPrice(maxPrice)}</span>
                </div>
            </fieldset>

            {brands.length > 0 && (
                <fieldset className="border-b border-ca-black/15 py-6">
                    <legend className="font-semibold">Brand</legend>
                    <div className="mt-3 space-y-3">
                        {visibleBrands.map((brand) => (
                            <label key={brand} className="flex cursor-pointer items-center gap-3 text-sm">
                                <input
                                    type="checkbox"
                                    checked={values.selectedBrands.includes(brand)}
                                    onChange={(event) =>
                                        onChange({
                                            ...values,
                                            selectedBrands: event.target.checked
                                                ? [...values.selectedBrands, brand]
                                                : values.selectedBrands.filter((item) => item !== brand),
                                        })
                                    }
                                    className="size-4 accent-ca-black"
                                />
                                <span>{brand}</span>
                            </label>
                        ))}
                    </div>
                    {brands.length > 5 && (
                        <button
                            type="button"
                            onClick={() => setShowAllBrands((current) => !current)}
                            aria-expanded={showAllBrands}
                            className="mt-3 cursor-pointer text-sm font-semibold text-ca-black underline underline-offset-2 hover:text-ca-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black"
                        >
                            {showAllBrands ? "Show less" : `Show ${brands.length - 5} more (+)`}
                        </button>
                    )}
                </fieldset>
            )}

            <fieldset className="space-y-3 pt-6">
                <legend className="mb-3 font-semibold">Rating and availability</legend>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={values.ratingOnly}
                        onChange={(event) => onChange({ ...values, ratingOnly: event.target.checked })}
                        className="size-4 accent-ca-black"
                    />
                    4 stars and up
                </label>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={values.inStockOnly}
                        onChange={(event) => onChange({ ...values, inStockOnly: event.target.checked })}
                        className="size-4 accent-ca-black"
                    />
                    In stock
                </label>
            </fieldset>
        </div>
    );
};

export default ProductFilters;

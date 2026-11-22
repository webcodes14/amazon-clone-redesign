import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/products/AddToCartButton";
import formatCategoryName from "@/components/home/formatCategoryName";
import ProductGallery from "@/components/products/ProductGallery";
import RatingStars from "@/components/products/RatingStars";
import { getCategories } from "@/lib/categories";
import { getDiscountedPrice } from "@/lib/pricing";
import { getProductById, getProductImages } from "@/lib/products";

interface ProductPageProps {
    params: Promise<{ category: string; productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { category: categorySlug, productId } = await params;
    const id = Number(productId);

    if (!Number.isInteger(id) || id < 1) {
        notFound();
    }

    const [product, categories] = await Promise.all([getProductById(id), getCategories()]);

    if (!product || !categories.includes(product.category) || product.category !== categorySlug) {
        notFound();
    }

    let galleryImages = Array.isArray(product.images) ? product.images : [];
    if (galleryImages.length === 0) {
        try {
            galleryImages = await getProductImages(product.title, product.category);
        } catch (error) {
            console.error(`Could not load gallery images for product "${id}":`, error);
        }
    }

    const reviews = Array.isArray(product.reviews) ? product.reviews : [];
    const ratings = reviews
        .map(({ rating }) => rating)
        .filter((rating) => Number.isFinite(rating) && rating >= 0 && rating <= 5);
    const averageRating = ratings.length
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : null;
    const description = product.description?.trim().replace(/\s+/g, " ") || "";
    const longDescriptionFromData = product.long_description?.trim() || "";
    const shortDescription =
        product.short_description?.trim() ||
        (description || longDescriptionFromData).match(/^.*?[.!?](?=\s|$)/)?.[0] ||
        description ||
        longDescriptionFromData;
    const longDescription =
        longDescriptionFromData ||
        (shortDescription && description.startsWith(shortDescription)
            ? description.slice(shortDescription.length).trim()
            : "");
    const discountPercentage = Number.isFinite(product.discount_percentage)
        ? Math.min(100, Math.max(0, product.discount_percentage))
        : 0;
    const discountedPrice = getDiscountedPrice(product.price, discountPercentage);

    return (
        <section
            aria-labelledby="product-title"
            className="mx-auto w-full px-4 py-8 sm:px-6 lg:pr-8 min-[992px]:-ml-16 min-[992px]:w-[calc(100%+4rem)] min-[992px]:pl-16 lg:pl-24"
        >
            <Link
                href={`/${encodeURIComponent(product.category)}`}
                className="text-sm font-semibold text-ca-black underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:text-white"
            >
                Back to {formatCategoryName(product.category)}
            </Link>

            <div className="mt-8 grid items-start gap-10 text-ca-black dark:text-white lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-16">
                <ProductGallery
                    title={product.title}
                    thumbnail={product.thumbnail}
                    images={galleryImages}
                />
                <div className="flex flex-col">
                    <h1 id="product-title" className="mt-2 text-3xl font-bold sm:text-4xl">
                        {product.title}
                    </h1>
                    {shortDescription && (
                        <p className="mt-3 text-base leading-relaxed text-ca-black/75 dark:text-white/75">
                            {shortDescription}
                        </p>
                    )}
                    <div className="mt-4 flex items-center gap-2">
                        <RatingStars rating={averageRating ?? 0} />
                        <span className="text-sm text-ca-black/65 dark:text-white/65">({ratings.length})</span>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center gap-3">
                            {discountPercentage > 0 && (
                                <span className="rounded-md bg-red-100 px-2.5 py-1 text-sm font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                                    -{discountPercentage.toFixed(1)}%
                                </span>
                            )}
                            <p className="text-3xl font-bold">${discountedPrice.toFixed(2)}</p>
                        </div>
                        {discountPercentage > 0 && (
                            <p className="mt-1 text-sm text-ca-black/60 dark:text-white/60">
                                Price before discount{" "}
                                <s className="ml-1">${product.price.toFixed(2)}</s>
                            </p>
                        )}
                    </div>

                    <p
                        className={`mt-5 text-sm font-semibold ${
                            product.stock > 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                        }`}
                    >
                        {product.stock > 0 ? "In stock" : "Out of stock"}
                    </p>
                    <AddToCartButton product={product} />

                    {longDescription && (
                        <section aria-labelledby="product-description-title" className="mt-7">
                            <h2 id="product-description-title" className="text-lg font-semibold">
                                Product description
                            </h2>
                            <p className="mt-2 leading-relaxed text-ca-black/75 dark:text-white/75">
                                {longDescription}
                            </p>
                        </section>
                    )}

                    {reviews.length > 0 && (
                        <section aria-labelledby="reviews-title" className="mt-8">
                            <h2 id="reviews-title" className="text-lg font-semibold">
                                Customer reviews
                            </h2>
                            <ul className="mt-3 space-y-3">
                                {reviews.map((review, index) => (
                                    <li key={`${review.reviewerEmail}-${review.date}-${index}`} className="text-sm">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <p className="font-semibold">{review.reviewerName}</p>
                                            <RatingStars rating={review.rating} size="small" />
                                            <span className="text-ca-black/60 dark:text-white/60">{review.rating}/5</span>
                                        </div>
                                        <p className="mt-1 text-ca-black/70 dark:text-white/70">{review.comment}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </section>
    );
}

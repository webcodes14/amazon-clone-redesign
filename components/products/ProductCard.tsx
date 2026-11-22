"use client";

import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import type { MouseEvent } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import { addWishlistProduct, removeWishlistProduct } from "@/redux/wishlistSlice";
import type { Product } from "@/types";

interface ProductCardProps {
    product: Product;
}

const truncateDescription = (description: string, maxLength = 70) => {
    const normalized = description.trim().replace(/\s+/g, " ");
    if (normalized.length <= maxLength) return normalized;

    const boundary = normalized.lastIndexOf(" ", maxLength);
    const end = boundary > 0 ? boundary : maxLength;
    return `${normalized.slice(0, end).trimEnd()}…`;
};

const animateWishlistFlight = (source: HTMLButtonElement) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = document.getElementById("wishlist-nav-target");
    if (!target) return;

    const sourceBounds = source.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();
    const heart = document.createElement("span");

    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "♥";
    Object.assign(heart.style, {
        position: "fixed",
        zIndex: "100",
        left: `${sourceBounds.left + sourceBounds.width / 2 - 12}px`,
        top: `${sourceBounds.top + sourceBounds.height / 2 - 12}px`,
        color: "#dc2626",
        fontSize: "30px",
        lineHeight: "24px",
        pointerEvents: "none",
        willChange: "transform, left, top, opacity",
    });
    document.body.appendChild(heart);

    gsap.to(heart, {
        left: targetBounds.left + targetBounds.width / 2 - 12,
        top: targetBounds.top + targetBounds.height / 2 - 12,
        scale: 0.35,
        rotation: 18,
        opacity: 0,
        duration: 0.75,
        ease: "power2.inOut",
        onComplete: () => heart.remove(),
    });
    gsap.fromTo(
        target,
        { scale: 0.85 },
        { scale: 1, delay: 0.55, duration: 0.3, ease: "back.out(2)", overwrite: "auto" }
    );
};

const ProductCard = ({ product }: ProductCardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const isWishlisted = useSelector((state: RootState) =>
        state.wishlist.products.some(({ id }) => id === product.id)
    );
    const productHref = `/${encodeURIComponent(product.category)}/${product.id}`;

    const handleWishlistToggle = (event: MouseEvent<HTMLButtonElement>) => {
        if (isWishlisted) {
            dispatch(removeWishlistProduct(product.id));
            return;
        }

        animateWishlistFlight(event.currentTarget);
        dispatch(addWishlistProduct(product));
    };

    return (
        <article data-product-card className="relative flex h-full flex-col overflow-hidden rounded-lg border border-ca-grey bg-white text-ca-black shadow-md transition-shadow hover:shadow-lg dark:bg-ca-grey">
            <button
                type="button"
                aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
                aria-pressed={isWishlisted}
                onClick={handleWishlistToggle}
                className="absolute right-3 top-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/95 text-xl text-ca-black shadow-md transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:bg-ca-black/90 dark:text-white dark:hover:bg-ca-black"
            >
                {isWishlisted ? (
                    <HiHeart aria-hidden="true" className="wishlist-heart-pop text-red-600" />
                ) : (
                    <HiOutlineHeart aria-hidden="true" />
                )}
            </button>

            <Link
                href={productHref}
                className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
            >
                <div className="relative aspect-square bg-gray-100 dark:bg-[#373737]">
                    <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-4"
                    />
                </div>
                <div className="flex flex-1 flex-col p-4">
                    <h2 className="font-semibold">{product.title}</h2>
                    {product.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-ca-black/70 dark:text-ca-black/80">
                            {truncateDescription(product.description)}
                        </p>
                    )}
                    <p className="mt-auto pt-3 text-lg font-bold">${product.price.toFixed(2)}</p>
                </div>
            </Link>

            <div className="px-4 pb-4">
                <Link
                    href={productHref}
                    aria-label={`View details for ${product.title}`}
                    className="inline-flex w-full items-center justify-center rounded-md bg-ca-orange px-4 py-2 text-sm font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black"
                >
                    View details
                </Link>
            </div>
        </article>
    );
};

export default ProductCard;

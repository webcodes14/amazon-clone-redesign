
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useDispatch, useSelector } from "react-redux";
import CartQuantityControl from "@/components/cart/CartQuantityControl";
import CartRecommendations from "@/components/cart/CartRecommendations";
import OrderSummary from "@/components/cart/OrderSummary";
import { getDiscountedPrice } from "@/lib/pricing";
import { clearCart, removeCartProduct } from "@/redux/cartSlice";
import { addWishlistProduct } from "@/redux/wishlistSlice";
import type { AppDispatch, RootState } from "@/redux/store";

gsap.registerPlugin(useGSAP);

const CartPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, isHydrated } = useSelector((state: RootState) => state.cart);
    const cartItems = items.filter(({ quantity }) => quantity > 0);
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const hasItems = cartItems.length > 0;
    const cartRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const clearDialogRef = useRef<HTMLDialogElement>(null);

    useGSAP(
        () => {
            if (!isHydrated || !hasItems || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
            timeline.from("[data-cart-heading]", {
                y: -12, autoAlpha: 0, duration: 0.4, stagger: 0.06,
            });
            timeline.from("[data-cart-item]", {
                y: 16, autoAlpha: 0, duration: 0.4, stagger: { amount: 0.3 },
            }, "-=0.25");
            timeline.from("[data-cart-actions], [data-cart-summary]", {
                y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.08,
            }, "-=0.3");
        },
        { scope: cartRef, dependencies: [isHydrated, hasItems], revertOnUpdate: true }
    );

    return (
        <section ref={cartRef} aria-busy={!isHydrated} className={`w-full px-4 py-8 sm:px-6 lg:pr-8 min-[992px]:-ml-16 min-[992px]:w-[calc(100%+4rem)] min-[992px]:pl-16 lg:pl-24 ${isHydrated && !hasItems ? "empty-state-enter text-center" : ""}`}>
            <h1 ref={headingRef} tabIndex={-1} data-cart-heading className="text-3xl font-bold">Your cart</h1>
            {!isHydrated ? (
                <p className="mt-3 text-ca-black/70 dark:text-white/70" role="status">Loading cart...</p>
            ) : !hasItems ? (
                <div>
                    <p className="mt-3 text-ca-black/70 dark:text-white/70">Your cart is empty.</p>
                    <Link
                        href="/all-products"
                        className="mt-6 inline-flex rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                    >
                        Browse products
                    </Link>
                </div>
            ) : (
                <>
                    <p data-cart-heading className="mt-2 text-sm text-ca-black/65 dark:text-white/65">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                    <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                        <div>
                            <ul aria-label="Cart items" className="divide-y divide-ca-grey/30 dark:divide-white/10">
                                {cartItems.map(({ product, quantity }) => {
                                    const price = getDiscountedPrice(product.price, product.discount_percentage);
                                    return (
                                        <li key={product.id} data-cart-item className="flex flex-wrap items-center gap-4 py-4 sm:flex-nowrap">
                                            <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-ca-grey">
                                                <Image
                                                    src={product.thumbnail}
                                                    alt=""
                                                    fill
                                                    unoptimized
                                                    sizes="80px"
                                                    className="object-contain p-2"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/${encodeURIComponent(product.category)}/${product.id}`}
                                                    className="font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                                                >
                                                    {product.title}
                                                </Link>
                                                <p className="mt-1 text-sm text-ca-black/65 dark:text-white/65">
                                                    ${price.toFixed(2)} each
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        dispatch(addWishlistProduct(product));
                                                        dispatch(removeCartProduct(product.id));
                                                    }}
                                                    aria-label={`Move ${product.title} to wishlist`}
                                                    className="mt-2 cursor-pointer text-sm font-semibold underline underline-offset-2 hover:text-ca-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                                                >
                                                    Move to wishlist
                                                </button>
                                            </div>
                                            <CartQuantityControl
                                                productId={product.id}
                                                productTitle={product.title}
                                                quantity={quantity}
                                                removeAtZero
                                            />
                                            <p className="ml-auto shrink-0 font-semibold">${(price * quantity).toFixed(2)}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div data-cart-actions className="mt-6 flex flex-wrap items-center justify-between gap-4">
                                <Link
                                    href="/all-products"
                                    className="text-sm font-semibold underline underline-offset-2 hover:text-ca-orange"
                                >
                                    Continue shopping
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => clearDialogRef.current?.showModal()}
                                    className="cursor-pointer text-sm font-semibold underline underline-offset-2 hover:text-ca-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                                >
                                    Clear cart
                                </button>
                            </div>
                        </div>
                        <aside data-cart-summary className="h-fit rounded-lg border border-ca-grey/50 p-5 dark:border-white/20">
                            <OrderSummary items={cartItems} />
                            <Link
                                href="/checkout"
                                className="mt-5 flex w-full items-center justify-center rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                            >
                                Continue to checkout
                            </Link>
                            <p className="mt-2 text-center text-xs text-ca-black/65 dark:text-white/65">
                                Demo checkout only
                            </p>
                        </aside>
                    </div>
                    <CartRecommendations items={cartItems} />
                </>
            )}
            <dialog
                ref={clearDialogRef}
                aria-labelledby="clear-cart-title"
                aria-describedby="clear-cart-description"
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        event.preventDefault();
                        clearDialogRef.current?.close();
                    }
                }}
                className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-ca-grey bg-white p-6 text-left text-ca-black shadow-xl backdrop:bg-black/60 dark:border-white/20 dark:bg-ca-black dark:text-white"
            >
                <h2 id="clear-cart-title" className="text-xl font-bold">Clear your cart?</h2>
                <p id="clear-cart-description" className="mt-3 text-sm text-ca-black/70 dark:text-white/70">
                    This will remove all items from your cart.
                </p>
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => clearDialogRef.current?.close()}
                        className="cursor-pointer rounded-md border border-ca-black/30 px-5 py-2.5 font-semibold transition-colors hover:bg-ca-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:border-white/30 dark:hover:bg-white/10"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            clearDialogRef.current?.close();
                            dispatch(clearCart());
                            headingRef.current?.focus();
                        }}
                        className="cursor-pointer rounded-md bg-ca-orange px-5 py-2.5 font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                    >
                        Clear cart
                    </button>
                </div>
            </dialog>
        </section>
    );
};

export default CartPage;
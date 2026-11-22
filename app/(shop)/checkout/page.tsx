"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import OrderSummary from "@/components/cart/OrderSummary";
import PlaceDemoOrderButton from "@/components/cart/PlaceDemoOrderButton";
import { getDiscountedPrice } from "@/lib/pricing";
import type { RootState } from "@/redux/store";

const CheckoutPage = () => {
    const { items, isHydrated } = useSelector((state: RootState) => state.cart);
    const cartItems = items.filter(({ quantity }) => quantity > 0);

    return (
        <section className="w-full px-4 py-8 sm:px-6 lg:pr-8 min-[992px]:-ml-16 min-[992px]:w-[calc(100%+4rem)] min-[992px]:pl-16 lg:pl-24">
            <h1 className="text-3xl font-bold">Demo checkout</h1>
            <p className="mt-3 text-ca-black/70 dark:text-white/70">
                This is a demo. Your order will be saved as a demo record; no payment is collected or real shipment arranged.
            </p>
            {!isHydrated ? (
                <p className="mt-6">Loading cart...</p>
            ) : cartItems.length === 0 ? (
                <p className="mt-6">
                    Your cart is empty.{" "}
                    <Link href="/all-products" className="font-semibold underline underline-offset-2 hover:text-ca-orange">
                        Browse products
                    </Link>
                </p>
            ) : (
                <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div>
                        <h2 className="text-xl font-bold">Your items</h2>
                        <ul className="mt-4 divide-y divide-ca-grey/30 dark:divide-white/10">
                            {cartItems.map(({ product, quantity }) => (
                                <li key={product.id} className="flex justify-between gap-4 py-3">
                                    <span>{product.title} × {quantity}</span>
                                    <span className="shrink-0 font-semibold">
                                        ${(getDiscountedPrice(product.price, product.discount_percentage) * quantity).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <Link href="/cart" className="mt-5 inline-flex font-semibold underline underline-offset-2 hover:text-ca-orange">
                            Back to cart
                        </Link>
                    </div>
                    <aside className="h-fit rounded-lg border border-ca-grey/50 p-5 dark:border-white/20">
                        <OrderSummary items={cartItems} />
                        <PlaceDemoOrderButton items={cartItems} />
                    </aside>
                </div>
            )}
        </section>
    );
};

export default CheckoutPage;

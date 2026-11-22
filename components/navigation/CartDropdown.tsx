"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import CartQuantityControl from "@/components/cart/CartQuantityControl";
import { getDiscountedPrice } from "@/lib/pricing";
import type { RootState } from "@/redux/store";

interface CartDropdownProps {
    onNavigate: () => void;
}

const CartDropdown = ({ onNavigate }: CartDropdownProps) => {
    const items = useSelector((state: RootState) => state.cart.items);
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
        (total, { product, quantity }) => total + getDiscountedPrice(product.price, product.discount_percentage) * quantity,
        0
    );

    return (
        <div
            role="dialog"
            aria-label="Cart preview"
            className="rounded-xl border border-ca-grey bg-white p-4 text-ca-black dark:border-white/20 dark:bg-ca-black dark:text-white"
        >
            <h2 className="text-sm font-bold">Your cart ({itemCount})</h2>
            {items.length === 0 ? (
                <p className="py-5 text-sm text-ca-black/65 dark:text-white/65">Your cart is empty.</p>
            ) : (
                <ul className="mt-2 max-h-64 divide-y divide-ca-grey/30 overflow-y-auto dark:divide-white/10">
                    {items.map(({ product, quantity }) => (
                        <li key={product.id} className="flex items-center gap-3 py-3">
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-ca-grey">
                                <Image
                                    src={product.thumbnail}
                                    alt=""
                                    fill
                                    unoptimized
                                    sizes="48px"
                                    className="object-contain p-1"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-sm font-medium">{product.title}</p>
                                {quantity === 0 && (
                                    <p className="mt-1 text-xs text-ca-black/55 dark:text-white/55">
                                        Will be removed when the preview closes.
                                    </p>
                                )}
                            </div>
                            <CartQuantityControl
                                productId={product.id}
                                productTitle={product.title}
                                quantity={quantity}
                                removeAtZero={false}
                            />
                        </li>
                    ))}
                </ul>
            )}
            {items.length > 0 && (
                <p className="flex justify-between py-3 text-sm font-semibold">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </p>
            )}
            {items.length === 0 && (
                <Link
                    href="/all-products"
                    onClick={onNavigate}
                    className="mb-3 inline-flex text-sm font-semibold text-ca-black underline underline-offset-2 hover:text-ca-orange dark:text-white"
                >
                    Browse products
                </Link>
            )}
            <Link
                href="/cart"
                onClick={onNavigate}
                className="flex w-full items-center justify-center rounded-md bg-ca-orange px-4 py-2.5 text-sm font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
            >
                View cart
            </Link>
        </div>
    );
};

export default CartDropdown;

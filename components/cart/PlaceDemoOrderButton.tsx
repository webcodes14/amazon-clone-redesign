"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import type { CartItem } from "@/redux/cartSlice";
import type { AppDispatch } from "@/redux/store";
import { useAuth } from "@/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";

const PlaceDemoOrderButton = ({ items }: { items: CartItem[] }) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user) {
        return (
            <Link
                href="/auth?next=/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-ca-orange px-5 py-3 text-center font-semibold text-ca-black transition-colors hover:bg-ca-orange/80"
            >
                Sign in to place demo order
            </Link>
        );
    }

    const placeOrder = async () => {
        if (items.length > 30 || items.some(({ quantity }) => !Number.isInteger(quantity) || quantity > 10)) {
            setErrorMessage("Demo orders support up to 30 products, with a maximum quantity of 10 per product.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");
        try {
            const { error } = await createClient().rpc("place_demo_order", {
                p_items: items.map(({ product, quantity }) => ({
                    productId: product.id,
                    quantity,
                })),
            });

            if (error) {
                setErrorMessage("We could not create the demo order. Check product availability and try again.");
                return;
            }

            dispatch(clearCart());
            router.push("/orders?created=1");
            router.refresh();
        } catch {
            setErrorMessage("We could not create the demo order. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-6">
            <button
                type="button"
                onClick={placeOrder}
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 disabled:cursor-wait disabled:opacity-60"
            >
                {isSubmitting ? "Creating demo order..." : "Place demo order"}
            </button>
            <p className="mt-2 text-xs leading-5 text-ca-black/65 dark:text-white/65">
                Demo only. No payment or shipment is created. Limit: 30 products and 10 units per product.
            </p>
            {errorMessage && <p className="mt-3 text-sm font-semibold text-red-700 dark:text-red-300" role="alert">{errorMessage}</p>}
        </div>
    );
};

export default PlaceDemoOrderButton;

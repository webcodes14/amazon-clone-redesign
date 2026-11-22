"use client";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { removeCartProduct, setCartProductQuantity } from "@/redux/cartSlice";

interface CartQuantityControlProps {
    productId: number;
    productTitle: string;
    quantity: number;
    removeAtZero: boolean;
}

const CartQuantityControl = ({
    productId,
    productTitle,
    quantity,
    removeAtZero,
}: CartQuantityControlProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const decreaseQuantity = () => {
        if (quantity <= 0) return;

        if (quantity === 1 && removeAtZero) {
            dispatch(removeCartProduct(productId));
            return;
        }

        dispatch(setCartProductQuantity({ productId, quantity: quantity - 1 }));
    };

    const increaseQuantity = () => {
        dispatch(setCartProductQuantity({ productId, quantity: quantity + 1 }));
    };

    return (
        <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2 py-1 text-sm text-ca-black dark:bg-gray-200 dark:text-ca-black">
            <button
                type="button"
                aria-label={`Decrease ${productTitle} quantity`}
                disabled={quantity === 0}
                onClick={decreaseQuantity}
                className="flex size-7 cursor-pointer items-center justify-center rounded-full font-bold hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/10"
            >
                −
            </button>
            <span aria-live="polite" className="min-w-4 text-center font-semibold">
                {quantity}
            </span>
            <button
                type="button"
                aria-label={`Increase ${productTitle} quantity`}
                onClick={increaseQuantity}
                className="flex size-7 cursor-pointer items-center justify-center rounded-full font-bold hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:hover:bg-white/10"
            >
                +
            </button>
        </div>
    );
};

export default CartQuantityControl;

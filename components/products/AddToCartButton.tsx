"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import type { AppDispatch } from "@/redux/store";
import { addCartProduct } from "@/redux/cartSlice";
import type { Product } from "@/types";

interface AddToCartButtonProps {
    product: Product;
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isAdded, setIsAdded] = useState(false);
    const statusTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInStock = product.stock > 0;

    useEffect(() => {
        return () => {
            if (statusTimeout.current) {
                clearTimeout(statusTimeout.current);
            }
        };
    }, []);

    const handleAddToCart = () => {
        dispatch(addCartProduct(product));
        setIsAdded(true);
        if (statusTimeout.current) {
            clearTimeout(statusTimeout.current);
        }
        statusTimeout.current = setTimeout(() => {
            setIsAdded(false);
            statusTimeout.current = null;
        }, 2500);
    };

    return (
        <div className="mt-5">
            <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-ca-orange px-6 py-3 text-base font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 md:w-auto"
            >
                <FaShoppingCart aria-hidden="true" />
                Add to cart
            </button>
            <div
                className={`grid overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
                    isAdded ? "mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                }`}
            >
                <p
                    role="status"
                    aria-hidden={!isAdded}
                    className={`min-h-0 overflow-hidden text-sm font-medium text-green-700 transition-transform duration-300 dark:text-green-400 motion-reduce:transition-none ${
                        isAdded ? "translate-y-0" : "-translate-y-full"
                    }`}
                >
                    {product.title} added to cart.
                </p>
            </div>
        </div>
    );
};

export default AddToCartButton;

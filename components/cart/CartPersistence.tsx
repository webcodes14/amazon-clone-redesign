"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isProduct } from "@/lib/product-validation";
import { hydrateCart, type CartItem } from "@/redux/cartSlice";
import type { AppDispatch, RootState } from "@/redux/store";

const CART_STORAGE_KEY = "stock-pulse-cart";

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isCartItem = (value: unknown): value is CartItem =>
    isRecord(value) &&
    isProduct(value.product) &&
    Number.isInteger(value.quantity) &&
    typeof value.quantity === "number" &&
    value.quantity >= 0;

const isCart = (value: unknown): value is CartItem[] => Array.isArray(value) && value.every(isCartItem);

const CartPersistence = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, isHydrated } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        let savedItems: CartItem[] = [];

        try {
            const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
            if (storedCart !== null) {
                const parsedCart: unknown = JSON.parse(storedCart);
                if (isCart(parsedCart)) {
                    savedItems = parsedCart.filter(({ quantity }) => quantity > 0);
                } else {
                    console.error("Ignoring invalid saved cart data.");
                }
            }
        } catch (error) {
            console.error("Could not restore the saved cart.", error);
        }

        dispatch(hydrateCart(savedItems));
    }, [dispatch]);

    useEffect(() => {
        if (!isHydrated) return;

        try {
            const persistentItems = items.filter(({ quantity }) => quantity > 0);
            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistentItems));
        } catch (error) {
            console.error("Could not save the cart.", error);
        }
    }, [items, isHydrated]);

    return null;
};

export default CartPersistence;

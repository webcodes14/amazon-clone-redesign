"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isProduct } from "@/lib/product-validation";
import { hydrateWishlist } from "@/redux/wishlistSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import type { Product } from "@/types";

const WISHLIST_STORAGE_KEY = "stock-pulse-wishlist";

const WishlistPersistence = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, isHydrated } = useSelector((state: RootState) => state.wishlist);

    useEffect(() => {
        let savedProducts: Product[] = [];

        try {
            const storedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (storedWishlist !== null) {
                const parsedWishlist: unknown = JSON.parse(storedWishlist);
                if (Array.isArray(parsedWishlist) && parsedWishlist.every(isProduct)) {
                    savedProducts = parsedWishlist;
                } else {
                    console.error("Ignoring invalid saved wishlist data.");
                }
            }
        } catch (error) {
            console.error("Could not restore the saved wishlist.", error);
        }

        dispatch(hydrateWishlist(savedProducts));
    }, [dispatch]);

    useEffect(() => {
        if (!isHydrated) return;

        try {
            window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(products));
        } catch (error) {
            console.error("Could not save the wishlist.", error);
        }
    }, [products, isHydrated]);

    return null;
};

export default WishlistPersistence;

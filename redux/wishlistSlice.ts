import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";

interface WishlistState {
    products: Product[];
    isHydrated: boolean;
}

const initialState: WishlistState = {
    products: [],
    isHydrated: false,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addWishlistProduct(state, action: PayloadAction<Product>) {
            if (!state.products.some(({ id }) => id === action.payload.id)) {
                state.products.push(action.payload);
            }
        },
        removeWishlistProduct(state, action: PayloadAction<number>) {
            state.products = state.products.filter(({ id }) => id !== action.payload);
        },
        hydrateWishlist(state, action: PayloadAction<Product[]>) {
            state.products = action.payload;
            state.isHydrated = true;
        },
    },
});

export const { addWishlistProduct, removeWishlistProduct, hydrateWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

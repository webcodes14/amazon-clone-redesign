import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isHydrated: boolean;
}

interface SetCartProductQuantityPayload {
    productId: number;
    quantity: number;
}

const initialState: CartState = {
    items: [],
    isHydrated: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addCartProduct(state, action: PayloadAction<Product>) {
            const existingItem = state.items.find(({ product }) => product.id === action.payload.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ product: action.payload, quantity: 1 });
            }
        },
        setCartProductQuantity(state, action: PayloadAction<SetCartProductQuantityPayload>) {
            const item = state.items.find(({ product }) => product.id === action.payload.productId);
            if (item) {
                item.quantity = Math.max(0, action.payload.quantity);
            }
        },
        removeCartProduct(state, action: PayloadAction<number>) {
            state.items = state.items.filter(({ product }) => product.id !== action.payload);
        },
        clearCart(state) {
            state.items = [];
        },
        removeZeroQuantityCartProducts(state) {
            state.items = state.items.filter(({ quantity }) => quantity > 0);
        },
        hydrateCart(state, action: PayloadAction<CartItem[]>) {
            state.items = action.payload.filter(({ quantity }) => quantity > 0);
            state.isHydrated = true;
        },
    },
});

export const {
    addCartProduct,
    setCartProductQuantity,
    removeCartProduct,
    clearCart,
    removeZeroQuantityCartProducts,
    hydrateCart,
} = cartSlice.actions;
export default cartSlice.reducer;

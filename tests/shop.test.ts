import { describe, expect, it } from "vitest";
import { getCartSummary } from "@/lib/cart-summary";
import { getDiscountedPrice } from "@/lib/pricing";
import cartReducer, {
    addCartProduct,
    hydrateCart,
    removeZeroQuantityCartProducts,
    setCartProductQuantity,
} from "@/redux/cartSlice";
import wishlistReducer, { addWishlistProduct, removeWishlistProduct } from "@/redux/wishlistSlice";
import type { Product } from "@/types";

const product: Product = {
    id: 1,
    title: "Test product",
    price: 24.99,
    discount_percentage: 0,
    thumbnail: "/test.png",
    category: "test",
    stock: 10,
    availability_status: "In Stock",
};

describe("pricing and cart", () => {
    it("rounds discounts and bounds invalid percentages", () => {
        expect(getDiscountedPrice(10.01, 10)).toBe(9.01);
        expect(getDiscountedPrice(10, -5)).toBe(10);
        expect(getDiscountedPrice(10, 110)).toBe(0);
        expect(getDiscountedPrice(10, Number.NaN)).toBe(10);
    });

    it("calculates shipping on both sides of the free shipping threshold", () => {
        expect(getCartSummary([{ product, quantity: 2 }])).toEqual({
            subtotal: 49.98,
            shipping: 4.99,
            total: 54.97,
            remaining: 0.02,
        });
        expect(getCartSummary([{ product: { ...product, price: 25 }, quantity: 2 }])).toEqual({
            subtotal: 50,
            shipping: 0,
            total: 50,
            remaining: 0,
        });
    });

    it("uses the rounded discounted unit price for each item", () => {
        expect(getCartSummary([{ product: { ...product, price: 10.01, discount_percentage: 10 }, quantity: 3 }]))
            .toMatchObject({ subtotal: 27.03, shipping: 4.99, total: 32.02 });
    });

    it("combines repeated additions and removes zero-quantity items", () => {
        let state = cartReducer(undefined, addCartProduct(product));
        state = cartReducer(state, addCartProduct(product));
        expect(state.items).toEqual([{ product, quantity: 2 }]);
        state = cartReducer(state, setCartProductQuantity({ productId: product.id, quantity: 0 }));
        state = cartReducer(state, removeZeroQuantityCartProducts());
        expect(state.items).toEqual([]);
    });

    it("ignores zero-quantity entries when hydrating a cart", () => {
        const state = cartReducer(undefined, hydrateCart([
            { product, quantity: 0 },
            { product: { ...product, id: 2 }, quantity: 1 },
        ]));
        expect(state.isHydrated).toBe(true);
        expect(state.items.map(({ product: item }) => item.id)).toEqual([2]);
    });
});

describe("wishlist", () => {
    it("does not duplicate a product and can remove it", () => {
        let state = wishlistReducer(undefined, addWishlistProduct(product));
        state = wishlistReducer(state, addWishlistProduct(product));
        expect(state.products).toEqual([product]);
        state = wishlistReducer(state, removeWishlistProduct(product.id));
        expect(state.products).toEqual([]);
    });
});

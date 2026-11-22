import { getDiscountedPrice } from "@/lib/pricing";
import type { CartItem } from "@/redux/cartSlice";

export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_COST = 4.99;

export const getCartSummary = (items: CartItem[]) => {
    const subtotalCents = items.reduce(
        (total, { product, quantity }) =>
            total + Math.round(getDiscountedPrice(product.price, product.discount_percentage) * 100) * quantity,
        0
    );
    const thresholdCents = FREE_SHIPPING_THRESHOLD * 100;
    const shippingCents = subtotalCents >= thresholdCents ? 0 : Math.round(SHIPPING_COST * 100);

    return {
        subtotal: subtotalCents / 100,
        shipping: shippingCents / 100,
        total: (subtotalCents + shippingCents) / 100,
        remaining: Math.max(0, thresholdCents - subtotalCents) / 100,
    };
};

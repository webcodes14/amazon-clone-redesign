import { FREE_SHIPPING_THRESHOLD, getCartSummary } from "@/lib/cart-summary";
import type { CartItem } from "@/redux/cartSlice";

const OrderSummary = ({ items }: { items: CartItem[] }) => {
    const { subtotal, shipping, total, remaining } = getCartSummary(items);
    const shippingProgress = Math.min(Math.max(subtotal, 0), FREE_SHIPPING_THRESHOLD);

    return (
        <div>
            <h2 className="text-xl font-bold">Order summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                    <dt>Subtotal</dt>
                    <dd>${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt>Shipping</dt>
                    <dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-ca-grey/50 pt-3 text-base font-bold dark:border-white/20">
                    <dt>Total</dt>
                    <dd>${total.toFixed(2)}</dd>
                </div>
            </dl>
            <div className="mt-5">
                <p className="text-sm" aria-live="polite">
                    {remaining > 0
                        ? `Add $${remaining.toFixed(2)} more for free shipping.`
                        : "You qualify for free shipping!"}
                </p>
                <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-ca-black/10 dark:bg-white/20"
                    role="progressbar"
                    aria-label="Progress towards free shipping"
                    aria-valuemin={0}
                    aria-valuemax={FREE_SHIPPING_THRESHOLD}
                    aria-valuenow={shippingProgress}
                    aria-valuetext={`$${shippingProgress.toFixed(2)} of $${FREE_SHIPPING_THRESHOLD.toFixed(2)}`}
                >
                    <div
                        className="h-full origin-left rounded-full bg-ca-orange motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out"
                        style={{ transform: `scaleX(${shippingProgress / FREE_SHIPPING_THRESHOLD})` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;

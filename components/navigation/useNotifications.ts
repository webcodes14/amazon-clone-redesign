"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartSummary } from "@/lib/cart-summary";
import { supabase } from "@/lib/supabase/client";
import { markNotificationsRead, retainActiveNotificationKeys } from "@/redux/notificationsSlice";
import type { AppDispatch, RootState } from "@/redux/store";

interface NotificationProduct {
    id: number;
    title: string;
    discount_percentage: number;
    stock: number;
}

export interface ShopNotification {
    key: string;
    message: string;
}

const isNotificationProduct = (value: unknown): value is NotificationProduct => {
    if (typeof value !== "object" || value === null) return false;
    const product = value as Record<string, unknown>;
    return Number.isInteger(product.id) &&
        typeof product.title === "string" &&
        typeof product.discount_percentage === "number" &&
        Number.isFinite(product.discount_percentage) &&
        typeof product.stock === "number" &&
        Number.isFinite(product.stock);
};

const useNotifications = () => {
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.cart);
    const wishlist = useSelector((state: RootState) => state.wishlist);
    const { readKeys, isHydrated: readKeysHydrated } = useSelector((state: RootState) => state.notifications);
    const [data, setData] = useState<{ idsKey: string; offers: NotificationProduct[]; personal: NotificationProduct[] } | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [refreshVersion, setRefreshVersion] = useState(0);

    const cartItems = cart.items.filter(({ quantity }) => quantity > 0);
    const cartIds = cartItems.map(({ product }) => product.id);
    const wishlistIds = wishlist.products.map(({ id }) => id);
    const idsKey = JSON.stringify([...new Set([...cartIds, ...wishlistIds])].sort((a, b) => a - b));

    useEffect(() => {
        if (!cart.isHydrated || !wishlist.isHydrated) return;
        let active = true;
        const ids: number[] = JSON.parse(idsKey);

        const loadNotifications = async () => {
            setStatus("loading");
            try {
                let offersQuery = supabase
                    .from("products")
                    .select("id, title, discount_percentage, stock")
                    .gt("discount_percentage", 0)
                    .order("discount_percentage", { ascending: false })
                    .order("id")
                    .limit(3);
                if (ids.length > 0) {
                    offersQuery = offersQuery.not("id", "in", `(${ids.join(",")})`);
                }
                const personalQuery = ids.length > 0
                    ? supabase.from("products").select("id, title, discount_percentage, stock").in("id", ids)
                    : Promise.resolve({ data: [], error: null });
                const [offersResult, personalResult] = await Promise.all([offersQuery, personalQuery]);
                if (offersResult.error) throw offersResult.error;
                if (personalResult.error) throw personalResult.error;
                const offers: unknown = offersResult.data;
                const personal: unknown = personalResult.data;
                if (!Array.isArray(offers) || !offers.every(isNotificationProduct) ||
                    !Array.isArray(personal) || !personal.every(isNotificationProduct)) {
                    throw new Error("Invalid notification product data.");
                }
                if (!active) return;
                setData({ idsKey, offers, personal });
                setStatus("ready");
            } catch (error) {
                if (!active) return;
                console.error("Could not load notification products.", error);
                setData(null);
                setStatus("error");
            }
        };

        void loadNotifications();
        return () => { active = false; };
    }, [cart.isHydrated, wishlist.isHydrated, idsKey, refreshVersion]);

    const notifications: ShopNotification[] = [];
    if (data?.idsKey === idsKey) {
        const personalProducts = new Map(data.personal.map((product) => [product.id, product]));
        for (const [location, ids] of [["wishlist", wishlistIds], ["cart", cartIds]] as const) {
            const products = ids
                .map((id) => personalProducts.get(id))
                .filter((product): product is NotificationProduct => product !== undefined);
            const groups = [
                { type: "discount", products: products.filter((product) => product.discount_percentage > 0), description: "on sale" },
                { type: "low-stock", products: products.filter((product) => product.stock > 0 && product.stock <= 5), description: "low on stock" },
                { type: "out-of-stock", products: products.filter((product) => product.stock <= 0), description: "out of stock" },
            ];
            for (const group of groups) {
                if (group.products.length === 0) continue;
                const count = group.products.length;
                const values = group.products
                    .map((product) => [product.id, group.type === "discount" ? product.discount_percentage : product.stock])
                    .sort((first, second) => first[0] - second[0]);
                notifications.push({
                    key: `${group.type}:${location}:${JSON.stringify(values)}`,
                    message: count === 1
                        ? `A product in your ${location} is ${group.description}.`
                        : `${count} products in your ${location} are ${group.description}.`,
                });
            }
        }
        if (data.offers.length > 0) {
            const offers = data.offers
                .map(({ id, discount_percentage }) => [id, discount_percentage])
                .sort((first, second) => first[0] - second[0]);
            const highestDiscount = Math.max(...data.offers.map(({ discount_percentage }) => discount_percentage));
            notifications.push({
                key: `offers:${JSON.stringify(offers)}`,
                message: `Current offers: up to ${highestDiscount}% off.`,
            });
        }
    }

    if (cart.isHydrated && cartItems.length > 0) {
        const { remaining } = getCartSummary(cartItems);
        if (remaining > 0) {
            notifications.push({
                key: `shipping:${remaining.toFixed(2)}`,
                message: `Add $${remaining.toFixed(2)} more for free shipping.`,
            });
        }
    }

    const activeKeys = JSON.stringify(notifications.map(({ key }) => key).sort());
    useEffect(() => {
        if (status !== "ready" || !readKeysHydrated || data?.idsKey !== idsKey) return;
        const keys: string[] = JSON.parse(activeKeys);
        dispatch(retainActiveNotificationKeys(keys));
    }, [activeKeys, data?.idsKey, dispatch, idsKey, readKeysHydrated, status]);

    const readSet = new Set(readKeys);
    const unreadCount = readKeysHydrated
        ? notifications.filter(({ key }) => !readSet.has(key)).length
        : 0;

    return {
        notifications,
        unreadCount,
        status: !cart.isHydrated || !wishlist.isHydrated || !readKeysHydrated ? "loading" : status,
        isRead: (key: string) => readSet.has(key),
        markAllRead: () => dispatch(markNotificationsRead(notifications.map(({ key }) => key))),
        refresh: () => setRefreshVersion((version) => version + 1),
    };
};

export default useNotifications;

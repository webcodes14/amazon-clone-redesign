"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { supabase } from "@/lib/supabase/client";
import type { CartItem } from "@/redux/cartSlice";
import type { Product } from "@/types";

const CartRecommendations = ({ items }: { items: CartItem[] }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const categoriesKey = JSON.stringify([...new Set(items.map(({ product }) => product.category))].sort());
    const idsKey = JSON.stringify(items.map(({ product }) => product.id).sort((a, b) => a - b));

    useEffect(() => {
        let active = true;
        const categories: string[] = JSON.parse(categoriesKey);
        const ids: number[] = JSON.parse(idsKey);

        const loadRecommendations = async () => {
            setStatus("loading");
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .in("category", categories)
                    .not("id", "in", `(${ids.join(",")})`)
                    .order("id")
                    .limit(4);

                if (error) throw error;
                if (!data) throw new Error("Missing recommendation data.");
                if (!active) return;
                setProducts(data as Product[]);
                setStatus("ready");
            } catch (error) {
                if (!active) return;
                console.error("Could not load cart recommendations.", error);
                setStatus("error");
            }
        };

        void loadRecommendations();
        return () => { active = false; };
    }, [categoriesKey, idsKey]);

    if (status === "ready" && products.length === 0) return null;

    return (
        <section className="mt-12" aria-labelledby="cart-recommendations-title">
            <h2 id="cart-recommendations-title" className="text-2xl font-bold">You may also like</h2>
            {status === "loading" && <p className="mt-4 text-sm">Loading recommendations...</p>}
            {status === "error" && (
                <p className="mt-4 text-sm" role="status">Recommendations are temporarily unavailable.</p>
            )}
            {status === "ready" && (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {products.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            )}
        </section>
    );
};

export default CartRecommendations;

import { createClient } from "@/lib/supabase/server";
import {
    isSafeProductSearchQuery,
    MAX_PRODUCT_SEARCH_LENGTH,
    normalizeProductSearchQuery,
} from "@/lib/product-search";
import type { ProductSearchSuggestion } from "@/types/product-search.types";

export async function POST(request: Request) {
    const supabase = await createClient();
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
        return Response.json({ error: "Expected a JSON request." }, { status: 415 });
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch (error) {
        if (error instanceof SyntaxError) {
            return Response.json({ error: "Invalid JSON request." }, { status: 400 });
        }

        throw error;
    }

    if (
        typeof body !== "object" ||
        body === null ||
        !("query" in body) ||
        typeof body.query !== "string"
    ) {
        return Response.json({ error: "A search query is required." }, { status: 400 });
    }

    if (body.query.length > MAX_PRODUCT_SEARCH_LENGTH) {
        return Response.json({ error: "The search query is too long." }, { status: 400 });
    }

    const query = normalizeProductSearchQuery(body.query);

    if (query.length < 2 || !isSafeProductSearchQuery(query)) {
        return Response.json({ error: "The search query contains unsupported characters." }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("products")
        .select("id, title, thumbnail, category")
        .ilike("title", `%${query}%`)
        .order("title")
        .limit(3);

    if (error) {
        console.error("Product search failed.", error.message);
        return Response.json({ error: "Product search is temporarily unavailable." }, { status: 500 });
    }

    if (!data) {
        console.error("Product search returned no result payload.");
        return Response.json({ error: "Product search is temporarily unavailable." }, { status: 500 });
    }

    const products: ProductSearchSuggestion[] = data.map((product) => ({
        id: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        category: product.category,
    }));

    return Response.json({ products });
}

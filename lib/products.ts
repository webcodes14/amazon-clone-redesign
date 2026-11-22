import { createClient } from "./supabase/server";
import { Product } from "@/types";

export async function getProducts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

    if ( error ) {
        throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data as Product[];
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('id');

    if (error) {
        throw new Error(`Failed to fetch products for category "${category}": ${error.message}`);
    }

    return data as Product[];
}

export async function getProductById(id: number): Promise<Product | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to fetch product "${id}": ${error.message}`);
    }

    return data as Product | null;
}

export async function getProductImages(title: string, category: string): Promise<string[]> {
    const response = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(title)}&select=title,category,images`,
        {
        next: { revalidate: 86400 },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to search product images for "${title}": ${response.status} ${response.statusText}`);
    }

    const data: unknown = await response.json();
    if (typeof data !== "object" || data === null || !("products" in data) || !Array.isArray(data.products)) {
        throw new Error(`Invalid product image search response for "${title}"`);
    }

    const matchingProduct = data.products.find(
        (item) =>
            typeof item === "object" &&
            item !== null &&
            "title" in item &&
            item.title === title &&
            "category" in item &&
            item.category === category
    );
    if (typeof matchingProduct !== "object" || matchingProduct === null || !("images" in matchingProduct)) {
        throw new Error(`No matching product image data found for "${title}" in "${category}"`);
    }

    const images = matchingProduct.images;
    if (!Array.isArray(images) || !images.every((image) => typeof image === "string")) {
        throw new Error(`Invalid product image list for "${title}"`);
    }

    return images.filter((image) => image.length > 0);
}
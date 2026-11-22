import { createClient } from "./supabase/server";
import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient();
    // Načte pouze sloupec category a vynechá řádky, které ho nemají vyplněný.
    const { data, error } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null);

    // Chybu předáme dál, aby ji mohl zpracovat serverový layout.
    if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    // Ořízne mezery, odstraní prázdné a duplicitní názvy a výsledek seřadí.
    return [...new Set(
        data
            .map(({ category }) => category?.trim())
            .filter((category): category is Category => Boolean(category))
    )].sort((a, b) => a.localeCompare(b));
}

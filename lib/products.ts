import { supabase } from "./supabase";
import { Product } from "@/types";

export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

    if ( error ) {
        console.error('Fetch failed!', error.message);
        return [];
    }

    return data as Product[];
}
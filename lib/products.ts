import { supabase } from "./supabase";

interface Review {
    rating: number;
    reviewerName: string;
    reviewerEmail: string;
    date: string;
    comment: string;
}

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discount_percentage: number;
    brand: string;
    thumbnail: string;
    category: string;
    stock: number;
    availability_status: string;
    reviews: Review[];
}

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
export interface Review {
    rating: number;
    reviewerName: string;
    reviewerEmail: string;
    date: string;
    comment: string;
}

export interface Product {
    id: number;
    title: string;
    description?: string | null;
    short_description?: string | null;
    long_description?: string | null;
    price: number;
    discount_percentage: number;
    brand?: string | null;
    thumbnail: string;
    images?: string[] | null;
    category: string;
    stock: number;
    availability_status: string;
    reviews?: Review[] | null;
}
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
    description?: string;
    price: number;
    discount_percentage: number;
    brand?: string;
    thumbnail: string;
    category: string;
    stock: number;
    availability_status: string;
    reviews: Review[];
}
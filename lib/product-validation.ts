import type { Product, Review } from "@/types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isReview = (value: unknown): value is Review =>
    isRecord(value) &&
    typeof value.rating === "number" &&
    typeof value.reviewerName === "string" &&
    typeof value.reviewerEmail === "string" &&
    typeof value.date === "string" &&
    typeof value.comment === "string";

export const isProduct = (value: unknown): value is Product =>
    isRecord(value) &&
    Number.isInteger(value.id) &&
    typeof value.title === "string" &&
    (value.description === undefined || value.description === null || typeof value.description === "string") &&
    (value.short_description === undefined ||
        value.short_description === null ||
        typeof value.short_description === "string") &&
    (value.long_description === undefined ||
        value.long_description === null ||
        typeof value.long_description === "string") &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    typeof value.discount_percentage === "number" &&
    Number.isFinite(value.discount_percentage) &&
    (value.brand === undefined || value.brand === null || typeof value.brand === "string") &&
    typeof value.thumbnail === "string" &&
    (value.images === undefined ||
        value.images === null ||
        (Array.isArray(value.images) && value.images.every((image) => typeof image === "string"))) &&
    typeof value.category === "string" &&
    typeof value.stock === "number" &&
    Number.isFinite(value.stock) &&
    typeof value.availability_status === "string" &&
    (value.reviews === undefined ||
        value.reviews === null ||
        (Array.isArray(value.reviews) && value.reviews.every(isReview)));

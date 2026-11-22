export const getDiscountedPrice = (price: number, discountPercentage: number): number => {
    const discount = Number.isFinite(discountPercentage)
        ? Math.min(100, Math.max(0, discountPercentage))
        : 0;

    const discountedPrice = price * (1 - discount / 100);
    return Math.round((discountedPrice + Number.EPSILON) * 100) / 100;
};

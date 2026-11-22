export const MAX_PRODUCT_SEARCH_LENGTH = 30;

const allowedSearchCharacters = /^[\p{L}\p{N}\p{M}\s.'’&()+,-]+$/u;

export const normalizeProductSearchQuery = (query: string) =>
    query.normalize("NFKC").trim().replace(/\s+/g, " ");

export const isSafeProductSearchQuery = (query: string) => {
    const normalizedQuery = normalizeProductSearchQuery(query);

    return (
        normalizedQuery.length > 0 &&
        normalizedQuery.length <= MAX_PRODUCT_SEARCH_LENGTH &&
        allowedSearchCharacters.test(normalizedQuery)
    );
};

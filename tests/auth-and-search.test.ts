import { AuthApiError } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import { getAuthRequestErrorMessage } from "@/lib/auth-errors";
import { getSafeRedirectPath } from "@/lib/auth-redirect";
import { isSafeProductSearchQuery, normalizeProductSearchQuery } from "@/lib/product-search";

describe("authentication", () => {
    it("preserves safe internal destinations including their query and fragment", () => {
        expect(getSafeRedirectPath("/checkout?from=cart#summary")).toBe("/checkout?from=cart#summary");
    });

    it.each(["//example.test", "/\\example.test", "https://example.test", "/auth", "/auth/reset-password"])(
        "rejects an unsafe destination: %s",
        (destination) => {
            expect(getSafeRedirectPath(destination)).toBe("/");
        }
    );

    it("distinguishes rate limits from other authentication failures", () => {
        const fallback = "Could not sign in.";
        expect(getAuthRequestErrorMessage(new AuthApiError("limited", 429, "rate_limit"), fallback))
            .toBe("Too many requests. Please wait before trying again.");
        expect(getAuthRequestErrorMessage(new AuthApiError("invalid", 400, "invalid"), fallback))
            .toBe(fallback);
    });
});

describe("product search", () => {
    it("normalizes whitespace and accepts international text", () => {
        expect(normalizeProductSearchQuery("  Café   au lait  ")).toBe("Café au lait");
        expect(isSafeProductSearchQuery("Café & tea")).toBe(true);
    });

    it.each(["", "a".repeat(31), "<script>", "x%"])("rejects unsupported query: %s", (query) => {
        expect(isSafeProductSearchQuery(query)).toBe(false);
    });
});

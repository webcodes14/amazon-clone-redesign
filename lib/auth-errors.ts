import type { AuthError } from "@supabase/supabase-js";

export function isMissingAuthSession(error: AuthError | null) {
    return error?.name === "AuthSessionMissingError";
}

export function getAuthRequestErrorMessage(error: AuthError, fallback: string) {
    return error.status === 429
        ? "Too many requests. Please wait before trying again."
        : fallback;
}

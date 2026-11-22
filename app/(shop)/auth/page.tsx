import { redirect } from "next/navigation";
import AuthExperience from "@/components/auth/AuthExperience";
import { getSafeRedirectPath } from "@/lib/auth-redirect";
import { isMissingAuthSession } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/server";

interface AuthPageProps {
    searchParams: Promise<{ next?: string; mode?: string; error?: string }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
    const params = await searchParams;
    const nextPath = getSafeRedirectPath(params.next);
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error && !isMissingAuthSession(error)) {
        throw new Error(`Could not verify the current user: ${error.message}`);
    }
    if (user && !user.is_anonymous) {
        redirect(nextPath);
    }

    return (
        <AuthExperience
            nextPath={nextPath}
            initialMode={user?.is_anonymous || params.mode === "sign-up" ? "sign-up" : "sign-in"}
            initialError={
                params.error
                    ? "The email link is invalid or expired. Please request a new one and try again."
                    : ""
            }
        />
    );
}

import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";
import { isMissingAuthSession } from "@/lib/auth-errors";

export default async function ResetPasswordPage() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error && !isMissingAuthSession(error)) {
        throw new Error(`Could not verify the password reset session: ${error.message}`);
    }
    if (!user || user.is_anonymous) {
        redirect("/auth");
    }

    return (
        <section className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6">
            <ResetPasswordForm />
        </section>
    );
}

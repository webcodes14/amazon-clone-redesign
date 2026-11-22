import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isMissingAuthSession } from "@/lib/auth-errors";
import DeleteAccountButton from "@/components/auth/DeleteAccountButton";

export default async function AccountPage() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error && !isMissingAuthSession(error)) {
        throw new Error(`Could not verify the current user: ${error.message}`);
    }
    if (!user) {
        redirect("/auth?next=/account");
    }

    return (
        <section className="w-full px-4 py-8 sm:px-6 lg:pr-8 min-[992px]:-ml-16 min-[992px]:w-[calc(100%+4rem)] min-[992px]:pl-16 lg:pl-24">
            <h1 className="text-3xl font-bold">My account</h1>
            <div className="mt-6 rounded-xl border border-ca-grey/50 p-5 dark:border-white/20">
                <h2 className="text-lg font-bold">Account details</h2>
                <p className="mt-2 text-sm text-ca-black/70 dark:text-white/70">
                    {user.is_anonymous ? "You are using a private demo session." : user.email}
                </p>
                {user.is_anonymous && (
                    <p className="mt-3 text-sm text-ca-black/70 dark:text-white/70">
                        Demo orders are saved to this anonymous account. Create a verified account to keep the history if this session is lost or cleared.
                    </p>
                )}
            </div>
            <Link
                href="/orders"
                className="mt-6 inline-flex rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black hover:bg-ca-orange/80"
            >
                View my demo orders
            </Link>
            <DeleteAccountButton />
        </section>
    );
}

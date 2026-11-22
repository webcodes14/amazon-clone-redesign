"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const ResetPasswordForm = () => {
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        if (password.length < 12 || password.length > 72) {
            setErrorMessage("Use a password between 12 and 72 characters.");
            return;
        }
        if (password !== confirmation) {
            setErrorMessage("The passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await createClient().auth.updateUser({ password });
            if (error) {
                setErrorMessage("We could not update your password. Request a new reset link and try again.");
                return;
            }

            setPassword("");
            setConfirmation("");
            setIsUpdated(true);
        } catch {
            setErrorMessage("We could not update your password. Request a new reset link and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isUpdated) {
        return (
            <div className="empty-state-enter py-8 text-center">
                <div role="status" aria-live="polite">
                    <h1 className="text-3xl font-bold">Password updated</h1>
                    <p className="mt-3 text-sm text-ca-black/65 dark:text-white/65">Your new password is ready to use.</p>
                </div>
                <Link href="/" className="mt-6 inline-flex rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange">
                    Back to home
                </Link>
            </div>
        );
    }

    return (
        <>
        <h1 className="text-3xl font-bold">Choose a new password</h1>
        <p className="mt-3 text-sm text-ca-black/65 dark:text-white/65">
            Use at least 12 characters. Your password is sent directly to Supabase Auth and is never stored by this app.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-ca-grey/50 p-5 dark:border-white/20">
            <label className="block text-sm font-semibold" htmlFor="new-password">
                New password
                <input
                    id="new-password"
                    className="mt-2 w-full rounded-md border border-ca-grey bg-white px-3 py-2.5 text-ca-black outline-none focus:border-ca-orange focus:ring-2 focus:ring-ca-orange/40 dark:border-white/20 dark:bg-ca-black dark:text-white"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </label>
            <label className="block text-sm font-semibold" htmlFor="confirm-new-password">
                Confirm new password
                <input
                    id="confirm-new-password"
                    className="mt-2 w-full rounded-md border border-ca-grey bg-white px-3 py-2.5 text-ca-black outline-none focus:border-ca-orange focus:ring-2 focus:ring-ca-orange/40 dark:border-white/20 dark:bg-ca-black dark:text-white"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    required
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                />
            </label>
            {errorMessage && <p role="alert" className="text-sm font-semibold text-red-700 dark:text-red-300">{errorMessage}</p>}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black hover:bg-ca-orange/80 disabled:cursor-wait disabled:opacity-60"
            >
                {isSubmitting ? "Updating..." : "Update password"}
            </button>
        </form>
        <Link href="/account" className="mt-5 inline-flex text-sm font-semibold underline underline-offset-2 hover:text-ca-orange">
            Cancel
        </Link>
        </>
    );
};

export default ResetPasswordForm;

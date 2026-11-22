"use client";

import { useId, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

export default function DeleteAccountButton() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const descriptionId = useId();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [accountDeleted, setAccountDeleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const deleteAccount = async () => {
        setIsSubmitting(true);
        setErrorMessage("");
        let deleted = accountDeleted;
        let isRedirecting = false;
        try {
            const supabase = createClient();
            if (!deleted) {
                const { error } = await supabase.rpc("delete_own_account");
                if (error) {
                    console.error("Could not delete account:", error);
                    setErrorMessage("We could not confirm that your account was deleted. Check your connection and try again.");
                    return;
                }
                deleted = true;
                setAccountDeleted(true);
            }

            const { error } = await supabase.auth.signOut({ scope: "local" });
            if (error) {
                console.error("Could not complete local sign-out:", error);
                setErrorMessage("Your account was deleted, but sign-out could not be completed. Please try signing out again.");
                return;
            }

            window.location.assign("/");
            isRedirecting = true;
        } catch (error) {
            console.error(deleted ? "Could not complete local sign-out:" : "Could not delete account:", error);
            setErrorMessage(deleted
                ? "Your account was deleted, but sign-out could not be completed. Please try signing out again."
                : "We could not confirm that your account was deleted. Check your connection and try again.");
        } finally {
            if (!isRedirecting) setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8">
            <button
                type="button"
                onClick={() => {
                    setErrorMessage("");
                    dialogRef.current?.showModal();
                }}
                disabled={isSubmitting}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-red-700 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-wait disabled:opacity-60 dark:border-red-300 dark:text-red-300 dark:hover:bg-red-950"
            >
                <FaRegTrashAlt aria-hidden="true" />
                {accountDeleted ? "Finish signing out" : "Delete account"}
            </button>
            <dialog
                ref={dialogRef}
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                onCancel={(event) => {
                    if (isSubmitting) event.preventDefault();
                }}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        event.preventDefault();
                        if (!isSubmitting) dialogRef.current?.close();
                    }
                }}
                className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-ca-grey bg-white p-6 text-left text-ca-black shadow-xl backdrop:bg-black/60 dark:border-white/20 dark:bg-ca-black dark:text-white"
            >
                <h2 id={titleId} className="text-xl font-bold">{accountDeleted ? "Finish signing out" : "Delete your account?"}</h2>
                <p id={descriptionId} className="mt-3 text-sm text-ca-black/70 dark:text-white/70">
                    {accountDeleted
                        ? "Your account has been deleted. Please finish signing out on this device."
                        : "This permanently deletes your account and its demo orders. Your cart and wishlist in this browser will remain."}
                </p>
                {errorMessage && <p role="alert" className="mt-4 text-sm font-semibold text-red-700 dark:text-red-300">{errorMessage}</p>}
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => dialogRef.current?.close()}
                        disabled={isSubmitting}
                        className="cursor-pointer rounded-md border border-ca-black/30 px-5 py-2.5 font-semibold transition-colors hover:bg-ca-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange disabled:cursor-wait disabled:opacity-60 dark:border-white/30 dark:hover:bg-white/10"
                    >
                        {accountDeleted ? "Close" : "Keep account"}
                    </button>
                    <button
                        type="button"
                        onClick={deleteAccount}
                        disabled={isSubmitting}
                        className="cursor-pointer rounded-md bg-red-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isSubmitting ? "Please wait..." : accountDeleted ? "Try signing out" : "Delete account"}
                    </button>
                </div>
            </dialog>
        </div>
    );
}

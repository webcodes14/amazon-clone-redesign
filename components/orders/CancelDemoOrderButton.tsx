"use client";

import { useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CancelDemoOrderButton = ({ orderId }: { orderId: string }) => {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const descriptionId = useId();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRefreshing, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState("");

    const cancelOrder = async () => {
        setIsSubmitting(true);
        setErrorMessage("");
        try {
            const { error } = await createClient().rpc("cancel_demo_order", { p_order_id: orderId });
            if (error) {
                setErrorMessage("We could not cancel this demo order. It may no longer be eligible; refresh and try again.");
                return;
            }
            dialogRef.current?.close();
            startTransition(() => router.refresh());
        } catch {
            setErrorMessage("We could not cancel this demo order. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4">
            <button
                type="button"
                onClick={() => {
                    setErrorMessage("");
                    dialogRef.current?.showModal();
                }}
                disabled={isSubmitting || isRefreshing}
                className="cursor-pointer rounded-md border border-ca-black px-4 py-2 text-sm font-semibold transition-colors hover:bg-ca-black hover:text-white disabled:cursor-wait disabled:opacity-60 dark:border-white dark:hover:bg-white dark:hover:text-ca-black"
            >
                {isSubmitting || isRefreshing ? "Cancelling..." : "Cancel demo order"}
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
                <h2 id={titleId} className="text-xl font-bold">Cancel this demo order?</h2>
                <p id={descriptionId} className="mt-3 text-sm text-ca-black/70 dark:text-white/70">
                    The cancelled order will remain in your order history.
                </p>
                {errorMessage && <p role="alert" className="mt-4 text-sm font-semibold text-red-700 dark:text-red-300">{errorMessage}</p>}
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => dialogRef.current?.close()}
                        disabled={isSubmitting}
                        className="cursor-pointer rounded-md border border-ca-black/30 px-5 py-2.5 font-semibold transition-colors hover:bg-ca-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange disabled:cursor-wait disabled:opacity-60 dark:border-white/30 dark:hover:bg-white/10"
                    >
                        Keep order
                    </button>
                    <button
                        type="button"
                        onClick={cancelOrder}
                        disabled={isSubmitting}
                        className="cursor-pointer rounded-md bg-ca-orange px-5 py-2.5 font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange disabled:cursor-wait disabled:opacity-60"
                    >
                        {isSubmitting ? "Cancelling..." : "Cancel order"}
                    </button>
                </div>
            </dialog>
        </div>
    );
};

export default CancelDemoOrderButton;

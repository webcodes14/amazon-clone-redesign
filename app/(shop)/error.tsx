"use client";

import { useEffect } from "react";
import Link from "next/link";
import ErrorState, { errorPrimaryAction, errorSecondaryAction } from "@/components/navigation/ErrorState";

export default function ErrorPage({ error, retry, unstable_retry }: {
    error: unknown;
    retry?: () => void;
    unstable_retry?: () => void;
}) {
    useEffect(() => {
        console.error("Page render failed:", error);
    }, [error]);

    return (
        <ErrorState
            label="Something went wrong"
            title="We couldn't load this page"
            description="Please check your connection and try again. If the problem continues, come back later."
        >
            <button type="button" onClick={retry ?? unstable_retry ?? (() => window.location.reload())} className={errorPrimaryAction}>Try again</button>
            <Link href="/" className={errorSecondaryAction}>Back to home</Link>
        </ErrorState>
    );
}

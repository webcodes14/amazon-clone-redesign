"use client";

import { useEffect } from "react";
import ErrorState, { errorPrimaryAction, errorSecondaryAction } from "@/components/navigation/ErrorState";
import "./(shop)/globals.css";

export default function GlobalError({ error, retry, unstable_retry }: {
    error: unknown;
    retry?: () => void;
    unstable_retry?: () => void;
}) {
    useEffect(() => {
        console.error("Application render failed:", error);
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-white font-sans text-ca-black antialiased">
                <title>Something went wrong | Stock Pulse</title>
                <main className="flex min-h-screen items-center justify-center">
                    <ErrorState
                        label="Something went wrong"
                        title="We couldn't load the store"
                        description="Please check your connection and try again. If the problem continues, come back later."
                    >
                        <button type="button" onClick={retry ?? unstable_retry ?? (() => window.location.reload())} className={errorPrimaryAction}>Try again</button>
                        {/* A full navigation avoids depending on a potentially broken client router. */}
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a href="/" className={errorSecondaryAction}>Back to home</a>
                    </ErrorState>
                </main>
            </body>
        </html>
    );
}

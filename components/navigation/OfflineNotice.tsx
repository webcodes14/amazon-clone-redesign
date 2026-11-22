"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);
    return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
    };
}

export default function OfflineNotice() {
    const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);

    return (
        <div role="status" aria-live="polite">
            {!isOnline && (
                <div className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-md rounded-lg border border-ca-orange bg-ca-black px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
                    You appear to be offline. Check your connection and try again.
                </div>
            )}
        </div>
    );
}

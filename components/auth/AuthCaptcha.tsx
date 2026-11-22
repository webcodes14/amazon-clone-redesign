"use client";

import { useEffect, useId, useRef, useState, type Ref } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const AuthCaptcha = ({
    siteKey,
    widgetRef,
    onToken,
    token,
    className = "",
}: {
    siteKey: string;
    widgetRef: Ref<TurnstileInstance>;
    onToken: (token: string | null) => void;
    token: string | null;
    className?: string;
}) => {
    const [error, setError] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [compact, setCompact] = useState(false);
    const compactRef = useRef(false);
    const widgetId = useId();

    useEffect(() => {
        const media = window.matchMedia("(max-width: 399px)");
        const updateSize = () => {
            if (compactRef.current === media.matches) return;
            compactRef.current = media.matches;
            onToken(null);
            setIsReady(false);
            setCompact(media.matches);
        };
        updateSize();
        media.addEventListener("change", updateSize);
        return () => media.removeEventListener("change", updateSize);
    }, [onToken]);

    const handleError = () => {
        onToken(null);
        setIsReady(true);
        setError("Verification is unavailable. Check your connection or refresh the page and try again.");
    };

    return (
        <div>
            <span className="sr-only" role="status">{token ? "Security check complete." : ""}</span>
            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${token ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}>
                <div className="min-h-0 overflow-hidden" inert={Boolean(token)}>
                    <div className={className}>
                        <p className="mb-2 text-sm text-ca-black/70 dark:text-white/70">Complete the security check before continuing.</p>
                        <div className={`relative ${compact ? "h-[140px] w-[150px]" : "h-[65px] w-[300px]"}`}>
                            {!isReady && (
                                <div role="status" className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-md border border-ca-grey/50 bg-ca-grey/10 px-3 text-center text-sm text-ca-black/65 dark:border-white/20 dark:bg-white/5 dark:text-white/65">
                                    Preparing security check...
                                </div>
                            )}
                            <Turnstile
                                ref={widgetRef}
                                id={widgetId}
                                className="relative"
                                siteKey={siteKey}
                                options={{ size: compact ? "compact" : "normal" }}
                                onSuccess={(verifiedToken) => {
                                    setIsReady(true);
                                    setError("");
                                    onToken(verifiedToken);
                                }}
                                onBeforeInteractive={() => setIsReady(true)}
                                onExpire={() => {
                                    onToken(null);
                                    setError("Verification expired. Please complete the security check again.");
                                }}
                                onError={handleError}
                                onUnsupported={handleError}
                                onTimeout={handleError}
                                scriptOptions={{ onError: handleError }}
                            />
                        </div>
                        {error && <p role="alert" className="mt-2 text-sm font-semibold text-red-700 dark:text-red-300">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthCaptcha;

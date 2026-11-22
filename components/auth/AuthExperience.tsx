"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { FaRegEnvelope } from "react-icons/fa";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import AuthCaptcha from "./AuthCaptcha";
import AuthMascot from "./AuthMascot";
import { createClient } from "@/lib/supabase/client";
import { getAuthRequestErrorMessage } from "@/lib/auth-errors";
import { useAuth } from "@/providers/AuthProvider";

type AuthMode = "sign-in" | "sign-up" | "reset";

const inputClassName =
    "mt-2 w-full rounded-md border border-ca-grey bg-white px-3 py-2.5 text-ca-black outline-none transition-colors placeholder:text-ca-black/45 focus:border-ca-orange focus:ring-2 focus:ring-ca-orange/40 dark:border-white/20 dark:bg-ca-black dark:text-white dark:placeholder:text-white/45";

const AuthExperience = ({
    nextPath,
    initialMode,
    initialError,
}: {
    nextPath: string;
    initialMode: AuthMode;
    initialError: string;
}) => {
    const { user } = useAuth();
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailNotice, setEmailNotice] = useState<"new" | "demo" | "recovery" | null>(null);
    const [errorMessage, setErrorMessage] = useState(initialError);
    const [demoErrorMessage, setDemoErrorMessage] = useState("");
    const [activeSubmission, setActiveSubmission] = useState<"form" | "demo" | null>(null);
    const [formCaptchaToken, setFormCaptchaToken] = useState<string | null>(null);
    const [demoCaptchaToken, setDemoCaptchaToken] = useState<string | null>(null);
    const formCaptchaRef = useRef<TurnstileInstance>(null);
    const demoCaptchaRef = useRef<TurnstileInstance>(null);
    const captchaSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
    const isSubmitting = activeSubmission !== null;
    const requiresFormCaptcha = Boolean(captchaSiteKey) && !(mode === "sign-up" && user?.isAnonymous);

    const callbackUrl = (destination = nextPath) => {
        const url = new URL("/auth/callback", window.location.origin);
        url.searchParams.set("next", destination);
        return url.toString();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        if (requiresFormCaptcha && !formCaptchaToken) {
            setErrorMessage("Please complete the security check before continuing.");
            return;
        }
        setActiveSubmission("form");

        const normalizedEmail = email.trim().toLowerCase();
        let isRedirecting = false;
        let usedCaptcha = false;

        try {
            const supabase = createClient();
            if (mode === "sign-in") {
                usedCaptcha = Boolean(captchaSiteKey);
                const { error } = await supabase.auth.signInWithPassword({
                    email: normalizedEmail,
                    password,
                    options: { captchaToken: formCaptchaToken ?? undefined },
                });
                if (error) {
                    setErrorMessage(getAuthRequestErrorMessage(error, "We could not sign you in with those details. Please try again."));
                    return;
                }
                window.location.assign(nextPath);
                isRedirecting = true;
                return;
            }

            if (mode === "sign-up") {
                if (password.length < 12 || password.length > 72) {
                    setErrorMessage("Use a password between 12 and 72 characters.");
                    return;
                }
                if (password !== confirmPassword) {
                    setErrorMessage("The passwords do not match.");
                    return;
                }

                const { data: { session } } = await supabase.auth.getSession();
                const isConvertingDemo = session?.user.is_anonymous === true;
                usedCaptcha = Boolean(captchaSiteKey) && !isConvertingDemo;
                const authResult = isConvertingDemo
                    ? await supabase.auth.updateUser(
                        { email: normalizedEmail, password },
                        { emailRedirectTo: callbackUrl() }
                    )
                    : await supabase.auth.signUp({
                        email: normalizedEmail,
                        password,
                        options: { emailRedirectTo: callbackUrl(), captchaToken: formCaptchaToken ?? undefined },
                    });

                if (authResult.error) {
                    setErrorMessage(getAuthRequestErrorMessage(authResult.error, "We could not create the account. Check the details and try again."));
                    return;
                }

                const convertedUser = authResult.data.user;
                const hasConfirmedConversion = isConvertingDemo
                    && convertedUser?.is_anonymous === false
                    && convertedUser.email === normalizedEmail
                    && Boolean(convertedUser.email_confirmed_at);
                if (hasConfirmedConversion || (!isConvertingDemo && "session" in authResult.data && authResult.data.session)) {
                    window.location.assign(nextPath);
                    isRedirecting = true;
                    return;
                }

                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setEmailNotice(isConvertingDemo ? "demo" : "new");
                return;
            }

            usedCaptcha = Boolean(captchaSiteKey);
            const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
                redirectTo: callbackUrl("/auth/reset-password"),
                captchaToken: formCaptchaToken ?? undefined,
            });
            if (error) {
                setErrorMessage(getAuthRequestErrorMessage(error, "We could not start password recovery. Please try again later."));
                return;
            }
            setEmail("");
            setEmailNotice("recovery");
        } catch {
            setErrorMessage("Authentication is temporarily unavailable. Please try again.");
        } finally {
            if (!isRedirecting) {
                if (usedCaptcha) {
                    setFormCaptchaToken(null);
                    formCaptchaRef.current?.reset();
                }
                setActiveSubmission(null);
            }
        }
    };

    const handleDemoSignIn = async () => {
        setErrorMessage("");
        setDemoErrorMessage("");
        if (captchaSiteKey && !demoCaptchaToken) {
            setDemoErrorMessage("Please complete the security check before continuing.");
            return;
        }
        setActiveSubmission("demo");
        let isRedirecting = false;
        try {
            const { error } = await createClient().auth.signInAnonymously({
                options: { captchaToken: demoCaptchaToken ?? undefined },
            });
            if (error) {
                setDemoErrorMessage(getAuthRequestErrorMessage(error, "Demo access is temporarily unavailable. Please try again later."));
                return;
            }
            window.location.assign(nextPath);
            isRedirecting = true;
        } catch {
            setDemoErrorMessage("Demo access is temporarily unavailable. Please try again later.");
        } finally {
            if (!isRedirecting) {
                if (captchaSiteKey) {
                    setDemoCaptchaToken(null);
                    demoCaptchaRef.current?.reset();
                }
                setActiveSubmission(null);
            }
        }
    };

    const title = mode === "sign-up" ? "Create your account" : mode === "reset" ? "Reset your password" : "Welcome back";
    const showDemoPanel = mode === "sign-in" && (!user || isSubmitting);

    if (emailNotice) {
        return (
            <section className="empty-state-enter mx-auto flex min-h-[45vh] w-full max-w-xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ca-orange/25 text-ca-black dark:text-ca-orange" aria-hidden="true">
                    <FaRegEnvelope className="h-7 w-7" />
                </div>
                <div role="status" aria-live="polite">
                    <h1 className="mt-6 text-3xl font-bold">Check your email</h1>
                    <p className="mt-4 leading-relaxed text-ca-black/70 dark:text-ca-grey">
                        {emailNotice === "demo"
                            ? "Check your email for a confirmation link to keep your demo order history. Keep your demo session on this device until your account is confirmed."
                            : emailNotice === "recovery"
                                ? "If an account matches that email, a password reset link will be sent. Check your inbox and spam folder."
                                : "Check your email for a confirmation link. If you already have an account, you can sign in instead."}
                    </p>
                </div>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                    >
                        Back to home
                    </Link>
                    {emailNotice !== "demo" && (
                        <button
                            type="button"
                            onClick={() => {
                                setMode("sign-in");
                                setEmailNotice(null);
                            }}
                            className="cursor-pointer rounded-md border border-current px-5 py-3 font-semibold transition-colors hover:bg-ca-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:hover:bg-white/10"
                        >
                            Sign in
                        </button>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section
            className={`mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 lg:gap-16 lg:px-10 ${
                showDemoPanel ? "lg:grid-cols-2" : ""
            }`}
        >
            {showDemoPanel && (
                <aside className="order-2 mx-auto w-full max-w-xl rounded-2xl border border-ca-grey/50 bg-ca-grey/10 p-6 text-center dark:border-white/20 dark:bg-white/5 sm:p-8 lg:order-1 lg:py-12">
                    <p className="text-sm font-semibold uppercase tracking-wide text-ca-orange">Explore the demo</p>
                    <h2 className="mt-3 text-2xl font-bold">Just looking around?</h2>
                    <p className="mx-auto mt-3 max-w-md text-ca-black/65 dark:text-white/65">
                        Try the store without an email. Your session and demo orders are isolated from other visitors.
                    </p>
                    {captchaSiteKey && (
                        <div className="flex justify-center text-left">
                            <AuthCaptcha siteKey={captchaSiteKey} widgetRef={demoCaptchaRef} onToken={setDemoCaptchaToken} token={demoCaptchaToken} className="pt-6" />
                        </div>
                    )}
                    {demoErrorMessage && <p role="alert" className="mt-3 text-sm font-semibold text-red-700 dark:text-red-300">{demoErrorMessage}</p>}
                    <button
                        type="button"
                        onClick={handleDemoSignIn}
                        disabled={isSubmitting}
                        className="mt-6 cursor-pointer rounded-md border border-ca-black px-5 py-3 font-semibold transition-colors hover:bg-ca-black hover:text-white disabled:cursor-wait disabled:opacity-60 dark:border-white dark:hover:bg-white dark:hover:text-ca-black"
                    >
                        {activeSubmission === "demo" ? "Please wait..." : "Try demo"}
                    </button>
                </aside>
            )}

            <div className={`mx-auto w-full max-w-md ${showDemoPanel ? "lg:col-start-2 lg:row-start-1" : "lg:col-span-2"}`}>
                <AuthMascot />
                <p className="mb-5 text-center text-xs text-ca-black/65 dark:text-white/65">
                    Demo orders are tied to your account; the cart stays in this browser.
                </p>
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="mt-2 text-sm text-ca-black/65 dark:text-white/65">
                    {user?.isAnonymous
                        ? "Create an account to keep your demo order history."
                        : "Sign in or create an account to view your orders."}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-ca-grey/50 p-5 dark:border-white/20">
                    <label className="block text-sm font-semibold" htmlFor="auth-email">
                        Email
                        <input
                            id="auth-email"
                            className={inputClassName}
                            type="email"
                            autoComplete="email"
                            required
                            maxLength={254}
                            disabled={isSubmitting}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </label>

                    {mode !== "reset" && (
                        <label className="block text-sm font-semibold" htmlFor="auth-password">
                            Password
                            <input
                                id="auth-password"
                                className={inputClassName}
                                type="password"
                                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                                data-auth-input="true"
                                required
                                minLength={mode === "sign-up" ? 12 : 1}
                                maxLength={72}
                                disabled={isSubmitting}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </label>
                    )}

                    {mode === "sign-up" && (
                        <label className="block text-sm font-semibold" htmlFor="auth-confirm-password">
                            Confirm password
                            <input
                                id="auth-confirm-password"
                                className={inputClassName}
                                type="password"
                                autoComplete="new-password"
                                data-auth-input="true"
                                required
                                minLength={12}
                                maxLength={72}
                                disabled={isSubmitting}
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                            />
                        </label>
                    )}

                    {mode === "sign-in" && (
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                                setMode("reset");
                                setFormCaptchaToken(null);
                                setErrorMessage("");
                            }}
                            className="cursor-pointer text-sm font-semibold underline underline-offset-2 hover:text-ca-orange"
                        >
                            Forgot password?
                        </button>
                    )}

                    {captchaSiteKey && requiresFormCaptcha && (
                        <AuthCaptcha key={mode} siteKey={captchaSiteKey} widgetRef={formCaptchaRef} onToken={setFormCaptchaToken} token={formCaptchaToken} />
                    )}
                    {errorMessage && <p role="alert" className="text-sm font-semibold text-red-700 dark:text-red-300">{errorMessage}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full cursor-pointer rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                    >
                        {activeSubmission === "form" ? "Please wait..." : mode === "sign-in" ? "Sign in" : mode === "sign-up" ? "Create account" : "Send reset link"}
                    </button>

                    {mode !== "reset" && (
                        <p className="text-center text-sm">
                            {mode === "sign-in" ? "New here?" : "Already have an account?"}{" "}
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => {
                                    setMode(mode === "sign-in" ? "sign-up" : "sign-in");
                                    setFormCaptchaToken(null);
                                    setErrorMessage("");
                                }}
                                className="cursor-pointer font-semibold underline underline-offset-2 hover:text-ca-orange"
                            >
                                {mode === "sign-in" ? "Create an account" : "Sign in"}
                            </button>
                        </p>
                    )}

                    {mode === "reset" && (
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                                setMode("sign-in");
                                setFormCaptchaToken(null);
                                setErrorMessage("");
                            }}
                            className="block w-full text-center text-sm font-semibold underline underline-offset-2 hover:text-ca-orange"
                        >
                            Back to sign in
                        </button>
                    )}
                </form>

                <Link href="/" className="mt-5 inline-flex text-sm font-semibold underline underline-offset-2 hover:text-ca-orange">
                    Continue shopping
                </Link>
            </div>
        </section>
    );
};

export default AuthExperience;

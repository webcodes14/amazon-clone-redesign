"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

const fieldClassName =
    "mt-2 w-full rounded-md border border-ca-grey bg-white px-3 py-2.5 text-ca-black outline-none transition-colors placeholder:text-ca-black/45 focus:border-ca-orange focus:ring-2 focus:ring-ca-orange/40 dark:border-white/20 dark:bg-ca-black dark:text-white dark:placeholder:text-white/45";

const ContactPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState("");
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!submitted) return;

        const timeoutId = window.setTimeout(() => setSubmitted(false), 4500);

        return () => window.clearTimeout(timeoutId);
    }, [submitted]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const honeypot = formData.get("website");
        if (typeof honeypot !== "string" || honeypot.trim()) return;

        const name = formData.get("name");
        const email = formData.get("email");
        const topic = formData.get("topic");
        const message = formData.get("message");
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof topic !== "string" ||
            typeof message !== "string" ||
            name.trim().length === 0 ||
            name.length > 100 ||
            email.trim().length === 0 ||
            email.length > 254 ||
            !["general", "order", "product", "feedback"].includes(topic) ||
            message.trim().length === 0 ||
            message.length > 2000
        ) {
            setFormError("Please check the form fields and try again.");
            return;
        }

        setFormError("");
        setSubmitted(true);
    };

    return (
        <section className="empty-state-enter w-full px-4 py-8 sm:px-6 lg:pr-8 min-[992px]:-ml-16 min-[992px]:w-[calc(100%+4rem)] min-[992px]:pl-16 lg:pl-24">
            <h1 className="text-3xl font-bold">Contact us</h1>
            <p className="mt-3 text-ca-black/70 dark:text-white/70">
                Have a question about this storefront demo? Use the form to preview the contact experience.
            </p>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    onChange={() => {
                        setSubmitted(false);
                        setFormError("");
                    }}
                    className="space-y-5 rounded-xl border border-ca-grey/50 p-5 sm:p-6 dark:border-white/20"
                >
                    <div
                        aria-hidden="true"
                        className="absolute -left-[10000px] size-px overflow-hidden"
                    >
                        <label htmlFor="contact-website">Leave this field empty</label>
                        <input
                            id="contact-website"
                            name="website"
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                        />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block text-sm font-semibold" htmlFor="contact-name">
                            Name
                            <input
                                className={fieldClassName}
                                id="contact-name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Your name"
                                maxLength={100}
                                required
                            />
                        </label>
                        <label className="block text-sm font-semibold" htmlFor="contact-email">
                            Email
                            <input
                                className={fieldClassName}
                                id="contact-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                maxLength={254}
                                required
                            />
                        </label>
                    </div>

                    <label className="block text-sm font-semibold" htmlFor="contact-topic">
                        Topic
                        <select className={fieldClassName} id="contact-topic" name="topic" defaultValue="general">
                            <option value="general">General question</option>
                            <option value="order">Order or checkout</option>
                            <option value="product">Product information</option>
                            <option value="feedback">Website feedback</option>
                        </select>
                    </label>

                    <label className="block text-sm font-semibold" htmlFor="contact-message">
                        Message
                        <textarea
                            className={`${fieldClassName} min-h-36 resize-y`}
                            id="contact-message"
                            name="message"
                            placeholder="How can we help?"
                            maxLength={2000}
                            required
                        />
                    </label>

                    <p id="contact-demo-note" className="text-sm text-ca-black/65 dark:text-white/65">
                        Demo only: this form does not send or store your message.
                    </p>
                    <button
                        type="button"
                        onClick={() => formRef.current?.requestSubmit()}
                        aria-describedby="contact-demo-note"
                        className="inline-flex cursor-pointer items-center justify-center rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                    >
                        Preview submission
                    </button>
                    {submitted && (
                        <p
                            className="text-sm font-medium text-emerald-700 dark:text-emerald-300"
                            role="status"
                            aria-live="polite"
                        >
                            Your message was not sent or stored. This form is not connected to a support inbox.
                        </p>
                    )}
                    {formError && <p className="text-sm font-semibold text-red-700 dark:text-red-300" role="alert">{formError}</p>}
                </form>

                <aside className="h-fit rounded-xl bg-ca-grey/30 p-5 dark:bg-white/5">
                    <h2 className="text-lg font-bold">Before you reach out</h2>
                    <p className="mt-2 text-sm leading-6 text-ca-black/70 dark:text-white/70">
                        This is a portfolio demo. Checkout does not place real orders, and there is no support inbox connected.
                    </p>
                    <p className="mt-4 text-sm leading-6 text-ca-black/70 dark:text-white/70">
                        For details about the shopping experience, see the FAQ.
                    </p>
                    <Link
                        href="/faq"
                        className="mt-3 inline-flex font-semibold underline underline-offset-2 hover:text-ca-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                    >
                        Browse FAQs
                    </Link>
                </aside>
            </div>
        </section>
    );
};

export default ContactPage;

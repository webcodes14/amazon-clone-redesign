import Link from "next/link";

const faqItems = [
    {
        question: "How is shipping calculated?",
        answer: "Shipping costs $4.99 for orders under $50. Orders of $50 or more qualify for free shipping.",
    },
    {
        question: "Will checkout place a real order?",
        answer: "No. Checkout is a demo preview only. It does not collect payment or submit an order.",
    },
    {
        question: "Will my cart and wishlist be saved?",
        answer: "Your cart and wishlist are saved in this browser, so they remain available after you refresh the page.",
    },
    {
        question: "How do product discounts work?",
        answer: "Discounted prices are calculated from each product's listed price and discount. The cart and order summary use the discounted price.",
    },
    {
        question: "What do the notification messages mean?",
        answer: "Notifications summarize current offers, discounts or stock information for products in your cart and wishlist, and your progress toward free shipping. You can mark them as read in the notification menu.",
    },
];

const FaqPage = () => (
    <section className="empty-state-enter w-full px-4 py-8 sm:px-6 lg:pr-8 min-[992px]:-ml-16 min-[992px]:w-[calc(100%+4rem)] min-[992px]:pl-16 lg:pl-24">
        <h1 className="text-3xl font-bold">Frequently asked questions</h1>
        <p className="mt-3 text-ca-black/70 dark:text-white/70">
            Quick answers about shopping on Stock Pulse.
        </p>

        <div className="mt-8 divide-y divide-ca-grey/50 rounded-xl border border-ca-grey/50 px-5 dark:divide-white/10 dark:border-white/20">
            {faqItems.map(({ question, answer }) => (
                <details key={question} className="group py-4">
                    <summary className="cursor-pointer list-none pr-6 font-semibold marker:hidden focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ca-orange [&::-webkit-details-marker]:hidden">
                        <span className="flex items-center justify-between gap-4">
                            {question}
                            <span
                                aria-hidden="true"
                                className="text-xl text-ca-black/60 transition-transform group-open:rotate-45 dark:text-white/60"
                            >
                                +
                            </span>
                        </span>
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-ca-black/70 dark:text-white/70">
                        {answer}
                    </p>
                </details>
            ))}
        </div>

        <p className="mt-8 text-sm text-ca-black/70 dark:text-white/70">
            Need more help?{" "}
            <Link
                href="/contact"
                className="font-semibold underline underline-offset-2 hover:text-ca-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
            >
                Contact us
            </Link>
            .
        </p>
    </section>
);

export default FaqPage;

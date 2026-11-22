import Link from "next/link";

const topics = [
    {
        title: "Shipping & checkout",
        description: "See the demo shipping threshold and learn what happens at checkout.",
        href: "/faq",
        linkLabel: "Shipping and checkout FAQs",
    },
    {
        title: "Cart & wishlist",
        description: "Find out how your saved cart and wishlist behave in this browser.",
        href: "/faq",
        linkLabel: "About saved items",
    },
    {
        title: "Products & discounts",
        description: "Learn how displayed discounts and product notifications work.",
        href: "/faq",
        linkLabel: "About products and discounts",
    },
];

const SupportPage = () => (
    <section className="empty-state-enter w-full px-4 py-8 sm:px-6 lg:pr-8 min-[992px]:-ml-16 min-[992px]:w-[calc(100%+4rem)] min-[992px]:pl-16 lg:pl-24">
        <h1 className="text-3xl font-bold">How can we help?</h1>
        <p className="mt-3 text-ca-black/70 dark:text-white/70">
            Browse common topics or visit the FAQ for more details about this storefront demo.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {topics.map(({ title, description, href, linkLabel }) => (
                <article
                    key={title}
                    className="flex h-full flex-col rounded-xl border border-ca-grey/50 p-5 dark:border-white/20"
                >
                    <h2 className="text-lg font-bold">{title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-ca-black/70 dark:text-white/70">
                        {description}
                    </p>
                    <Link
                        href={href}
                        className="mt-5 inline-flex w-fit font-semibold underline underline-offset-2 hover:text-ca-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
                    >
                        {linkLabel}
                    </Link>
                </article>
            ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-ca-grey/30 p-5 dark:bg-white/5">
            <p className="text-sm text-ca-black/70 dark:text-white/70">
                Still have a question? The contact form is a visual demo and does not send messages.
            </p>
            <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange"
            >
                Open contact form
            </Link>
        </div>
    </section>
);

export default SupportPage;

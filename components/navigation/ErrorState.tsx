import type { ReactNode } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export const errorPrimaryAction = "inline-flex min-h-11 items-center justify-center rounded-md bg-ca-orange px-5 py-3 font-semibold text-ca-black transition-colors hover:bg-ca-orange/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange";
export const errorSecondaryAction = "inline-flex min-h-11 items-center justify-center rounded-md border border-current px-5 py-3 font-semibold transition-colors hover:bg-ca-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:hover:bg-white/10";

export default function ErrorState({
    label,
    title,
    description,
    children,
}: {
    label: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section className="empty-state-enter mx-auto flex min-h-[45vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ca-orange/25 text-ca-black dark:text-ca-orange" aria-hidden="true">
                <FaExclamationTriangle className="h-7 w-7" />
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-ca-black/60 dark:text-ca-grey">{label}</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
            <p className="mt-4 max-w-md leading-relaxed text-ca-black/70 dark:text-ca-grey">{description}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>
        </section>
    );
}

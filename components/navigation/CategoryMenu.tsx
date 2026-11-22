"use client";

import { useEffect, useRef, useState } from "react";
import { HiSquares2X2, HiXMark } from "react-icons/hi2";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types";
import formatCategoryName from "@/components/home/formatCategoryName";
import getCategoryIcon from "./categoryIcons";

interface CategoryMenuProps {
    categories: Category[];
}

const CategoryMenu = ({ categories }: CategoryMenuProps) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
                return;
            }

            if (event.key === "Tab" && panelRef.current) {
                const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (!firstElement) {
                    event.preventDefault();
                    panelRef.current.focus();
                } else if (event.shiftKey && (document.activeElement === firstElement || !panelRef.current.contains(document.activeElement))) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && (document.activeElement === lastElement || !panelRef.current.contains(document.activeElement))) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className="pointer-events-auto relative m-4 w-fit">
            <button
                ref={triggerRef}
                type="button"
                aria-label="Open categories"
                aria-expanded={isOpen}
                aria-controls="category-menu"
                onClick={() => setIsOpen((open) => !open)}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ca-orange text-xl text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black dark:focus-visible:outline-white"
            >
                <HiSquares2X2 aria-hidden="true" />
            </button>
            <button
                type="button"
                tabIndex={isOpen ? 0 : -1}
                aria-label="Close categories"
                aria-hidden={!isOpen}
                onClick={() => {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                }}
                className={`pointer-events-auto fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />
            <div
                ref={panelRef}
                id="category-menu"
                role="dialog"
                aria-modal="true"
                aria-labelledby="category-menu-title"
                aria-hidden={!isOpen}
                inert={!isOpen}
                tabIndex={-1}
                className={`pointer-events-auto fixed inset-y-0 left-0 z-[60] flex w-96 max-w-[90vw] flex-col border-r border-ca-grey bg-white text-ca-black shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none dark:border-white/20 dark:bg-ca-black dark:text-white ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-ca-grey/30 px-5 py-4 dark:border-white/10">
                    <h2 id="category-menu-title" className="text-lg font-semibold tracking-wide">
                        Categories
                    </h2>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Close categories"
                        onClick={() => {
                            setIsOpen(false);
                            triggerRef.current?.focus();
                        }}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-xl transition-colors hover:bg-ca-grey/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange dark:hover:bg-white/5"
                    >
                        <HiXMark aria-hidden="true" />
                    </button>
                </div>
                <nav aria-label="Product categories" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                    <ul className="space-y-1">
                        <li className="mb-2 border-b border-ca-grey/30 pb-2 dark:border-white/10">
                            <Link
                                href="/all-products"
                                aria-current={pathname === "/all-products" ? "page" : undefined}
                                onClick={() => {
                                    setIsOpen(false);
                                    triggerRef.current?.focus();
                                }}
                                className={`flex items-center gap-3 rounded-md px-3 py-3 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange ${
                                    pathname === "/all-products"
                                        ? "bg-ca-black text-white hover:bg-ca-black/90 dark:bg-ca-grey dark:text-ca-black dark:hover:bg-ca-grey/90"
                                        : "hover:bg-ca-grey/10 dark:hover:bg-white/5"
                                }`}
                            >
                                All products
                            </Link>
                        </li>
                        {categories.map((category) => {
                            const Icon = getCategoryIcon(category);
                            const isActive = pathname === `/${encodeURIComponent(category)}`;
                            return (
                                <li key={category}>
                                    <Link
                                        href={`/${encodeURIComponent(category)}`}
                                        aria-current={isActive ? "page" : undefined}
                                        onClick={() => {
                                            setIsOpen(false);
                                            triggerRef.current?.focus();
                                        }}
                                        className={`flex items-center gap-3 rounded-md px-3 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange ${
                                            isActive
                                                ? "bg-ca-black text-white hover:bg-ca-black/90 dark:bg-ca-grey dark:text-ca-black dark:hover:bg-ca-grey/90"
                                                : "hover:bg-ca-grey/10 dark:hover:bg-white/5"
                                        }`}
                                    >
                                        {Icon && <Icon aria-hidden="true" className="shrink-0" />}
                                        <span>{formatCategoryName(category)}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default CategoryMenu;
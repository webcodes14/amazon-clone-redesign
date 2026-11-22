"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

interface NavigationDropdownProps {
    name: string;
    isOpen: boolean;
    children: ReactNode;
}

const NavigationDropdown = ({ name, isOpen, children }: NavigationDropdownProps) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const panel = panelRef.current;
        const content = contentRef.current;
        if (!panel || !content) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        panel.style.overflowY = "hidden";

        const animate = () => {
            gsap.to(panel, {
                height: isOpen ? content.offsetHeight : 0,
                autoAlpha: isOpen ? 1 : 0,
                duration: reducedMotion.matches ? 0 : 0.3,
                ease: "power2.out",
                overwrite: true,
                onComplete: () => {
                    if (isOpen) panel.style.overflowY = "auto";
                },
            });
        };

        animate();
        const observer = isOpen ? new ResizeObserver(animate) : null;
        observer?.observe(content);
        reducedMotion.addEventListener("change", animate);

        return () => {
            observer?.disconnect();
            reducedMotion.removeEventListener("change", animate);
            gsap.killTweensOf(panel);
        };
    }, [isOpen]);

    return (
        <div
            ref={panelRef}
            id={`${name.toLowerCase()}-dropdown`}
            data-dropdown-panel={name}
            aria-hidden={!isOpen}
            inert={!isOpen}
            className={`invisible absolute bottom-full z-50 mb-3 h-0 max-h-[calc(100dvh-7rem)] w-80 max-w-[calc(100vw-2rem)] overflow-x-hidden rounded-xl opacity-0 shadow-xl md:bottom-auto md:top-full md:mb-0 md:mt-3 md:max-h-[calc(100dvh-6rem)] ${
                isOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
        >
            <div ref={contentRef}>{children}</div>
        </div>
    );
};

export default NavigationDropdown;

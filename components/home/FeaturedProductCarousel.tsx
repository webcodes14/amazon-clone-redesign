"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShoppingBenefitsSection from "@/components/home/ShoppingBenefitsSection";
import TopRatedCategoriesSection from "@/components/home/TopRatedCategoriesSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import type { FeaturedProduct } from "@/components/home/types";

export type { FeaturedProduct } from "@/components/home/types";

interface FeaturedProductCarouselProps {
    products: FeaturedProduct[];
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FeaturedProductCarousel = ({ products }: FeaturedProductCarouselProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const isChangingProductRef = useRef(false);
    const productCategories = products.slice(0, 6);

    const { contextSafe } = useGSAP(
        () => {
            const media = gsap.matchMedia();

            media.add(
                "(min-width: 992px) and (prefers-reduced-motion: no-preference)",
                () => {
                    const section = sectionRef.current;
                    const viewport = viewportRef.current;
                    const track = trackRef.current;

                    if (!section || !viewport || !track) {
                        return;
                    }

                    const getScrollDistance = () =>
                        Math.max(track.scrollWidth - viewport.clientWidth, 0);

                    const tween = gsap.to(track, {
                        x: () => -getScrollDistance(),
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top top+=64",
                            end: () => `+=${getScrollDistance()}`,
                            pin: section,
                            pinSpacing: true,
                            scrub: 1,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    const panels = gsap.utils.toArray<HTMLElement>("[data-home-panel]", track);

                    panels.forEach((panel, index) => {
                        if (index === 0) {
                            return;
                        }

                        const headings = gsap.utils.toArray<HTMLElement>(
                            "[data-reveal-heading]",
                            panel
                        );
                        const items = gsap.utils.toArray<HTMLElement>(
                            "[data-reveal-item]",
                            panel
                        );
                        if (headings.length > 0) {
                            gsap.from(headings, {
                                x: -88,
                                rotation: -3.5,
                                transformOrigin: "left center",
                                autoAlpha: 0,
                                filter: "blur(10px)",
                                duration: 0.75,
                                ease: "power3.out",
                                scrollTrigger: {
                                    trigger: panel,
                                    containerAnimation: tween,
                                    start: "left 82%",
                                    end: "left 48%",
                                    scrub: 0.6,
                                },
                            });
                        }

                        if (items.length > 0) {
                            gsap.from(items, {
                                y: 36,
                                autoAlpha: 0,
                                ...(panel.hasAttribute("data-no-item-blur") ? {} : { filter: "blur(8px)" }),
                                stagger: 0.09,
                                duration: 0.75,
                                ease: "power2.out",
                                scrollTrigger: {
                                    trigger: panel,
                                    containerAnimation: tween,
                                    start: "left 78%",
                                    end: "left 38%",
                                    scrub: 0.8,
                                },
                            });
                        }
                    });

                    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

                    return () => {
                        window.cancelAnimationFrame(refreshFrame);
                        tween.scrollTrigger?.kill();
                        tween.kill();
                    };
                }
            );

            media.add(
                "(max-width: 991px) and (prefers-reduced-motion: no-preference)",
                () => {
                    if (!trackRef.current) {
                        return;
                    }

                    const panels = gsap.utils.toArray<HTMLElement>(
                        "[data-home-panel]",
                        trackRef.current
                    );

                    panels.forEach((panel, index) => {
                        if (index === 0) {
                            return;
                        }

                        const headings = gsap.utils.toArray<HTMLElement>(
                            "[data-reveal-heading]",
                            panel
                        );
                        const items = gsap.utils.toArray<HTMLElement>(
                            "[data-reveal-item]",
                            panel
                        );
                        const scrollTrigger = {
                            trigger: panel,
                            start: "top 82%",
                            toggleActions: "play none none reverse",
                        };

                        if (headings.length > 0) {
                            gsap.from(headings, {
                                x: -72,
                                rotation: -3.5,
                                transformOrigin: "left center",
                                autoAlpha: 0,
                                filter: "blur(8px)",
                                duration: 0.7,
                                ease: "power3.out",
                                scrollTrigger,
                            });
                        }

                        if (items.length > 0) {
                            gsap.from(items, {
                                y: 32,
                                autoAlpha: 0,
                                ...(panel.hasAttribute("data-no-item-blur") ? {} : { filter: "blur(8px)" }),
                                stagger: 0.08,
                                duration: 0.7,
                                ease: "power2.out",
                                scrollTrigger,
                            });
                        }
                    });
                }
            );

            return () => media.revert();
        },
        { scope: sectionRef, dependencies: [products.length], revertOnUpdate: true }
    );

    const handleNextProduct = () => {
        contextSafe(() => {
            if (products.length < 2 || isChangingProductRef.current) {
                return;
            }

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                setActiveIndex((index) => (index + 1) % products.length);
                return;
            }

            const image = sectionRef.current?.querySelector<HTMLElement>(
                "[data-reveal-image]"
            );
            const cover = sectionRef.current?.querySelector<HTMLElement>(
                "[data-reveal-image-cover]"
            );

            if (!image || !cover) {
                setActiveIndex((index) => (index + 1) % products.length);
                return;
            }

            isChangingProductRef.current = true;
            const transition = gsap.timeline({
                onComplete: () => {
                    gsap.set(cover, {
                        autoAlpha: 0,
                        scaleX: 1,
                        clearProps: "transformOrigin",
                    });
                    isChangingProductRef.current = false;
                },
            });

            transition
                .set(cover, { autoAlpha: 1, scaleX: 0, transformOrigin: "left center" })
                .to(cover, { scaleX: 1, duration: 0.35, ease: "power2.inOut" })
                .call(() => setActiveIndex((index) => (index + 1) % products.length))
                .set(image, { scale: 1.08 })
                .to(
                    cover,
                    {
                        scaleX: 0,
                        transformOrigin: "right center",
                        duration: 0.4,
                        ease: "power3.inOut",
                    },
                    "+=0.1"
                )
                .to(image, { scale: 1, duration: 0.65, ease: "power2.out" }, "<");
        })();
    };

    return (
        <div
            ref={sectionRef}
            className="relative w-full min-[992px]:motion-safe:-ml-16 min-[992px]:motion-safe:w-[calc(100%+4rem)]"
        >
            <div
                ref={viewportRef}
                className="relative w-full min-[992px]:motion-safe:h-[calc(100vh_-_8rem)] min-[992px]:motion-safe:overflow-x-clip"
            >
                <div
                    ref={trackRef}
                    className="flex w-full flex-col min-[992px]:motion-safe:h-full min-[992px]:motion-safe:flex-row"
                >
                    <WelcomeSection
                        product={products[activeIndex]}
                        popularCategories={productCategories}
                        showNextProduct={products.length > 1}
                        onNextProduct={handleNextProduct}
                    />
                    <TopRatedCategoriesSection products={productCategories} />
                    <ShoppingBenefitsSection popularCategories={productCategories} />
                </div>
            </div>
        </div>
    );
};

export default FeaturedProductCarousel;

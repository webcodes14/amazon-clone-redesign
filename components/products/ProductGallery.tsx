"use client";

import Image from "next/image";
import { useState, type PointerEvent } from "react";

interface ProductGalleryProps {
    title: string;
    thumbnail: string;
    images?: string[] | null;
}

const ProductGallery = ({ title, thumbnail, images }: ProductGalleryProps) => {
    const galleryImages = Array.from(
        new Set((Array.isArray(images) ? images : []).filter((image) => typeof image === "string" && image.length > 0))
    );
    const galleryItems = galleryImages.length > 0
        ? [
              { image: galleryImages[0], thumbnail: thumbnail || galleryImages[0] },
              ...galleryImages.slice(1).map((image) => ({ image, thumbnail: image })),
          ]
        : [{ image: thumbnail, thumbnail }];
    const [activeImage, setActiveImage] = useState(galleryItems[0].image);
    const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(
        null
    );
    const lensSize = 144;
    const zoomScale = 2.25;

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "touch") return;

        const bounds = event.currentTarget.getBoundingClientRect();
        const x = Math.min(Math.max(event.clientX - bounds.left, lensSize / 2), bounds.width - lensSize / 2);
        const y = Math.min(Math.max(event.clientY - bounds.top, lensSize / 2), bounds.height - lensSize / 2);

        setZoomPosition({ x, y, width: bounds.width, height: bounds.height });
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[4.5rem_minmax(0,1fr)]">
            <div
                onPointerMove={handlePointerMove}
                onPointerLeave={() => setZoomPosition(null)}
                className="relative order-1 aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-[#373737] md:order-2 md:cursor-crosshair"
            >
                <Image
                    src={activeImage}
                    alt={title}
                    fill
                    unoptimized
                    sizes="(max-width: 1023px) 100vw, 55vw"
                    className="object-contain p-6 sm:p-10"
                    priority
                />
                {zoomPosition && (
                    <div
                        aria-hidden="true"
                        data-product-zoom-lens
                        className="pointer-events-none absolute z-10 rounded-md bg-white/10 shadow-2xl ring-2 ring-white/90"
                        style={{
                            left: zoomPosition.x - lensSize / 2,
                            top: zoomPosition.y - lensSize / 2,
                            width: lensSize,
                            height: lensSize,
                            backgroundImage: `url("${activeImage}")`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: `${zoomPosition.width * zoomScale}px ${zoomPosition.height * zoomScale}px`,
                            backgroundPosition: `${lensSize / 2 - zoomPosition.x * zoomScale}px ${lensSize / 2 - zoomPosition.y * zoomScale}px`,
                        }}
                    />
                )}
            </div>
            <div
                role="group"
                aria-label="Product images"
                className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-x-visible"
            >
                {galleryItems.map(({ image, thumbnail: preview }, index) => {
                    const isActive = image === activeImage;

                    return (
                        <button
                            key={image}
                            type="button"
                            aria-label={`Show image ${index + 1} of ${galleryItems.length}`}
                            aria-pressed={isActive}
                            onMouseEnter={() => setActiveImage(image)}
                            onFocus={() => setActiveImage(image)}
                            onClick={() => setActiveImage(image)}
                            className={`relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-lg p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange sm:size-20 ${
                                isActive
                                    ? "bg-ca-orange/25"
                                    : "bg-gray-100 hover:bg-gray-200 dark:bg-[#373737] dark:hover:bg-[#4a4a4a]"
                            }`}
                        >
                            <Image
                                src={preview}
                                alt=""
                                fill
                                unoptimized
                                sizes="80px"
                                className="object-contain p-1"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductGallery;

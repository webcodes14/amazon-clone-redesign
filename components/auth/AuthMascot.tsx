"use client";

import { useEffect, useRef, useState } from "react";

interface Gaze {
    x: number;
    y: number;
    covered: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const AuthMascot = () => {
    const faceRef = useRef<HTMLDivElement>(null);
    const [gaze, setGaze] = useState<Gaze>({ x: 0, y: 0, covered: false });

    useEffect(() => {
        const face = faceRef.current;
        if (!face) return;

        const updateGaze = (x: number, y: number, covered = false) => {
            const bounds = face.getBoundingClientRect();
            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height / 2;
            setGaze({
                x: clamp((x - centerX) / 22, -4, 4),
                y: clamp((y - centerY) / 22, -3, 3),
                covered,
            });
        };

        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            const active = document.activeElement;
            if (active instanceof HTMLInputElement && active.type === "password") {
                const bounds = active.getBoundingClientRect();
                updateGaze(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, true);
                return;
            }
            updateGaze(event.clientX, event.clientY);
        };

        const onFocusChange = () => {
            const active = document.activeElement;
            if (active instanceof HTMLInputElement && active.type === "password") {
                const bounds = active.getBoundingClientRect();
                updateGaze(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, true);
                return;
            }

            setGaze((previous) => ({ ...previous, covered: false }));
        };

        window.addEventListener("pointermove", onPointerMove);
        document.addEventListener("focusin", onFocusChange);
        document.addEventListener("click", onFocusChange);

        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("focusin", onFocusChange);
            document.removeEventListener("click", onFocusChange);
        };
    }, []);

    return (
        <div ref={faceRef} aria-hidden="true" className="relative mx-auto aspect-square w-40 sm:w-48">
            <div className="absolute inset-2 rounded-full bg-ca-orange/20 blur-2xl" />
            <svg viewBox="0 0 200 200" className="relative h-full w-full drop-shadow-xl">
                <path d="M38 200c8-32 31-49 62-49s54 17 62 49" fill="#4a8f81" />
                <path d="M37 88c0-42 26-67 63-67s63 25 63 67v29H37V88Z" fill="#242423" />
                <ellipse cx="100" cy="111" rx="62" ry="70" fill="#f3c79c" />
                <path d="M41 88c5-39 26-59 59-59 31 0 52 20 59 59-15-13-34-20-59-20-24 0-44 7-59 20Z" fill="#242423" />
                <g fill="#fff">
                    <ellipse cx="77" cy="108" rx="15" ry="19" />
                    <ellipse cx="123" cy="108" rx="15" ry="19" />
                </g>
                {!gaze.covered && (
                    <g
                        fill="#242423"
                        transform={`translate(${gaze.x} ${gaze.y})`}
                        className="transition-transform duration-100 ease-out motion-reduce:transition-none"
                    >
                        <circle cx="77" cy="108" r="7" />
                        <circle cx="123" cy="108" r="7" />
                    </g>
                )}
                <path d="M83 146c10 9 24 9 34 0" fill="none" stroke="#9b4e45" strokeLinecap="round" strokeWidth="4" />
                {gaze.covered && (
                    <g>
                        <path d="M65 176c-9-17-10-37 5-58" fill="none" stroke="#4a8f81" strokeLinecap="round" strokeWidth="13" />
                        <path d="M135 176c9-17 10-37-5-58" fill="none" stroke="#4a8f81" strokeLinecap="round" strokeWidth="13" />
                        <path
                            d="M58 111v-2c0-3 2-5 5-5h2V94c0-4 6-4 6 0v10V91c0-4 6-4 6 0v13V93c0-4 6-4 6 0v12V97c0-4 6-4 6 0v13c0 8-6 13-14 13h-1c-8 0-16-5-16-12Z"
                            fill="#f3c79c"
                            stroke="#9b4e45"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M58 111v-2c0-3 2-5 5-5h2V94c0-4 6-4 6 0v10V91c0-4 6-4 6 0v13V93c0-4 6-4 6 0v12V97c0-4 6-4 6 0v13c0 8-6 13-14 13h-1c-8 0-16-5-16-12Z"
                            transform="translate(200 0) scale(-1 1)"
                            fill="#f3c79c"
                            stroke="#9b4e45"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                    </g>
                )}
            </svg>
        </div>
    );
};

export default AuthMascot;

'use client'

import { useTheme } from "@/context/theme-provider";
import gsap from "gsap"; 
import { useEffect, useRef } from "react";

const ThemeBtn = () => {
    const { theme, toggleTheme } = useTheme();
    const btnRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if ( isFirstRender.current ) {
            gsap.set(btnRef.current, {
                x: theme === 'dark' ? 24 : 0
            })
            isFirstRender.current = false;
        } else {
            gsap.to(btnRef.current, {
                x: theme === 'dark' ? 24 : 0, 
                duration: 0.3,
                ease: "power2.out"
            });
        }
        
    }, [ theme ]);

    return (
        <button
            onClick={toggleTheme}
            type="button"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="theme__btn w-12 h-6 border-2 border-ca-grey rounded-xl cursor-pointer"
        >
            <span
                ref={btnRef}
                style={{ position: 'relative' }}
                className="bg-ca-grey rounded-[50%] block w-4 h-4 m-0.5"
            ></span>
        </button>
    )
}

export default ThemeBtn;
'use client'

import gsap from "gsap";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ 
        children,
        initialTheme 
    }: { 
        children: React.ReactNode,
        initialTheme: string
    }) => {

    const [ theme, setTheme ] = useState(initialTheme);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        Cookies.set('project-theme', newTheme);
    }

    useEffect(() => {
        if ( theme === 'dark' ) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [ theme ]);

    const themeValue = {
        theme,
        toggleTheme
    }

    return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    console.log(context)

    if ( !context ) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
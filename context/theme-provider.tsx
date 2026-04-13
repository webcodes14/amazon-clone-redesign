'use client'

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [ theme, setTheme ] = useState<'light' | 'dark'>('light');
    const [ mounted, setMounted ] = useState(false);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('project-theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('project-theme') as 'light' | 'dark' | null;

        if ( savedTheme === 'dark' ) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }

        const timeout = setTimeout(() => {
            setMounted(true);
        }, 10);
        return () => clearTimeout(timeout);
    }, []);

    if ( !mounted ) {
        return <div style={{ visibility: 'hidden' }}>{children}</div>;
    }

    const themeValue = {
        theme,
        toggleTheme
    }

    return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if ( context === undefined ) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
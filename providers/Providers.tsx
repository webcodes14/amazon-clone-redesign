'use client'

import { ThemeProvider } from "@/context/theme-provider";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export const Providers = ({ 
        children, 
        initialTheme
    }: { 
        children: React.ReactNode,
        initialTheme: string
    }) => {

    return (
        <Provider store={store}>
            <ThemeProvider initialTheme={initialTheme}>
                {children}
            </ThemeProvider>
        </Provider>
    )
}
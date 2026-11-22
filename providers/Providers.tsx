'use client'

import { ThemeProvider } from "@/context/theme-provider";
import CartPersistence from "@/components/cart/CartPersistence";
import WishlistPersistence from "@/components/cart/WishlistPersistence";
import NotificationsPersistence from "@/components/navigation/NotificationsPersistence";
import { Provider } from "react-redux";
import { useState } from "react";
import { makeStore } from "@/redux/store";
import { AuthProvider, type AuthUser } from "./AuthProvider";

export const Providers = ({ 
        children, 
            initialTheme,
            initialUser,
    }: { 
        children: React.ReactNode,
            initialTheme: string,
            initialUser: AuthUser | null,
    }) => {
    const [{ store, serverState }] = useState(() => {
        const store = makeStore();
        return { store, serverState: store.getState() };
    });

    return (
        <Provider store={store} serverState={serverState}>
            <CartPersistence />
            <WishlistPersistence />
            <NotificationsPersistence />
            <AuthProvider initialUser={initialUser}>
                <ThemeProvider initialTheme={initialTheme}>
                    {children}
                </ThemeProvider>
            </AuthProvider>
        </Provider>
    )
}
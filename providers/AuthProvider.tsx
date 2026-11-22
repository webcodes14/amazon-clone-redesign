"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

export interface AuthUser {
    id: string;
    email: string | null;
    isAnonymous: boolean;
}

interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const toAuthUser = (user: User | null): AuthUser | null => user
    ? {
        id: user.id,
        email: user.email ?? null,
        isAnonymous: user.is_anonymous === true,
    }
    : null;

export function AuthProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser: AuthUser | null;
}) {
    const [user, setUser] = useState(initialUser);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
            setUser(toAuthUser(session?.user ?? null));
            setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const value = useMemo(() => ({ user, isLoading }), [isLoading, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider.");
    }
    return context;
}

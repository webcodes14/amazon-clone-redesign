"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

interface DropdownProfileProps {
    onClick: () => void;
}

const DropdownProfile = ({ onClick }: DropdownProfileProps) => {
    const router = useRouter();
    const { user } = useAuth();
    const [signOutError, setSignOutError] = useState("");

    const handleSignOut = async () => {
        setSignOutError("");
        try {
            const { error } = await createClient().auth.signOut({ scope: "local" });
            if (error) {
                setSignOutError("Could not sign out. Please try again.");
                return;
            }
        } catch {
            setSignOutError("Could not sign out. Please try again.");
            return;
        }
        onClick();
        router.replace("/");
        router.refresh();
    };

    return (
        <div className="rounded-xl border border-ca-grey bg-white p-4 text-ca-black dark:border-white/20 dark:bg-ca-black dark:text-white">
            <h4 className="font-bold text-sm tracking-wide">Profile</h4>

            {user ? (
                <>
                    <p className="mt-3 truncate px-3 text-xs text-ca-black/65 dark:text-white/65">
                        {user.isAnonymous ? "Private demo account" : user.email}
                    </p>
                    <ul className="mt-2 space-y-1">
                        <li className="dropdown-item group">
                            <Link
                                className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm transition-all duration-200 hover:border-ca-grey dark:hover:border-white/30 hover:bg-ca-grey/10 dark:hover:bg-white/5"
                                onClick={onClick}
                                href="/account"
                            >
                                <span>My account</span>
                                <FaArrowRightLong aria-hidden="true" className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                            </Link>
                        </li>
                        <li className="dropdown-item group">
                            <Link
                                className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm transition-all duration-200 hover:border-ca-grey dark:hover:border-white/30 hover:bg-ca-grey/10 dark:hover:bg-white/5"
                                onClick={onClick}
                                href="/orders"
                            >
                                <span>My demo orders</span>
                                <FaArrowRightLong aria-hidden="true" className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                            </Link>
                        </li>
                    </ul>
                    {user.isAnonymous && (
                        <Link
                            href="/auth?mode=sign-up"
                            onClick={onClick}
                            className="mt-3 block rounded-md bg-ca-grey/20 px-3 py-2 text-center text-sm font-semibold hover:bg-ca-grey/40 dark:bg-white/10 dark:hover:bg-white/20"
                        >
                            Create account to keep orders
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="mt-3 w-full cursor-pointer rounded-md border border-ca-black px-3 py-2 text-sm font-semibold transition-colors hover:bg-ca-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-ca-black"
                    >
                        {user.isAnonymous ? "End demo session" : "Sign out"}
                    </button>
                    {signOutError && <p role="alert" className="mt-2 text-xs text-red-700 dark:text-red-300">{signOutError}</p>}
                    <hr className="my-3 border-ca-grey/30 dark:border-white/10" />
                </>
            ) : (
                <>
                    <Link
                        href="/auth"
                        onClick={onClick}
                        className="mt-3 block w-full rounded-md border border-ca-black px-3 py-2 text-center text-sm font-semibold transition-colors hover:bg-ca-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-ca-black"
                    >
                        Sign in or create account
                    </Link>
                    <hr className="my-3 border-ca-grey/30 dark:border-white/10" />
                </>
            )}

            <ul className="space-y-1">
                <li className="dropdown-item group">
                    <Link 
                        className="flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 border border-transparent hover:border-ca-grey dark:hover:border-white/30 hover:bg-ca-grey/10 dark:hover:bg-white/5" 
                        onClick={onClick} 
                        href="/support"
                    >
                        <span>Support</span>
                        <span className="text-xs opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                            <FaArrowRightLong />
                        </span>
                    </Link>
                </li>

                <li className="dropdown-item group">
                    <Link
                        className="flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 border border-transparent hover:border-ca-grey dark:hover:border-white/30 hover:bg-ca-grey/10 dark:hover:bg-white/5"
                        onClick={onClick}
                        href="/faq"
                    >
                        <span>FAQ</span>
                        <span className="text-xs opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                            <FaArrowRightLong />
                        </span>
                    </Link>
                </li>

                <li className="dropdown-item group">
                    <Link 
                        className="flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 border border-transparent hover:border-ca-grey dark:hover:border-white/30 hover:bg-ca-grey/10 dark:hover:bg-white/5" 
                        onClick={onClick} 
                        href="/contact"
                    >
                        <span>Contact</span>
                        <span className="text-xs opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                            <FaArrowRightLong />
                        </span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default DropdownProfile;
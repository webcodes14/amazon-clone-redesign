'use client';
{/* profile: časté dotazy, přihlášení, support, kontakt */}
{/* přihlášení jako modal? */}
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

interface DropdownProfileProps {
    onClick: () => void;
    isOpen: boolean;
}

const DropdownProfile = ({ onClick, isOpen }: DropdownProfileProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (isOpen) {
                gsap.fromTo(containerRef.current, {
                    autoAlpha: 0,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.in"
                });
            } 
        }, { dependencies: [isOpen], scope: containerRef }
    );

    return (
        <div ref={containerRef} className="fixed bottom-17 w-52 bg-white rounded-xl border p-4 z-50 shadow-xl border-ca-grey dark:border-white/20 dark:bg-ca-black text-ca-black dark:text-white origin-bottom md:top-16 md:bottom-auto md:right-auto md:left-auto md:-ml-6">
            <h4 className="font-bold text-sm tracking-wide">Profile</h4>

            <button 
                type="button" 
                className="w-full mt-3 px-3 py-1.5 text-sm font-medium border border-ca-black dark:border-white rounded-md cursor-pointer lg:hidden hover:bg-ca-black hover:text-white dark:hover:bg-white dark:hover:text-ca-black transition-all duration-200"
            >
                Sign in
            </button>

            <hr className="my-3 border-ca-grey/30 dark:border-white/10" />

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
'use client';
{/* notification: slevy, akc, atd... */}
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

interface DropdownNotificationsProps {
    isOpen: boolean;
}

const DropdownNotification = ({ isOpen }: DropdownNotificationsProps) => {
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
        <div ref={containerRef} className="fixed bottom-17 w-52 bg-white rounded-xl border p-4 z-50 shadow-xl border-ca-grey dark:border-white/20 dark:bg-ca-black text-ca-black dark:text-white md:top-16 md:bottom-auto md:right-auto md:left-auto md:ml-20">
            <h4 className="font-bold text-sm tracking-wide">Notifications</h4>
            
            <hr className="my-2.5 border-ca-grey/30 dark:border-white/10" />

            <p className="dropdown-item text-sm dark:text-white/70">
                You have no new notifications.
            </p>

            {/* dynamické a jen informační seznam */}
        </div>
    )
}

export default DropdownNotification;
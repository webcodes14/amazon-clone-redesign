'use client';

import Link from "next/link";
import ThemeBtn from "../theme/ThemeBtn";
import SearchBar from "./SearchBar";
import { NavItemsMobile } from "./NavItems";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaAmazon } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const MobileNav = () => {
    const [ openDropdown, setOpenDropdown ] = useState<string | null>(null);

    const pathname = usePathname();
    const navContainer = useRef<HTMLUListElement>(null);

    const handleOpenDropdown = (label: string) => {
        setOpenDropdown(prev => prev === label ? null : label);
    }

    const closeAll = () => {
        setOpenDropdown(null);
    };

    useGSAP(() => {
        const updatePosition = () => {
            const activeItem = navContainer.current?.querySelector(".active") as HTMLElement | null;

            if (!activeItem) return;

            gsap.to(".bg-indicator", {
                x: activeItem.offsetLeft,
                width: activeItem.offsetWidth,
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: "auto"
            });
        }
        
        updatePosition();

        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("resize", updatePosition);
        }

    }, { dependencies: [openDropdown, pathname], scope: navContainer });

    return (
        <div className="md:hidden">
            <nav>
                <div className="flex items-start justify-between m-4">
                    <Link 
                        href="/"
                        className="p-3 bg-ca-orange text-white rounded-[50%] text-xl"
                    >
                        <FaAmazon />
                    </Link>
                    <ThemeBtn />
                </div>
                <SearchBar />
                <div className="m-4">
                    <button 
                        type="button"
                        className="p-3 bg-ca-orange text-white rounded-[50%] text-xl"
                    >
                        <RxHamburgerMenu />
                    </button>
                    <ul>
                        
                    </ul>

                </div>
            </nav>

            <nav className="p-6 bg-ca-grey fixed bottom-0 w-full">
                <ul ref={navContainer} className="flex items-center justify-evenly">
                    <div
                        className="bg-indicator left-0 h-10 opacity-0 absolute -z-10 bg-ca-black rounded-xl drop-shadow-[0px_0px_2.5px_#242423]"
                    ></div>
                    
                    {NavItemsMobile.map((item) => {
                        const Icon = item.icon;
                        const isMenuOpen = openDropdown === item.label;
                        const isLinkActive = openDropdown === null && pathname === item.href;
                        const isActive = isMenuOpen || isLinkActive;

                        return (
                            <li 
                                key={item.label} 
                                className={`relative z-10 text-2xl leading-0 text-white ${isActive ? 'active' : ''}`}
                            >
                                {
                                    item.href ? 
                                        <Link onClick={closeAll} className={`p-2 block w-full h-full`} href={item.href}><Icon /></Link> 
                                        : 
                                        <button onClick={() => handleOpenDropdown(item.label)} className="cursor-pointer p-2" type="button"><Icon /></button>
                                }
                            </li>
                        )
                    })}
                </ul>
                {/* doplnit dropdowns */}
            </nav>
        </div>
    )
}

export default MobileNav;
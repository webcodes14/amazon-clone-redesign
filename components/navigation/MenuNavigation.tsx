'use client';

import Link from "next/link";
import ThemeBtn from "../theme/ThemeBtn";
import SearchBar from "./SearchBar";
import DropdownProfile from "./DropdownProfile";
import DropdownNotification from "./DropdownNotification";
import { NavItemsMobile } from "./NavItems";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaAmazon } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const MenuNavigation = () => {
    const pathname = usePathname();

    const [ openDropdown, setOpenDropdown ] = useState<string | null>(null);
    const [ isNavigating, setIsNavigating ] = useState(false);
    const [ prevPathname, setPrevPathname ] = useState(pathname);

    const navContainer = useRef<HTMLUListElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOpenDropdown = (label: string) => {
        setOpenDropdown(prev => prev === label ? null : label);
    }

    const closeAll = () => {
        setOpenDropdown(null);
    };

    const handleSubLinkClick = () => {
        setIsNavigating(true);
        closeAll();
    };

    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setIsNavigating(false);
    }

    useGSAP(() => {
        const updatePosition = () => {
            const activeItem = navContainer.current?.querySelector(".active") as HTMLElement | null;
            
            if (isNavigating || !activeItem) {
                gsap.killTweensOf(".bg-indicator");

                gsap.to(".bg-indicator", {
                    autoAlpha: 0,
                    duration: 0.35,
                    overwrite: true
                });
                return;
            }

            const indicator = navContainer.current?.querySelector(".bg-indicator") as HTMLElement;
            const isHidden = indicator && window.getComputedStyle(indicator).opacity === "0";

            if (isHidden) {
                gsap.set(".bg-indicator", {
                    x: activeItem.offsetLeft,
                    width: activeItem.offsetWidth
                });
            }

            gsap.to(".bg-indicator", {
                x: activeItem.offsetLeft,
                width: activeItem.offsetWidth,
                autoAlpha: 1,
                duration: 0.35,
                ease: 'power2.out',
                overwrite: "auto"
            });

            gsap.to(dropdownRef.current, {
                x: activeItem.offsetLeft,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto",
            });
        }
        
        updatePosition();

        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("resize", updatePosition);
        }

    }, { dependencies: [openDropdown, pathname, isNavigating], scope: navContainer });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;

            const isOutsideNav = navContainer.current && !navContainer.current.contains(target);
            
            const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);

            if (openDropdown && isOutsideNav && isOutsideDropdown) {
                closeAll();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && openDropdown) {
                closeAll();
            }
        };

        if (openDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [openDropdown]);

    return (
        <div className="">
            <nav>
                <div className="flex items-center justify-between m-4">
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

            <nav className="p-6 bg-ca-grey fixed bottom-0 w-full md:top-0 md:bottom-auto md:right-20 md:max-w-xl md:mx-auto md:my-4 md:rounded-4xl md:p-[0.315rem]">
                <button 
                    type="button" 
                    className="hidden w-full mt-3 px-3 py-1.5 text-sm font-medium border border-ca-black dark:border-white rounded-md cursor-pointer lg:block lg:w-20 lg:absolute lg:-left-24 lg:top-0 lg:mt-[0.313rem] lg:rounded-2xl hover:bg-ca-black hover:text-white dark:hover:bg-white dark:hover:text-ca-black transition-all duration-200"
                >
                    Sign in
                </button>
                <ul ref={navContainer} className="flex items-center justify-evenly">
                    <div
                        className="bg-indicator left-0 h-10 absolute -z-10 bg-ca-black rounded-xl drop-shadow-[0px_0px_2.5px_#242423] md:h-8.5"
                    ></div>

                    {NavItemsMobile.map((item) => {
                        const Icon = item.icon;
                        const isMenuOpen = openDropdown === item.label;
                        const isLinkActive = item.href ? pathname === item.href : false;
                        const isActive = isMenuOpen || isLinkActive;

                        return (
                            <li 
                                key={item.label} 
                                className={`relative z-10 text-2xl leading-0 text-white ${isActive ? 'active' : ''} md:text-lg`}
                            >
                                {
                                    item.href ? 
                                        <Link onClick={closeAll} className="p-2 block w-full h-full focus-visible:outline-0" href={item.href}><Icon /></Link> 
                                        : 
                                        <button onClick={() => handleOpenDropdown(item.label)} className="cursor-pointer p-2 focus-visible:outline-0" type="button"><Icon /></button>
                                }
                            </li>
                        )
                    })}
                </ul>
                <div ref={dropdownRef} className="absolute left-0 bottom-4 mb-2 md:contents">
                    {openDropdown === "Profile" && (
                        <DropdownProfile onClick={handleSubLinkClick} isOpen={openDropdown === "Profile"} />
                    )}
                    {openDropdown === "Notification" && (
                        <DropdownNotification isOpen={openDropdown === "Notification"} />
                    )}
                </div>
            </nav>
        </div>
    )
}

export default MenuNavigation;
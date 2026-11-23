'use client';

import Link from "next/link";
import ThemeBtn from "../theme/ThemeBtn";
import SearchBar from "./SearchBar";
import DropdownProfile from "./DropdownProfile";
import DropdownNotification from "./DropdownNotification";
import useNotifications from "./useNotifications";
import CategoryMenu from "./CategoryMenu";
import CartDropdown from "./CartDropdown";
import NavigationDropdown from "./NavigationDropdown";
import { NavItemsMobile } from "./NavItems";
import { FaAmazon } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import type { Category } from "@/types";
import type { AppDispatch, RootState } from "@/redux/store";
import { removeZeroQuantityCartProducts } from "@/redux/cartSlice";
import { useAuth } from "@/providers/AuthProvider";

const useIsomorphicLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

interface MenuNavigationProps {
    categories: Category[];
}

const dropdownNames = ["Profile", "Notification", "Cart"] as const;

const MenuNavigation = ({ categories }: MenuNavigationProps) => {
    const pathname = usePathname();
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const wishlistCount = useSelector((state: RootState) => state.wishlist.products.length);
    const cartCount = useSelector((state: RootState) =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0)
    );
    const notifications = useNotifications();

    const [ openDropdown, setOpenDropdown ] = useState<string | null>(null);
    const [ isNavigating, setIsNavigating ] = useState(false);
    const [ prevPathname, setPrevPathname ] = useState(pathname);
    const [ pendingPathname, setPendingPathname ] = useState<string | null>(null);

    const navContainer = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigationRef = useRef<HTMLElement>(null);
    const indicatorTarget = useRef<{ x: number; width: number } | null | undefined>(undefined);

    const handleOpenDropdown = useCallback((label: string) => {
        if (openDropdown === "Cart") {
            dispatch(removeZeroQuantityCartProducts());
        }
        if (label === "Notification" && openDropdown !== "Notification") {
            notifications.refresh();
        }
        setOpenDropdown(prev => prev === label ? null : label);
    }, [dispatch, openDropdown, notifications]);

    const closeAll = useCallback(() => {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement && dropdownRef.current?.contains(activeElement)) {
            activeElement.blur();
        }
        if (openDropdown === "Cart") {
            dispatch(removeZeroQuantityCartProducts());
        }
        setOpenDropdown(null);
    }, [dispatch, openDropdown]);

    const handleDropdownNavigate = useCallback((href: string) => {
        setPendingPathname(href);
        closeAll();
    }, [closeAll]);

    const handleSubLinkClick = () => {
        const activeElement = document.activeElement;
        if (dropdownRef.current?.contains(activeElement) && activeElement instanceof HTMLElement) {
            const panelName = activeElement.closest<HTMLElement>("[data-dropdown-panel]")?.dataset.dropdownPanel;
            const trigger = panelName
                ? navContainer.current?.querySelector<HTMLButtonElement>(`[data-dropdown-name="${panelName}"] button`)
                : null;
            trigger?.focus();
        }
        setIsNavigating(true);
        closeAll();
    };

    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setIsNavigating(false);
        setPendingPathname(null);
    }

    useIsomorphicLayoutEffect(() => {
        const updatePosition = () => {
            const container = navContainer.current;
            const navigation = navigationRef.current;
            const activeItem = navContainer.current?.querySelector(".active") as HTMLElement | null;
            const indicator = navContainer.current?.querySelector(".bg-indicator") as HTMLElement | null;

            if (!container || !indicator || !navigation || !dropdownRef.current) {
                return;
            }

            const navigationLeft = navigation.getBoundingClientRect().left;
            for (const name of dropdownNames) {
                const trigger = container.querySelector<HTMLElement>(`[data-dropdown-name="${name}"]`);
                const panel = dropdownRef.current.querySelector<HTMLElement>(`[data-dropdown-panel="${name}"]`);
                if (!trigger || !panel) continue;

                const triggerBounds = trigger.getBoundingClientRect();
                const panelWidth = panel.getBoundingClientRect().width;
                const desiredLeft = triggerBounds.left + triggerBounds.width / 2 - panelWidth / 2 +
                    (name === "Cart" ? 32 : 0);
                const maxLeft = Math.max(16, window.innerWidth - panelWidth - 16);
                panel.style.left = `${Math.max(16, Math.min(desiredLeft, maxLeft)) - navigationLeft}px`;
            }

            if (isNavigating || !activeItem) {
                if (indicatorTarget.current === null) {
                    return;
                }

                indicatorTarget.current = null;
                gsap.killTweensOf(indicator);
                gsap.to(indicator, {
                    autoAlpha: 0,
                    duration: 0.18,
                    ease: "power2.out"
                });
                return;
            }

            const target = { x: activeItem.offsetLeft, width: activeItem.offsetWidth };

            if (!container.classList.contains("nav-indicator-ready")) {
                gsap.set(indicator, {
                    ...target,
                    autoAlpha: 1
                });
                container.classList.add("nav-indicator-ready");
                indicatorTarget.current = target;
                return;
            }

            const isHidden = window.getComputedStyle(indicator).opacity === "0";

            if (isHidden) {
                gsap.killTweensOf(indicator);
                gsap.set(indicator, {
                    ...target
                });
            }

            const previousTarget = indicatorTarget.current;
            if (
                !isHidden &&
                previousTarget &&
                previousTarget.x === target.x &&
                previousTarget.width === target.width
            ) {
                return;
            }

            indicatorTarget.current = target;
            gsap.killTweensOf(indicator);
            gsap.to(indicator, {
                ...target,
                autoAlpha: 1,
                duration: 0.18,
                ease: "power2.out"
            });

        }
        
        updatePosition();

        const resizeObserver = new ResizeObserver(updatePosition);
        if (navContainer.current) {
            resizeObserver.observe(navContainer.current);
            navContainer.current.querySelectorAll("li").forEach((item) => resizeObserver.observe(item));
        }
        window.addEventListener("resize", updatePosition);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updatePosition);
        }

    }, [openDropdown, pathname, isNavigating, pendingPathname]);

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
                const focusWasInDropdown = dropdownRef.current?.contains(document.activeElement);
                closeAll();
                if (focusWasInDropdown) {
                    navContainer.current
                        ?.querySelector<HTMLButtonElement>(`[data-dropdown-name="${openDropdown}"] button`)
                        ?.focus();
                }
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
    }, [openDropdown, closeAll]);

    return (
        <div className="pointer-events-none">
            <nav aria-label="Site" className="pointer-events-none">
                <div className="flex items-center justify-between m-4">
                    <Link 
                        href="/"
                        aria-label="Amazon home"
                        className="pointer-events-auto p-3 bg-ca-orange text-white rounded-[50%] text-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black"
                    >
                        <FaAmazon aria-hidden="true" />
                    </Link>
                    <ThemeBtn />
                </div>
                <SearchBar categories={categories} />
                <CategoryMenu categories={categories} />
            </nav>

            <nav ref={navigationRef} aria-label="Primary navigation" className="pointer-events-auto p-6 bg-ca-grey fixed bottom-0 w-full md:top-0 md:bottom-auto md:right-20 md:max-w-xl md:mx-auto md:my-4 md:rounded-4xl md:p-[0.315rem]">
                <div ref={navContainer} className="group relative">
                    <div
                        aria-hidden="true"
                        className="bg-indicator invisible left-0 h-10 absolute -z-10 bg-ca-black rounded-xl drop-shadow-[0px_0px_2.5px_#242423] md:h-8.5"
                    ></div>

                    <ul className="flex items-center justify-evenly">
                        {NavItemsMobile.map((item) => {
                            const Icon = item.icon;
                            const isMenuOpen = openDropdown === item.label;
                            const isLinkActive = item.href ? (pendingPathname ?? pathname) === item.href : false;
                            const isActive = isMenuOpen || (isLinkActive && !openDropdown);
                            const accessibleLabel =
                                item.label === "Favorite"
                                    ? `Wishlist${wishlistCount ? `, ${wishlistCount} saved ${wishlistCount === 1 ? "product" : "products"}` : ""}`
                                    : item.label === "Cart" && cartCount > 0
                                        ? `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
                                        : item.label === "Notification" && notifications.unreadCount > 0
                                            ? `Notification, ${notifications.unreadCount} unread ${notifications.unreadCount === 1 ? "notification" : "notifications"}`
                                        : item.label === "Profile" && user
                                            ? user.isAnonymous ? "Profile, demo account" : `Profile for ${user.email ?? "signed-in account"}`
                                        : item.label;

                            return (
                                <li
                                    key={item.label}
                                    data-dropdown-name={item.label}
                                    className={`relative z-10 text-2xl leading-0 ${isActive ? 'active rounded-xl bg-ca-black text-white drop-shadow-[0px_0px_2.5px_#242423] group-[.nav-indicator-ready]:bg-transparent group-[.nav-indicator-ready]:drop-shadow-none' : 'text-ca-black'} md:text-lg`}
                                >
                                    {
                                        item.href && item.label === "Cart" ? (
                                            <button
                                                type="button"
                                                aria-label={accessibleLabel}
                                                aria-haspopup="dialog"
                                                aria-expanded={isMenuOpen}
                                                aria-controls="cart-dropdown"
                                                onClick={() => handleOpenDropdown(item.label)}
                                                className="relative block h-full w-full cursor-pointer rounded-md p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black"
                                            >
                                                <Icon aria-hidden="true" />
                                                {cartCount > 0 && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white"
                                                    >
                                                        {cartCount > 99 ? "99+" : cartCount}
                                                    </span>
                                                )}
                                            </button>
                                        ) : item.href ? (
                                            <Link
                                                onClick={() => {
                                                    setPendingPathname(item.href ?? null);
                                                    closeAll();
                                                }}
                                                aria-label={accessibleLabel}
                                                aria-current={isLinkActive ? "page" : undefined}
                                                id={item.label === "Favorite" ? "wishlist-nav-target" : undefined}
                                                className={`relative block h-full w-full rounded-md p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black ${
                                                    item.label === "Favorite" ? "wishlist-nav-link" : ""
                                                }`}
                                                href={item.href}
                                            >
                                                <Icon aria-hidden="true" />
                                                {item.label === "Favorite" && wishlistCount > 0 && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white"
                                                    >
                                                        {wishlistCount > 99 ? "99+" : wishlistCount}
                                                    </span>
                                                )}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleOpenDropdown(item.label)}
                                                aria-label={accessibleLabel}
                                                aria-expanded={isMenuOpen}
                                                aria-controls={`${item.label.toLowerCase()}-dropdown`}
                                                className="relative cursor-pointer rounded-md p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-black"
                                                type="button"
                                            >
                                                <Icon aria-hidden="true" />
                                                {item.label === "Notification" && notifications.unreadCount > 0 && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white"
                                                    >
                                                        {notifications.unreadCount > 99 ? "99+" : notifications.unreadCount}
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    }
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div ref={dropdownRef} className="pointer-events-none absolute inset-0">
                    {dropdownNames.map((name) => {
                        const isOpen = openDropdown === name;
                        return (
                            <NavigationDropdown
                                key={name}
                                name={name}
                                isOpen={isOpen}
                            >
                                {name === "Profile" && <DropdownProfile onClick={handleSubLinkClick} />}
                                {name === "Notification" && (
                                    <DropdownNotification
                                        notifications={notifications.notifications}
                                        unreadCount={notifications.unreadCount}
                                        status={notifications.status}
                                        isRead={notifications.isRead}
                                        onMarkAllRead={notifications.markAllRead}
                                    />
                                )}
                                {name === "Cart" && <CartDropdown onNavigate={handleDropdownNavigate} />}
                            </NavigationDropdown>
                        );
                    })}
                </div>
            </nav>
        </div>
    )
}

export default MenuNavigation;
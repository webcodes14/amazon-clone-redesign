import { IconType } from "react-icons";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { BsPersonFill } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";

interface NavItem {
    label: string;
    icon: IconType;
    type: 'link' | 'mobile-menu' | 'desktop-menu';
    children?: NavItem[];
    href?: string;
    authRequired?: boolean,
    hideIfLoggedIn?: boolean;
    onlyLoggedIn?: boolean;
}

export const NavItemsMobile: NavItem[] = [
    {
        label: 'Profile',
        icon: BsPersonFill,
        type: 'mobile-menu',
        onlyLoggedIn: true,
    },
    {
        label: 'Notification',
        icon: IoMdNotifications,
        type: 'mobile-menu',
    },
    {
        label: 'Home',
        icon: FaHome,
        type: 'link',
        href: '/'
    },
    {
        label: 'Favorite',
        icon: MdFavorite,
        type: 'link',
        href: '/wishlist'
    },
    {
        label: 'Cart',
        icon: FaShoppingCart,
        type: 'link',
        href: '/cart'
    }
];

import {
    FaBasketShopping,
    FaCouch,
    FaHouse,
    FaKitchenSet,
    FaLaptop,
    FaMobileScreenButton,
    FaShirt,
    FaShoePrints,
    FaSpa,
    FaSprayCan,
} from "react-icons/fa6";
import { IoWatch } from "react-icons/io5";
import type { IconType } from "react-icons";
import type { Category } from "@/types";

const categoryIcons: Record<string, IconType> = {
    beauty: FaSpa,
    fragrances: FaSprayCan,
    furniture: FaCouch,
    groceries: FaBasketShopping,
    "home-decoration": FaHouse,
    "kitchen-accessories": FaKitchenSet,
    laptops: FaLaptop,
    "mens-shirts": FaShirt,
    "mens-shoes": FaShoePrints,
    "mens-watches": IoWatch,
    "mobile-accessories": FaMobileScreenButton,
};

const getCategoryIcon = (category: Category) => categoryIcons[category.trim().toLowerCase()];

export default getCategoryIcon;

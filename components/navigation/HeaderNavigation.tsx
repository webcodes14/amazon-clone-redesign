import MenuNavigation from "./MenuNavigation";
import type { Category } from "@/types";

interface HeaderNavigationProps {
    categories: Category[];
}

const HeaderNavigation = ({ categories }: HeaderNavigationProps) => {

    return (
        <header className="pointer-events-none max-w-fhd mx-auto w-full fixed top-0 left-0 z-50">
            <MenuNavigation categories={categories} />
        </header>
    )
}

export default HeaderNavigation;
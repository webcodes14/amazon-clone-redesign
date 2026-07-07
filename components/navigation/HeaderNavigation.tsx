import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const HeaderNavigation = () => {

    return (
        <header className="max-w-fhd mx-auto w-full">
            <DesktopNav />
            <MobileNav />
        </header>
    )
}

export default HeaderNavigation;
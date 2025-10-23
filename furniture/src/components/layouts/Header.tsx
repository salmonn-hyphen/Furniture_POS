import { siteConfig } from "../../config/site";
import { ModeToggle } from "../mode-toggle";
import AuthDropDown from "./AuthDropDown";
import MainNavigation from "./MainNav";
import MobileNav from "./MobileNav";
import { User } from "../../data/user";
function Header() {
  return (
    <header className="bg-background fixed top-0 z-50 w-full border-b">
      <nav className="container mx-auto flex h-16 items-center">
        <MainNavigation items={siteConfig.mainNav} />
        <MobileNav items={siteConfig.mainNav} />
        <div className="mr-8 flex flex-1 items-center justify-end space-x-4 lg:mr-0">
          <ModeToggle />
          <AuthDropDown user={User} />
        </div>
      </nav>
    </header>
  );
}

export default Header;

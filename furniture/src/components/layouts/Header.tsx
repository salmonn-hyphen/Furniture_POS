import { siteConfig } from "../../config/site";
import { ModeToggle } from "../mode-toggle";
import MainNavigation from "./MainNav";
import MobileNav from "./MobileNav";
function Header() {
  return (
    <header className="bg-background fixed top-0 z-50 w-full border-b">
      <nav className="container mx-auto flex h-16 justify-center">
        <MainNavigation items={siteConfig.mainNav} />
        <MobileNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4 px-7 md:px-20 lg:mr-0">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Header;

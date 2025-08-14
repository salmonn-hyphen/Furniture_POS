import { siteConfig } from "../../config/site";
import MainNavigation from "./MainNav";
function Header() {
  return (
    <header className="w-full border-b">
      <nav className="container flex h-16 items-center">
        <MainNavigation items={siteConfig.mainNav} />
      </nav>
    </header>
  );
}

export default Header;

import MainNavigation from "./MainNav";
function Header() {
  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center">
        <MainNavigation />
      </div>
    </header>
  );
}

export default Header;

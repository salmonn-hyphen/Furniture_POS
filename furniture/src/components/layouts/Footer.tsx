import { Link } from "react-router";
import { siteConfig } from "../../config/site";
import { Icons } from "../logo";
function Footer() {
  return (
    <div>
      <footer className="w-full border-t">
        <div className="container mx-auto">
          <section className="flex flex-col gap-10 lg:flex-row lg:gap-20">
            <section className="pl-20">
              <Link to="/" className="flex items-center space-x-2">
                <Icons.logo className="size-6" aria-hidden="true"></Icons.logo>
                <span className="font-bold">{siteConfig.name}</span>
                <span className="sr-only">Home</span>
              </Link>
            </section>
            <section className="grid grid-cols-2 md:grid-cols-4">
              Loop Menu
            </section>
          </section>
        </div>
      </footer>
    </div>
  );
}

export default Footer;

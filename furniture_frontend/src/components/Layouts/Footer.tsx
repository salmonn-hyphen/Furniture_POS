import { Link } from "react-router";
import { siteConfig } from "../../config/site";
import { Icons } from "../logo";
import { EmailForm } from "./EmailForm";
function Footer() {
  return (
    <div className="border-t">
      <footer className="ml-4 w-full lg:ml-0">
        <div className="container mx-auto pt-6 pb-8 lg:py-6">
          <section className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
            <section>
              <Link to="/" className="flex items-center space-x-2">
                <Icons.logo className="size-6" aria-hidden="true"></Icons.logo>
                <span className="font-bold">{siteConfig.name}</span>
                <span className="sr-only">Home</span>
              </Link>
            </section>
            <section className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-4">
              {siteConfig.footerNav.map((foot) => (
                <div key={foot.title} className="ml-2">
                  <h4 className="font-medium">{foot.title}</h4>
                  <ul className="">
                    {foot.items.map((items) => (
                      <li
                        key={items.title}
                        className="text-muted-foreground hover:text-foreground mt-2"
                      >
                        <Link
                          target={items.external ? "_blank" : undefined}
                          to={items.href}
                        >
                          {items.title}
                          <span className="sr-only">{items.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
            <section className="space-y-3">
              <h4 className="font-medium">Subscribe to our newsletter</h4>
              <EmailForm />
            </section>
          </section>
        </div>
      </footer>
    </div>
  );
}

export default Footer;

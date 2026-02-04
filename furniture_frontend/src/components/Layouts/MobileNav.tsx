import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";

import type { MainNavItem } from "../../types";
import { Icons } from "../logo";
import { siteConfig } from "../../config/site";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useEffect, useState } from "react";

interface MainNavigationProps {
  items?: MainNavItem[];
}
function MobileNav({ items }: MainNavigationProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  function onChange(event: MediaQueryListEvent) {
    setIsDesktop(event.matches);
  }
  const query = "(min-width: 1024px)";
  useEffect(() => {
    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    return () => result.removeEventListener("change", onChange);
  }, [query]);

  if (isDesktop) {
    return null;
  }

  return (
    <div>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-4 flex items-center"
            >
              <Icons.menu aria-hidden="true" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pt-10">
            <SheetClose asChild>
              <Link to="/" className="ml-4 flex items-center">
                <Icons.logo className="mr-2 size-4" />
                <span className="font-bold">{siteConfig.name}</span>
                <span className="sr-only">Home</span>
              </Link>
            </SheetClose>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] px-4 pb-8">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="mb-0">
                    {items?.[0].title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mb-0 flex flex-col space-y-2 pl-2">
                      {items?.[0].card?.map((item) => (
                        <SheetClose asChild>
                          <Link
                            key={item.title}
                            to={String(item.href)}
                            className="text-foreground/70"
                          >
                            {item.title}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mt-2 flex flex-col space-y-2 pb-2">
                {items?.[0].menu?.map((item) => (
                  <SheetClose key={item.title} asChild>
                    <Link to={String(item.href)} className="">
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default MobileNav;

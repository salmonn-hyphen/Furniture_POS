import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import type { Cart } from "../../types/index";
import { Icons } from "../logo";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Link } from "react-router";
import { ScrollArea } from "../ui/scroll-area";
import CartItem from "../Cart/CartItem";
import { formatPrice } from "../../lib/utils";

interface CartProps {
  cartItem: Cart[];
}
function CartSheet({ cartItem }: CartProps) {
  const itemCount = 4;
  const totalAmount = 390;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Cart Open"
          className="relative"
        >
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 size-6 justify-center rounded-full p-2.5"
          >
            {itemCount}
          </Badge>
          <Icons.cart className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full md:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex justify-center text-2xl font-medium lg:block">
            Cart - {itemCount}
          </SheetTitle>
          <Separator className="my-2" />

          {cartItem.length > 0 ? (
            <>
              <ScrollArea className="my-3 h-[64vh] pb-8">
                <div className="flex-1">
                  {cartItem.map((item) => (
                    <CartItem key={item.id} cart={item} />
                  ))}
                </div>
              </ScrollArea>
              <div className="space-y-4">
                <Separator />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="">Shipping</span>
                    <span className="">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Taxes</span>
                    <span className="">Calculated at Checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Total</span>
                    <span className="">
                      {formatPrice(totalAmount.toFixed(2))}
                    </span>
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      type="submit"
                      className="w-full"
                      asChild
                      aria-label="Check Out"
                    >
                      <Link to="/checkout">Continue to Checkout</Link>
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <Icons.cart className="text-muted-foreground mb-4 size-16" />
                <div className="text-muted-foreground text-xl font-medium">
                  The Cart is empty
                </div>
                <Button variant="outline" className="my-2.5" asChild>
                  <Link to="/products" className="text-foreground">
                    Go to Shop
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;

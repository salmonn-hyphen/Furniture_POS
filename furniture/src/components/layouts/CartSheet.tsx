import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import type { Cart } from "../../types/index";
import { Icons } from "../logo";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

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
          <Icons.cart />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full pt-4 lg:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex justify-center text-2xl font-medium lg:block">
            Cart - {itemCount}
          </SheetTitle>
          <Separator className="my-2" />
          <SheetDescription>
            {cartItem.length < 0 ? (
              <div className="">Hello</div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-1.5">
                <Icons.cart className="text-muted-foreground mb-4 size-16" />
                <div className="text-muted-foreground text-xl font-medium">
                  The Cart is empty
                </div>
              </div>
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;

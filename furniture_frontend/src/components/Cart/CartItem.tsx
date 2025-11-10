import { Separator } from "@radix-ui/react-dropdown-menu";
import { formatPrice } from "../../lib/utils";
import type { Cart } from "../../types";
import { CartButton } from "./CartButton";

interface CartProps {
  cart: Cart;
}
function CartItem({ cart }: CartProps) {
  return (
    <>
      <div className="space-y-3">
        <div className="mt-4 mb-2 flex gap-4">
          <img
            src={cart.image.url}
            alt="Item Image"
            className="obj-cover w-16"
          />
          <div className="flex flex-col space-y-1">
            <span className="line-clamp-1 text-sm font-medium">
              {cart.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatPrice(cart.price)} x {cart.quantity} ={" "}
              {formatPrice((cart.price * cart.quantity).toFixed(2))}
            </span>
            <span className="text-muted-foreground line-clamp-1 text-xs capitalize">
              {`${cart.category} / ${cart.subcategory}`}
            </span>
          </div>
        </div>
        <CartButton />
      </div>
    </>
  );
}

export default CartItem;

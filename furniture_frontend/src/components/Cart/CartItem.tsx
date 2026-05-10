import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "../../lib/utils";
import type { Cart } from "../../types";
import { CartButton } from "./CartButton";

interface CartProps {
  cart: Cart;
}

const imageUrl = import.meta.env.VITE_IMG_URL;

function CartItem({ cart }: CartProps) {
  const { updateItem, removeItem } = useCartStore();
  const updateHandler = (quantity: number) => {
    updateItem(cart.id, quantity);
  };
  const removeHandler = () => {
    removeItem(cart.id);
  };
  return (
    <>
      <div className="space-y-3">
        <div className="mt-4 mb-2 flex gap-4">
          <img
            src={imageUrl + cart.image}
            alt="Item Image"
            className="obj-cover w-16"
            loading="lazy"
            decoding="async"
          />
          <div className="flex flex-col space-y-1">
            <span className="line-clamp-1 text-sm font-medium">
              {cart.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatPrice(cart.price)} x {cart.quantity} ={" "}
              {formatPrice((cart.price * cart.quantity).toFixed(2))}
            </span>
          </div>
        </div>
        <CartButton
          onUpdate={updateHandler}
          onRemove={removeHandler}
          quantity={cart.quantity}
        />
      </div>
    </>
  );
}

export default CartItem;

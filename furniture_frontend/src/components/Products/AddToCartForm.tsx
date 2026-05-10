import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "../logo";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

const quantitySchema = z.object({
  quantity: z
    .string()
    .min(1, "Must not be empty")
    .max(3, "Too many items")
    .regex(/^\d+$/, "Must be number"),
});

interface Props {
  canBuy: boolean;
  idInCart: number;
  onHandleCart: (quantity: number) => void;
}

export function AddToCartForm({ canBuy, idInCart, onHandleCart }: Props) {
  const cartItem = useCartStore((state) =>
    state.carts.find((item) => item.id === idInCart),
  );

  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: cartItem ? cartItem.quantity.toString() : "1",
    },
  });

  const { setValue, watch } = form;
  const currentQuantity = Number(watch("quantity"));

  useEffect(() => {
    if (cartItem) {
      setValue("quantity", cartItem.quantity.toString(), {
        shouldValidate: true,
      });
    } else {
      setValue("quantity", "1"); // When remove one item from cart sheet, it changes to 1
    }
  }, [cartItem, setValue]);

  const handleDecrease = () => {
    const newQuantity = Math.max(currentQuantity - 1, 0);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
  };

  const handleIncrease = () => {
    const newQuantity = Math.min(currentQuantity + 1, 999);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
  };

  function onSubmit(values: z.infer<typeof quantitySchema>) {
    onHandleCart(Number(values.quantity));
    toast.success(
      cartItem
        ? "Update Cart Successfully"
        : "Product is added to the cart successfully",
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-[130px] flex-col gap-4"
      >
        {/* Input Start */}
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-r-none"
            onClick={handleDecrease}
            disabled={currentQuantity <= 1}
          >
            <Icons.minus className="size-3" aria-hidden="true" />
            <span className="sr-only">Remove One Item</span>
          </Button>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="relative space-y-0">
                <FormLabel className="sr-only">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    className="h-8 w-16 [appearance:textfield] rounded-none border-x-0 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    {...field}
                    min={1}
                    max={9999}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-l-none"
            disabled={currentQuantity >= 999}
            onClick={handleIncrease}
          >
            <Icons.plus className="size-3" aria-hidden="true" />
            <span className="sr-only">Add One Item</span>
          </Button>
        </div>
        {/* Input End */}

        {/* Buttons End */}
        <div className="mt-4 flex items-center space-x-2.5">
          <Button
            type="button"
            aria-label="Buy Now"
            size="sm"
            className={cn(
              "bg-main w-full font-bold",
              !canBuy && "bg-slate-400",
            )}
          >
            Buy Now
          </Button>
          <Button
            type="submit"
            aria-label="Add to Cart"
            size="sm"
            variant={canBuy ? "outline" : "default"}
            className="w-full font-semibold"
          >
            {cartItem ? "UpdateCart" : "Add to Cart"}
          </Button>
        </div>
        {/* Buttons End */}
      </form>
    </Form>
  );
}

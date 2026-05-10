import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "../logo";
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
import { Separator } from "../ui/separator";

const quantitySchema = z.object({
  quantity: z
    .string()
    .min(1, "Must not be empty")
    .max(3, "Too many items")
    .regex(/^\d+$/, "Must be a number"),
});

interface cartProps {
  onUpdate: (quantity: number) => void;
  onRemove: () => void;
  quantity: number;
}

export function CartButton({ onUpdate, onRemove, quantity }: cartProps) {
  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: quantity.toString(),
    },
  });

  const { setValue, watch } = form;
  const currentQuantity = Number(watch("quantity"));

  const handleDecrease = () => {
    const newQuantity = Math.max(currentQuantity - 1, 0);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
    onUpdate(newQuantity);
  };

  const handleIncrease = () => {
    const newQuantity = Math.min(currentQuantity + 1, 999);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
    onUpdate(newQuantity);
  };
  return (
    <Form {...form}>
      <form className="flex w-full justify-between">
        {/* Input Start */}
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-r-none"
            onClick={handleDecrease}
            disabled={currentQuantity === 0}
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
                    className="h-8 w-14 [appearance:textfield] rounded-none border-x-0 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    {...field}
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
            onClick={handleIncrease}
            disabled={currentQuantity > 999}
          >
            <Icons.plus className="size-3" aria-hidden="true" />
            <span className="sr-only">Add One Item</span>
          </Button>
        </div>
        {/* Input End */}

        {/* Buttons Starts */}
        <Button
          type="button"
          variant="outline"
          aria-label="Delete Cart Item"
          size="icon"
          className="size-8"
          onClick={onRemove}
        >
          <Icons.trash className="size-4" aria-hidden="true" />
          <span className="sr-only">Delete Item</span>
        </Button>
        {/* Buttons End */}
      </form>
      <Separator className="my-4" />
    </Form>
  );
}

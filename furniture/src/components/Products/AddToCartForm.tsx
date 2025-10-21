import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "../logo";
import { Toaster } from "../ui/sonner";
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

const quantitySchema = z.object({
  quantity: z.number().min(0),
});

interface Props {
  canBuy: boolean;
}
export function AddToCartForm({ canBuy }: Props) {
  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof quantitySchema>) {
    console.log(values);
    <Toaster />;
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
                    className="h-8 w-16 rounded-none border-x-0"
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
            Add to Cart
          </Button>
        </div>
        {/* Buttons End */}
      </form>
    </Form>
  );
}

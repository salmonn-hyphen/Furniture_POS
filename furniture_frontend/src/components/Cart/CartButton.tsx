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
import { Separator } from "../ui/separator";

const quantitySchema = z.object({
  quantity: z.number().min(0),
});

export function CartButton() {
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
        className="flex w-full justify-between"
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
                    className="h-8 w-14 rounded-none border-x-0"
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

        {/* Buttons Starts */}
        <Button
          type="button"
          variant="outline"
          aria-label="Delete Cart Item"
          size="icon"
          className="size-8"
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

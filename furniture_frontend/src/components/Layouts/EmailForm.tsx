"use client";

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
import { useState } from "react";
import { Spinner } from "../ui/spinner";

const emailSchema = z.object({
  email: z.string({
    message: "Please enter the valid email !",
  }),
});

export function EmailForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof emailSchema>) {
    console.log(values);
    setLoading(true);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full pr-8 lg:pr-0"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative space-y-0">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@gmail.com"
                  className="pr-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Button
                size="icon"
                className="absolute top-[4px] right-[3.5px] z-20 size-7"
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <Icons.paperPlane className="size-3" aria-hidden="true" />
                )}
                <span className="sr-only">Send Email</span>
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

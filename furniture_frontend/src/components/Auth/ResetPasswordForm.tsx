import { cn } from "../../lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useActionData, useNavigation, useSubmit } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";

const resetSchema = z.object({
  phone: z
    .string()
    .min(9, "Please enter the correct phone number!")
    .max(12, "Please enter the correct phone number!")
    .regex(/^\d+$/, "Phone number must be number!"),
});

export default function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      phone: "",
    },
  });

  const submit = useSubmit();
  const navigation = useNavigation();

  const actionData = useActionData() as {
    error: string;
    message: string;
  };

  function onSubmit(values: z.infer<typeof resetSchema>) {
    submit(values, { method: "POST", action: "." });
  }

  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      <Card className="w-full overflow-hidden p-0">
        <CardContent className="">
          <div className="p-6 md:p-8 lg:p-10">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  Welcome to Furniture Shop
                </h1>
                <p className="text-muted-foreground text-balance">
                  Reset Password
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid w-full"
                >
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="relative space-y-0">
                        <FormLabel>Phone Number</FormLabel>
                        <FormLabel className="sr-only">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="09*********"
                            type="tel"
                            required
                            className="pr-12"
                            {...field}
                          />
                        </FormControl>
                        <div className="min-h-3">
                          <FormMessage />
                          {actionData && (
                            <p className="text-sm text-red-500">
                              {actionData?.message}
                            </p>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="mt-2"
                    disabled={navigation.state === "submitting"}
                  >
                    {navigation.state === "submitting" ? <Spinner /> : "Reset"}
                  </Button>
                </form>
              </Form>
              <FieldDescription className="text-center">
                Do You remember your password?
                <Link to="/signin">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

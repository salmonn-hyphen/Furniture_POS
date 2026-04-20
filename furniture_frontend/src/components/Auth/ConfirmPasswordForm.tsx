import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { FieldGroup } from "../../components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { PasswordInput } from "../../components/Auth/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSubmit } from "react-router";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(8, "Password must be  8 characters")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error shows on confirmPassword field
  });

export default function ConfirmPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const submit = useSubmit();
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  function onSubmit(values: z.infer<typeof passwordSchema>) {
    submit(values, { method: "POST", action: "/signup/confirm-password" });
  }
  return (
    <div
      className={cn("mx-auto flex w-full max-w-md flex-col gap-6", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0">
        <CardContent className="">
          <div className="p-6 md:p-8 lg:p-10">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Confirm New Password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter and confirm your new password
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid w-full gap-4"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative space-y-0">
                        <FormLabel>New Password</FormLabel>
                        <FormLabel className="sr-only">New Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Enter new password"
                            required
                            className="pr-12"
                            {...field}
                          />
                        </FormControl>
                        <div className="min-h-3">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="relative space-y-0">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormLabel className="sr-only">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Re-enter password"
                            required
                            className="pr-12"
                            {...field}
                          />
                        </FormControl>
                        <div className="min-h-3">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-2">
                    Confirm Password
                  </Button>
                </form>
              </Form>
            </FieldGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

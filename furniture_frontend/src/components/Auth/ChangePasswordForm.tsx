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
import { useSubmit, useNavigation, useActionData } from "react-router";
import { Spinner } from "../ui/spinner";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(8, "Password must be  8 characters")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(8, "Password must be  8 characters")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),

    reTypePassword: z.string(),
  })
  .refine((data) => data.newPassword === data.reTypePassword, {
    message: "Passwords do not match",
    path: ["reTypePassword"], // error shows on reTypePassword field
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export default function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData() as { error?: string; message?: string };

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      reTypePassword: "",
    },
  });
  function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    submit(values, { method: "POST", action: "/change-password" });
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
                <h1 className="text-2xl font-bold">Change Password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your current password and a new password
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid w-full gap-4"
                >
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem className="relative space-y-0">
                        <FormLabel>Current Password</FormLabel>
                        <FormLabel className="sr-only">
                          Current Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Enter current password"
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
                    name="newPassword"
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
                    name="reTypePassword"
                    render={({ field }) => (
                      <FormItem className="relative space-y-0">
                        <FormLabel>Re-type Password</FormLabel>
                        <FormLabel className="sr-only">
                          Re-type Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Re-enter new password"
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
                  {actionData?.error && (
                    <p className="text-sm text-red-500">{actionData.error}</p>
                  )}
                  <Button
                    type="submit"
                    className="mt-2"
                    disabled={navigation.state === "submitting"}
                  >
                    {navigation.state === "submitting" ? <Spinner /> : "Change"}
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

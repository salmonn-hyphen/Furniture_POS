import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "../ui/spinner";
import { useActionData, useNavigation, useSubmit } from "react-router";
import { cn } from "@/lib/utils";

const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function OtpVerify({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });
  const actionData = useActionData() as {
    error?: string;
    message?: string;
  };
  const isSubmitting = navigation.state === "submitting";
  function onSubmit(values: z.infer<typeof otpSchema>) {
    submit(values, { method: "POST", action: "/signup/otp" });
  }
  return (
    <div className={cn("w-full px-3 sm:px-4", className)} {...props}>
      <Card className="mx-auto w-full max-w-sm rounded-xl md:max-w-sm lg:max-w-md">
        <CardHeader className="space-y-1 pb-3 text-center md:pb-4">
          <CardTitle>Verify your login</CardTitle>
          <CardDescription>
            Enter the verification code we sent to your phone:{" "}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-2 md:pb-3">
          <Field className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <FieldLabel htmlFor="otp-verification">
                Verification code
              </FieldLabel>
              <Button variant="outline" size="sm">
                <RefreshCwIcon className="size-4" />
                Resend Code
              </Button>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full pr-8 lg:pr-0"
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="relative space-y-0">
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          id="otp-verification"
                          required
                          className="w-full"
                          pattern={REGEXP_ONLY_DIGITS}
                          {...field}
                        >
                          <InputOTPGroup className="mx-auto">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <div className="min-h-3">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                {actionData && (
                  <p className="text-xs text-red-400">{actionData?.error}</p>
                )}

                <Button type="submit" className="mt-2">
                  {isSubmitting ? <Spinner /> : "Verify"}
                </Button>
              </form>
            </Form>

            <FieldDescription>
              <a href="#"></a>
            </FieldDescription>
          </Field>
        </CardContent>
        <CardFooter className="pt-2 pb-6 md:pb-8">
          <Field className="w-full space-y-3">
            <div className="text-muted-foreground text-sm">
              Having trouble signing in?{" "}
              <a
                href="#"
                className="hover:text-primary underline underline-offset-4 transition-colors"
              >
                Contact support
              </a>
            </div>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}

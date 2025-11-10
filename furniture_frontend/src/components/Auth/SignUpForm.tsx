import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Link } from "react-router";

export default function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to Our Shop</CardTitle>
          <CardDescription>Register with your phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="number">Phone Number</FieldLabel>
                <Input
                  id="number"
                  type="text"
                  placeholder="+959*********"
                  //required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  //required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Confirm Password</FieldLabel>
                </div>
                <Input
                  id="comfirm password"
                  type="password"
                  //required
                />
              </Field>
              <Field className="pb-6">
                <Button type="submit" asChild>
                  <Link to="/">Register</Link>
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?
                  <Link to="/signin">Sign In</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

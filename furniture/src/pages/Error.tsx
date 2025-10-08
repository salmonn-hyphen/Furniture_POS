import { Link } from "react-router";
import Header from "../components/layouts/Header";
import { Button } from "../components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ThemeProvider } from "../components/theme-provider";
function Error() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex min-h-screen">
          <Header />
          <div className="mx-auto flex items-center pt-16">
            <Card className="w-[340px] py-10 md:w-[580px]">
              <CardHeader>
                <CardTitle className="text-center">Oops !</CardTitle>
                <CardDescription className="text-center">
                  An error occurs accidently.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full lg:w-md">
                  <Link to="/">Go Back Home</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default Error;

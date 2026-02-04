import { Link } from "react-router";
import Header from "../components/Layouts/Header";
import { Button } from "../components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ThemeProvider } from "../components/theme-provider";
import Footer from "../components/Layouts/Footer";
import { Icons } from "../components/logo";

function Error() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex min-h-screen flex-col overflow-hidden">
          <Header />
          <main className="mx-auto my-32 flex flex-1 items-center">
            <Card className="w-[350px] py-10 md:w-[500px] lg:w-[500px]">
              <CardHeader className="place-items-center gap-2">
                <div className="border-muted-foreground/70 mt-2 mb-4 grid size-24 place-items-center rounded-full border border-dashed">
                  <Icons.exclamation
                    className="text-muted-foreground/70 size-10"
                    aria-hidden="true"
                  />
                </div>
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
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}

export default Error;

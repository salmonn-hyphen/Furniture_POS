import { Link } from "react-router";
import SignUpForm from "./SignUpForm";
import { siteConfig } from "../../config/site";
import { Icons } from "../logo";

function SignUp() {
  return (
    <>
      <Link
        to="/"
        className="item-center text-foreground/80 hover:text-foreground transition-color fixed top-6 left-8 flex text-lg font-bold tracking-tight"
      >
        <Icons.logo className="mr-2 size-7" aria-hidden />
        <span className="inline-block">{siteConfig.name}</span>
        <span className="sr-only">Home</span>
      </Link>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <SignUpForm />
        </div>
      </div>
    </>
  );
}

export default SignUp;

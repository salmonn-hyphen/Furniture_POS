import { Link } from "react-router";
import { Icons } from "../logo";
import { siteConfig } from "../../config/site";
import LoginForm from "../Auth/LoginForm";

function Login() {
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
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <LoginForm />
        </div>
      </div>
    </>
  );
}

export default Login;

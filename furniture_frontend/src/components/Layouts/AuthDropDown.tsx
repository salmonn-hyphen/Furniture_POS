import type { User } from "../../types/index";
import { Link } from "react-router";
import { Icons } from "../logo";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface userProps {
  user: User;
}

function AuthDropDown({ user }: userProps) {
  if (!user) {
    return (
      <>
        <Button asChild>
          <Link to="/signin">
            Sign In
            <span className="sr-only">Sign In</span>
          </Link>
        </Button>
      </>
    );
  }

  const initialName = `${user.firstName.charAt(0) ?? ""}${user.lastName.charAt(0) ?? ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="size-8 rounded-full">
          <Avatar>
            <AvatarImage src={user.image} />
            <AvatarFallback>{initialName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-y-1">
            <p className="text-sm leading-none font-medium">
              {user.firstName} {""}
              {user.lastName}
            </p>
            <p className="text-muted-foreground text-sm leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="#">
              <Icons.dashboard className="aria-hidden: mr-2 size-4" />
              DashBoard
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="#">
              <Icons.gear className="aria-hidden: mr-2 size-4" />
              Setting
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/signin">
            <Icons.exit className="aria-hidden: mr-2 size-4" />
            Log Out
            <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AuthDropDown;

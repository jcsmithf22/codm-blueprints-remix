import React from "react";
import { Link } from "@remix-run/react";
import type { Session } from "@supabase/supabase-js";
import { cn } from "~/lib/utils";
// import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
// import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import BlankProfile from "~/assets/blank_profile.avif";
import Logo from "~/assets/logo.webp";
import MobileMenu from "./MobileMenu";

type NavigationItem = {
  title: string;
  url: string;
  id: string;
  subitems?: NavigationItem[];
};

const navigation: NavigationItem[] = [
  {
    title: "Home",
    url: "/",
    id: "home",
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    id: "dashboard",
  },
  {
    title: "Create",
    url: "/create",
    id: "create",
  },
];

// reduce rerenders

export default function Nav({
  pathname,
  session,
  user_data,
  logout,
}: {
  pathname: string;
  session: Session | null;
  user_data: {
    avatar_url: string | null;
    username: string | null;
  } | null;
  logout: () => Promise<void>;
}) {
  // const [open, setOpen] = React.useState(false);
  // const [search, setSearch] = React.useState("");
  const [hoveredNavItem, setHoveredNavItem] = React.useState<string | null>(
    null
  );
  const username = user_data?.username || null;
  const avatar_url = user_data?.avatar_url || BlankProfile;
  return (
    <nav className="bg-background border-b fixed inset-x-0 top-0 z-50">
      <div className="px-2 sm:px-4">
        <div className="relative h-14 items-center flex justify-between gap-x-4">
          <div className="flex items-center px-2 lg:px-0 flex-shrink-0">
            <div className="flex-shrink-0 relative">
              <Link to="/">
                <img className="h-8 w-auto" src={Logo} alt="Your Company" />
              </Link>
            </div>
            <div className="hidden md:ml-6 md:block">
              <ul
                className="flex space-x-4"
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                {navigation.map(({ title, url }) => {
                  const selected =
                    pathname === url ||
                    (url === "/dashboard" && pathname.startsWith("/dashboard"));

                  return (
                    <li
                      key={url}
                      className="relative"
                      style={{
                        zIndex: hoveredNavItem === title ? 1 : 2,
                      }}
                    >
                      <Link
                        to={url}
                        onMouseEnter={() => setHoveredNavItem(title)}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 relative",
                          selected && "text-gray-700 bg-secondary"
                        )}
                      >
                        {title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* <div className="w-full">
            <div className="md:ml-auto md:max-w-md relative">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <Search
                className="h-5 w-5 absolute inset-2.5 pointer-events-none text-gray-500"
                aria-hidden="true"
              />
              <Input
                className="px-10"
                id="search"
                name="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search.length > 0 && (
                <Button
                  className="absolute inset-y-2 right-2 h-6 w-6"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearch("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div> */}
          <div className="flex justify-end flex-shrink-0">
            {session ? (
              <div className="flex items-center w-fit">
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full h-8 w-8"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </Button> */}

                {/* <div className="relative pl-4 flex-shrink-0 h-8"> */}
                <div className="relative flex-shrink-0 h-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative rounded-full h-8 px-0 flex gap-x-2"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="hidden md:block h-8 w-8 rounded-full"
                          src={avatar_url}
                          alt=""
                        />
                        {username && (
                          <p className="pr-3 pl-3 md:pl-0 font-normal text-xs">
                            {username}
                          </p>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {/* <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                      <DropdownMenuItem asChild>
                        <button
                          type="button"
                          className="w-full"
                          onClick={async () => await logout()}
                        >
                          Logout
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-secondary hover:text-gray-700"
              >
                Login
              </Link>
            )}
            <div className="md:hidden w-10">
              <MobileMenu navigationItems={navigation} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

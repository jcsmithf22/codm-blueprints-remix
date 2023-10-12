import React from "react";
import { Link } from "@remix-run/react";
import type { Session } from "@supabase/supabase-js";
import { cn } from "~/lib/utils";
import { Search, X, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { motion } from "framer-motion";

type Navigation = {
  name: string;
  href: string;
};

const navigation: Navigation[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Dashboard",
    href: "/dashboard/attachments",
  },
  {
    name: "Create",
    href: "/create",
  },
];

export default function Nav({
  pathname,
  session,
  logout,
}: {
  pathname: string;
  session: Session | null;
  logout: () => Promise<void>;
}) {
  // const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [hoveredNavItem, setHoveredNavItem] = React.useState<string | null>(
    null
  );
  const id = React.useId();
  return (
    <nav className="bg-white border-b border-b-gray-200 fixed inset-x-0 top-0 z-50">
      <div className="px-2 sm:px-4">
        <div className="relative h-14 items-center flex justify-between gap-x-4">
          <div className="flex items-center px-2 lg:px-0 flex-shrink-0">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500"
                alt="Your Company"
              />
            </div>
            <div className="hidden lg:ml-6 lg:block">
              <ul
                className="flex space-x-4"
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                {navigation.map(({ name, href }) => {
                  const selected =
                    pathname === href ||
                    (href === "/dashboard/attachments" &&
                      pathname.startsWith("/dashboard"));

                  return (
                    <li
                      key={href}
                      className="relative"
                      style={{
                        zIndex: hoveredNavItem === name ? 1 : 2,
                      }}
                    >
                      {selected && (
                        <motion.div
                          layoutId={id}
                          className="bg-gray-100 absolute inset-0 -inset-y-1.5"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          initial={{
                            borderRadius: "calc(var(--radius) - 2px)",
                          }}
                        />
                      )}
                      <Link
                        to={href}
                        onMouseEnter={() => setHoveredNavItem(name)}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 relative",
                          selected && "text-gray-700"
                        )}
                      >
                        {name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="w-full">
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
          </div>
          <div className="hidden lg:flex justify-end">
            {session ? (
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full h-8 w-8"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </Button>

                <div className="relative pl-4 flex-shrink-0 h-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative rounded-full h-8 w-8"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuItem>Subscription</DropdownMenuItem>
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
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                Login
              </Link>
            )}
          </div>
          {/* <div className="flex lg:hidden relative">
            <Popover.Root open={open} onOpenChange={setOpen}>
              <div className="px-1">
                <Popover.Trigger>
                  <IconButton size="3" variant="ghost">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <Cross1Icon
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    ) : (
                      <HamburgerMenuIcon
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </IconButton>
                </Popover.Trigger>
              </div>
              <Popover.Content size="3">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  <Popover.Close>
                    <Link
                      to="/"
                      className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                    >
                      Home
                    </Link>
                  </Popover.Close>
                  <Popover.Close>
                    <Link
                      to="/dashboard/types"
                      className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                    >
                      Types
                    </Link>
                  </Popover.Close>
                  <Popover.Close>
                    <Link
                      to="/dashboard/models"
                      className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                    >
                      Models
                    </Link>
                  </Popover.Close>
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        Tom Cook
                      </div>
                      <div className="text-sm font-medium text-gray-400">
                        tom@example.com
                      </div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Popover.Close>
                      <Link
                        to="/login"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        Login
                      </Link>
                    </Popover.Close>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Root>
          </div> */}
        </div>
      </div>
    </nav>
  );
}

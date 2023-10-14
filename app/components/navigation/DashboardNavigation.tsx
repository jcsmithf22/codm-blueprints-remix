import React from "react";
import { cn } from "~/lib/utils";

import { Puzzle, Boxes, Sword, Rocket } from "lucide-react";
import { Link, useLocation } from "@remix-run/react";
import { motion } from "framer-motion";

type Icon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>
>;

type Navigation = {
  name: string;
  href: string;
  icon: Icon;
  admin?: boolean;
};

const navigation: Navigation[] = [
  {
    name: "Loadouts",
    href: "/dashboard/loadouts",
    icon: Rocket,
  },
  {
    name: "Attachments",
    href: "/dashboard/attachments",
    icon: Puzzle,
    admin: true,
  },
  {
    name: "Models",
    href: "/dashboard/models",
    icon: Sword,
    admin: true,
  },
  {
    name: "Types",
    href: "/dashboard/types",
    icon: Boxes,
    admin: true,
  },
];

export default function DashboardNavigation({ admin }: { admin?: boolean }) {
  const { pathname } = useLocation();
  const navItems = React.useMemo(() => {
    if (admin) {
      return navigation;
    }
    return navigation.filter(({ admin }) => !admin);
  }, [admin]);
  const [hoveredNavItem, setHoveredNavItem] = React.useState<string | null>(
    null
  );
  const id = React.useId();
  // const pathname = "/dashboard";
  return (
    <nav className="flex flex-1 flex-col">
      <ul
        className="-mx-2 space-y-1 group"
        onMouseLeave={() => setHoveredNavItem(null)}
      >
        {navItems.map(({ name, icon: Icon, href }) => {
          const selected = pathname === href;
          return (
            <li
              key={name}
              className="relative"
              style={{
                zIndex: hoveredNavItem === name ? 1 : 2,
              }}
            >
              {selected && (
                <motion.div
                  layoutId={id}
                  className="bg-gray-100 absolute inset-0"
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
                  selected ? "text-gray-700" : "text-gray-500",
                  "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    selected ? "text-gray-700" : "text-gray-500"
                  )}
                  aria-hidden="true"
                />
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

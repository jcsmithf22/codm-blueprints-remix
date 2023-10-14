import { useAtom } from "jotai";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";

import type { PrimitiveAtom } from "jotai";

type PropTypes = {
  title: string;
  description: string;
  trigger?: React.ReactNode;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
  state: PrimitiveAtom<boolean>;
};

export default function Sidebar({
  title,
  description,
  trigger,
  children,
  side = "right",
  className,
  state,
}: PropTypes) {
  const [open, setOpen] = useAtom(state);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className={cn("sm:max-w-md max-w-full w-full", className)}
        side={side}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
          {children}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

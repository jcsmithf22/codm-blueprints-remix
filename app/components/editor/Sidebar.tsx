import { useAtom } from "jotai";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import type { PrimitiveAtom } from "jotai";
import { cn } from "~/lib/utils";

type PropTypes = {
  title: string;
  description: string;
  trigger?: React.ReactNode;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
  atom: PrimitiveAtom<boolean>;
};

export default function Sidebar({
  title,
  description,
  trigger,
  children,
  side = "right",
  className,
  atom,
}: PropTypes) {
  const [open, setOpen] = useAtom(atom);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className={cn("sm:max-w-lg", className)} side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
          {children}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

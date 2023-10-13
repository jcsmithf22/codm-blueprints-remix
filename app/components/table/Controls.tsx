import { type PrimitiveAtom, useSetAtom, atom, useAtomValue } from "jotai";
import { Filter, List, RefreshCw, X } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import type { Sort } from "~/lib/types";
import { Switch } from "../ui/switch";
import { useRevalidator } from "@remix-run/react";

// add support for filtering later. Filters will be stored in atoms for use in the table

const Controls = React.memo(
  ({
    insertAtom,
    sortableColumns,
    sortingAtom,
    classNames = "",
  }: {
    insertAtom: PrimitiveAtom<boolean>;
    sortableColumns?: Array<string>;
    sortingAtom: PrimitiveAtom<Array<Sort>>;
    classNames?: string;
  }) => {
    const setOpen = useSetAtom(insertAtom);

    const { revalidate, state } = useRevalidator();

    return (
      <div
        className={cn(
          classNames,
          "border-b border-bg-200 bg-white fixed top-14 left-0 md:left-64 right-0 h-10 flex gap-x-2 items-center px-4 text-gray-700 z-30"
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-6 font-normal flex gap-x-2 text-xs"
          onClick={() => revalidate()}
        >
          <RefreshCw
            className={cn(
              "h-3.5 w-3.5 text-gray-500",
              state === "loading" && "animate-spin"
            )}
          />
          Refresh
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 font-normal flex gap-x-2 text-xs"
            >
              <Filter className="h-3.5 w-3.5 text-gray-500" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            Filters
          </DropdownMenuContent>
        </DropdownMenu>
        {sortableColumns && (
          <SortingControls
            sortingAtom={sortingAtom}
            sortableColumns={sortableColumns}
          />
        )}
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          onClick={() => setOpen(true)}
          variant="default"
          size="sm"
          className="h-6 font-normal flex gap-x-2 text-xs"
        >
          Insert
        </Button>
      </div>
    );
  }
);

const SortingControls = ({
  sortableColumns,
  sortingAtom,
}: {
  sortingAtom: PrimitiveAtom<Array<Sort>>;
  sortableColumns?: Array<string>;
}) => {
  const setSortingAtom = React.useMemo(
    () =>
      atom(null, (get, set, arg: { id: string; type: string }) => {
        const currentValue = get(sortingAtom).find(
          (item) => item.id === arg.id
        );
        switch (arg.type) {
          case "add": {
            if (currentValue) break;
            set(sortingAtom, [{ id: arg.id, desc: false }]);
            break;
          }
          case "remove": {
            set(sortingAtom, []);
            break;
          }
          case "toggle-direction": {
            set(sortingAtom, [{ id: arg.id, desc: !currentValue?.desc }]);
            break;
          }
        }
      }),
    [sortingAtom]
  );
  const setSorting = useSetAtom(setSortingAtom);
  const sorting = useAtomValue(sortingAtom);

  const sortedBy = sorting[0]?.id || null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 font-normal flex gap-x-2 text-xs"
        >
          <List className="h-3.5 w-3.5 text-gray-500" />
          {sortedBy ? (
            <span className="text-blue-600">Sorted by {sortedBy}</span>
          ) : (
            "Sort"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 p-2 flex flex-col gap-1"
      >
        <p className="text-gray-500 text-xs mb-1">Choose a column to sort by</p>
        {setSorting &&
          sortableColumns?.map((column: string) => {
            const sorted = sorting.find((item) => item.id === column);
            return (
              <Button
                asChild
                size="sm"
                className="font-normal text-xs justify-start px-0"
                variant={sorted ? "secondary" : "ghost"}
                key={column}
              >
                <div className="flex items-center justify-between gap-x-2">
                  <button
                    className="flex-1 text-left h-9 px-3"
                    onClick={() => {
                      setSorting({ id: column, type: "add" });
                    }}
                  >
                    {column}
                  </button>
                  {sorted && (
                    <div className="text-xs text-gray-600 flex items-center">
                      ascending:
                      <Switch
                        about="Sort direction"
                        checked={!sorted.desc}
                        className="ml-1"
                        onCheckedChange={() =>
                          setSorting({
                            id: column,
                            type: "toggle-direction",
                          })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-9 h-9"
                        onClick={() =>
                          setSorting({ id: column, type: "remove" })
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Button>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Controls.displayName = "Controls";
export default Controls;

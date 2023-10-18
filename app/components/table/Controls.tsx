import { type PrimitiveAtom, useSetAtom, atom, useAtomValue } from "jotai";
import { FilterIcon, List, RefreshCw, X } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { cn, focusStyles } from "~/lib/utils";
import type { Filter, Sort } from "~/lib/types";
import { Switch } from "../ui/switch";
import { useRevalidator } from "@remix-run/react";
import { Checkbox } from "../ui/checkbox";

// add support for filtering later. Filters will be stored in atoms for use in the table

const Controls = React.memo(
  ({
    insertAtom,
    sortableColumns,
    sortingAtom,
    filterableColumns,
    filteringAtom,
    classNames = "",
  }: {
    insertAtom: PrimitiveAtom<boolean>;
    sortableColumns?: Array<string>;
    sortingAtom: PrimitiveAtom<Array<Sort>>;
    filterableColumns?: Array<string>;
    filteringAtom: PrimitiveAtom<Array<Filter>>;
    classNames?: string;
  }) => {
    const setOpen = useSetAtom(insertAtom);

    const { revalidate, state } = useRevalidator();

    return (
      <div
        className={cn(
          classNames,
          "border-b bg-background fixed top-14 left-0 md:left-64 right-0 h-10 flex gap-x-2 items-center px-4 text-gray-700 z-30"
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
        {filterableColumns && (
          <FilterControls
            filteringAtom={filteringAtom}
            filterableColumns={filterableColumns}
          />
        )}
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

const FilterControls = ({
  filterableColumns,
  filteringAtom,
}: {
  filterableColumns: Array<string>;
  filteringAtom: PrimitiveAtom<Array<Filter>>;
}) => {
  const setFilteringAtom = React.useMemo(
    () =>
      atom(
        null,
        (get, set, arg: { id: string; type: string; value?: string }) => {
          const otherValues = get(filteringAtom).filter(
            (item) => item.id !== arg.id
          );
          const targetValue = get(filteringAtom).find(
            (item) => item.id === arg.id
          );
          switch (arg.type) {
            case "toggle": {
              if (targetValue) {
                set(filteringAtom, otherValues);
                break;
              }
              set(filteringAtom, [...otherValues, { id: arg.id, value: "" }]);
              break;
            }
            case "update": {
              if (!targetValue) break;
              set(filteringAtom, [
                ...otherValues,
                { id: arg.id, value: arg.value },
              ]);
              break;
            }
          }
        }
      ),
    [filteringAtom]
  );
  const setFiltering = useSetAtom(setFilteringAtom);
  const filtering = useAtomValue(filteringAtom);

  const filteredBy =
    filtering.length > 0
      ? filtering.length > 1
        ? `${filtering.length} columns`
        : filtering[0].id
      : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 font-normal flex gap-x-2 text-xs"
        >
          <FilterIcon className="h-3.5 w-3.5 text-gray-500" />
          {filteredBy ? (
            <span className="text-blue-600">Filtered by {filteredBy}</span>
          ) : (
            "Filter"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 p-2 flex flex-col gap-1"
      >
        <p className="text-gray-500 text-xs mb-1">Choose columns to filter</p>
        {filterableColumns.map((column: string) => {
          const filtered = filtering.find((item) => item.id === column);
          return (
            <Button
              asChild
              size="sm"
              className="font-normal text-xs justify-start px-0"
              variant={filtered ? "secondary" : "ghost"}
              key={column}
            >
              <div className="flex items-center justify-between gap-x-2">
                <button
                  className="flex-1 text-left h-9 px-3 gap-x-2 flex items-center"
                  onClick={() => {
                    setFiltering({ id: column, type: "toggle" });
                  }}
                >
                  <Checkbox className="scale-75" checked={!!filtered} />
                  {column}
                </button>
                {filtered && (
                  <div className="text-xs text-gray-600 flex items-center pr-3">
                    <DebouncedInput
                      className={cn(
                        "h-5 px-1.5 rounded-sm border-input bg-background w-full max-w-[108px]",
                        focusStyles
                      )}
                      placeholder="Enter a value"
                      type="text"
                      value={filtered.value as string}
                      onChange={(value) =>
                        setFiltering({
                          id: column,
                          type: "update",
                          value: value as string,
                        })
                      }
                    />
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

const SortingControls = ({
  sortableColumns,
  sortingAtom,
}: {
  sortingAtom: PrimitiveAtom<Array<Sort>>;
  sortableColumns: Array<string>;
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
        {sortableColumns.map((column: string) => {
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
                      onClick={() => setSorting({ id: column, type: "remove" })}
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

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

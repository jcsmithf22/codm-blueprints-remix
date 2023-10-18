import React from "react";
import { Label } from "../ui/label";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "~/lib/utils";

import type {
  Attachment,
  Model,
  Type,
} from "~/routes/_default.dashboard._admin";

export const SelectTemplate = React.memo(
  ({
    input,
    data,
    setInput,
    type = "Model",
    dataIndex,
    className,
  }: {
    input: number;
    data: Array<Model> | Array<Type>;
    setInput: (value: number) => void;
    type?: "Model" | "Type";
    dataIndex: { [key: string]: number };
    className?: string;
  }) => {
    const [open, setOpen] = React.useState(false);
    const value = data.find((item) => item.id === input)?.name;

    // const dataIndex = React.useMemo(
    //   () =>
    //     data.reduce((acc, item) => {
    //       acc[item.name.toLowerCase()] = item.id;
    //       return acc;
    //     }, {} as { [key: string]: number }),
    //   [data]
    // );

    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const id = React.useId();
    return (
      <div className={className}>
        <Label htmlFor={id}>{type}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={buttonRef}
              id={id}
              variant="outline"
              type="button"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between mt-2 font-normal"
            >
              {value ? value : `Select ${type}...`}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0"
            style={{
              width: buttonRef.current?.getBoundingClientRect().width,
            }}
          >
            <Command>
              <CommandInput
                placeholder={`Search ${data.length} ${type.toLowerCase()}s`}
              />
              <CommandEmpty>No {type.toLowerCase()}s found.</CommandEmpty>
              <CommandGroup className="max-h-[232px] overflow-y-scroll">
                {data.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={(currentValue) => {
                      const currentId = dataIndex[currentValue];
                      setInput(currentId === input ? -1 : currentId);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 w-4 h-4",
                        input === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

SelectTemplate.displayName = "SelectTemplate";

export const SelectAttachment = React.memo(
  ({
    input,
    data,
    setInput,
    type = "muzzle",
    className,
  }: {
    input: number;
    data: Array<Attachment>;
    setInput: (value: number) => void;
    type?: string;
    className?: string;
  }) => {
    const [open, setOpen] = React.useState(false);

    // make type uppercase
    const uppercaseType = type.charAt(0).toUpperCase() + type.slice(1);

    const value = data.find((item) => item.id === input)?.attachment_names
      ?.name;

    const dataIndex = React.useMemo(
      () =>
        data.reduce((acc, item) => {
          acc[item.attachment_names!.name.toLowerCase()] = item.id;
          return acc;
        }, {} as { [key: string]: number }),
      [data]
    );

    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const id = React.useId();
    return (
      <div className={className}>
        <Label htmlFor={id}>{uppercaseType}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={buttonRef}
              id={id}
              variant="outline"
              type="button"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between mt-2"
            >
              {value ? value : `Select ${uppercaseType}...`}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0"
            style={{
              width: buttonRef.current?.getBoundingClientRect().width,
            }}
          >
            <Command>
              <CommandInput placeholder={`Search ${data.length} ${type}s`} />
              <CommandEmpty>No ${type}s found.</CommandEmpty>
              <CommandGroup className="max-h-[232px] overflow-y-scroll">
                {data.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.attachment_names?.name}
                    onSelect={(currentValue) => {
                      const currentId = dataIndex[currentValue];
                      setInput(currentId === input ? -1 : currentId);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 w-4 h-4",
                        input === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.attachment_names?.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

SelectAttachment.displayName = "SelectAttachment";

import { produce } from "immer";
import { CheckIcon, ChevronsUpDownIcon, RefreshCw } from "lucide-react";
import React from "react";
import { flushSync } from "react-dom";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

import { SheetClose } from "../ui/sheet";

import type { Attachment, Model, Type } from "~/routes/_default.dashboard";
import type { Error } from "~/lib/types";
import { useFetcher } from "@remix-run/react";
import type { SetStateAction } from "jotai";

type SingleAttachment = {
  characteristics: {
    pros: string[];
    cons: string[];
  };
  id?: number | undefined;
  model: number;
  type: number;
};

type Action =
  | {
      type: "UpdateModel" | "UpdateType";
      value: number;
    }
  | {
      type: "UpdatePros" | "UpdateCons";
      value: string;
      index: number;
    }
  | {
      type: "AddPro" | "AddCon";
    }
  | {
      type: "RemovePro" | "RemoveCon";
      index: number;
    }
  | {
      type: "Reset";
      value: SingleAttachment;
    };

const reducer = (state: SingleAttachment, action: Action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "UpdateModel": {
        draft.model = action.value;
        break;
      }
      case "UpdateType": {
        draft.type = action.value;
        break;
      }
      case "UpdatePros": {
        draft.characteristics.pros[action.index] = action.value;
        break;
      }
      case "UpdateCons": {
        draft.characteristics.cons[action.index] = action.value;
        break;
      }
      case "AddPro": {
        draft.characteristics.pros.push("");
        break;
      }
      case "AddCon": {
        draft.characteristics.cons.push("");
        break;
      }
      case "RemovePro": {
        draft.characteristics.pros.splice(action.index, 1);
        break;
      }
      case "RemoveCon": {
        draft.characteristics.cons.splice(action.index, 1);
        break;
      }
      case "Reset": {
        return action.value;
      }
    }
  });
};

export default function AttachmentEditor({
  id,
  attachment,
  models,
  types,
  setOpen,
}: {
  id?: number;
  attachment?: Attachment;
  models: Array<Model>;
  types: Array<Type>;
  setOpen: (args_0: SetStateAction<boolean>) => void;
}) {
  const defaultAttachment: SingleAttachment = attachment
    ? ({
        type: attachment.type,
        model: attachment.model,
        characteristics: attachment.characteristics,
      } as SingleAttachment)
    : {
        type: -1,
        model: -1,
        characteristics: {
          pros: [],
          cons: [],
        },
      };

  const [formData, dispatch] = React.useReducer(reducer, defaultAttachment);

  const fetcher = useFetcher<{ success: boolean; errors: Error }>();

  const error = fetcher.data?.errors;
  const success = fetcher.data?.success;
  const pending = fetcher.state !== "idle";

  React.useEffect(() => {
    if (success) {
      setOpen(false);
    }
  }, [setOpen, success]);

  // ref for the last added input in the pros and cons
  const currentConInput = React.useRef<HTMLInputElement>(null);
  const currentProInput = React.useRef<HTMLInputElement>(null);

  // index of the last item in the pros and cons arrays
  const lastCon = formData ? formData.characteristics.cons.length - 1 : -1;
  const lastPro = formData ? formData.characteristics.pros.length - 1 : -1;

  const typeNameIndex = React.useMemo(
    () =>
      types.reduce((acc, type) => {
        acc[type.name.toLowerCase()] = type;
        return acc;
      }, {} as { [key: string]: (typeof types)[0] }),
    [types]
  );

  const modelNameIndex = React.useMemo(
    () =>
      models.reduce((acc, model) => {
        acc[model.name.toLowerCase()] = model;
        return acc;
      }, {} as { [key: string]: (typeof models)[0] }),
    [models]
  );

  const setType = React.useCallback(
    (value: string) => {
      const attachmentId = typeNameIndex[value.toLowerCase()]?.id || -1;
      dispatch({ type: "UpdateType", value: attachmentId });
    },
    [typeNameIndex]
  );

  const setModel = React.useCallback(
    (value: string) => {
      const modelId = modelNameIndex[value.toLowerCase()]?.id || -1;
      dispatch({ type: "UpdateModel", value: modelId });
    },
    [modelNameIndex]
  );

  return (
    <fetcher.Form method={"POST"} action="/api/attachments">
      <input type="hidden" name="id" value={id} />
      <div className="mt-10 flex flex-col gap-y-6">
        <div>
          <input type="hidden" name="model" value={formData.model} />
          <SelectTemplate
            input={formData.model}
            data={models}
            setInput={setModel}
          />

          {error?.model && (
            <p className="text-sm text-red-500">{error.model}</p>
          )}
        </div>

        <div>
          <input type="hidden" name="type" value={formData.type} />
          <SelectTemplate
            input={formData.type}
            data={types}
            setInput={setType}
          />

          {error?.type && <p className="text-sm text-red-500">{error.type}</p>}
        </div>

        <div className="">
          <input
            type="hidden"
            name="pros"
            value={formData.characteristics.pros}
          />
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="pro-0"
          >
            Pros
          </label>
          <div className="mt-2">
            {formData.characteristics.pros.map((pro, i) => (
              <div className="flex gap-x-2 mb-2" key={i}>
                <Input
                  ref={i === lastPro ? currentProInput : undefined}
                  type="text"
                  id={`pro-${i}`}
                  // name={`pro-${i}`}
                  value={pro}
                  onChange={(e) =>
                    dispatch({
                      type: "UpdatePros",
                      value: e.target.value,
                      index: i,
                    })
                  }
                />
                <Button
                  className="px-2"
                  variant="outline"
                  type="button"
                  onClick={() => dispatch({ type: "RemovePro", index: i })}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={() => {
              flushSync(() => {
                dispatch({ type: "AddPro" });
              });
              currentProInput.current?.focus();
            }}
          >
            New
          </Button>
        </div>

        <div className="">
          <input
            type="hidden"
            name="cons"
            value={formData.characteristics.cons}
          />
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="con-0"
          >
            Cons
          </label>
          <div className="mt-2">
            {formData.characteristics.cons.map((con, i) => (
              <div className="flex gap-x-2 mb-2" key={i}>
                <Input
                  ref={i === lastCon ? currentConInput : undefined}
                  type="text"
                  id={`con-${i}`}
                  // name={`con-${i}`}
                  value={con}
                  onChange={(e) =>
                    dispatch({
                      type: "UpdateCons",
                      value: e.target.value,
                      index: i,
                    })
                  }
                />
                <Button
                  className="px-2"
                  variant="outline"
                  type="button"
                  onClick={() => dispatch({ type: "RemoveCon", index: i })}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              flushSync(() => {
                dispatch({ type: "AddCon" });
              });
              currentConInput.current?.focus();
            }}
          >
            New
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "mt-6 flex items-center justify-end w-full",
          id && "justify-between"
        )}
      >
        {id && (
          <Button
            type="submit"
            name="intent"
            value="delete"
            variant="destructive"
          >
            Delete
          </Button>
        )}
        <div className="flex gap-x-2">
          <SheetClose asChild>
            <Button
              variant="ghost"
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </Button>
          </SheetClose>
          <Button
            className="flex gap-x-2"
            name="intent"
            value={id ? "update" : "insert"}
            type="submit"
          >
            {pending && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            Submit
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
}

const SelectTemplate = React.memo(
  ({
    input,
    data,
    setInput,
  }: {
    input: number;
    data: Array<Model> | Array<Type>;
    setInput: (value: string) => void;
  }) => {
    const [open, setOpen] = React.useState(false);
    const value = data.find((item) => item.id === input)?.name;
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const id = React.useId();
    return (
      <div className="">
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Model
        </label>
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
              {value ? value : "Select Model..."}
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
              <CommandInput placeholder={`Search ${data.length} models`} />
              <CommandEmpty>No attachments found.</CommandEmpty>
              <CommandGroup className="max-h-[232px] overflow-y-scroll">
                {data.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={(currentValue) => {
                      setInput(
                        currentValue === value?.toLowerCase()
                          ? ""
                          : currentValue
                      );
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

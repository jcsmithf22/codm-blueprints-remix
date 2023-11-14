import React from "react";
import { SelectTemplate } from "./Select";
import { produce } from "immer";
import { RefreshCw } from "lucide-react";
import { flushSync } from "react-dom";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "../ui/label";
import { cn } from "~/lib/utils";

import { SheetClose } from "../ui/sheet";

import type {
  Attachment,
  Model,
  Type,
} from "~/routes/_default.dashboard._admin";
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

const errorMessages: {
  [key: string]: { message: string; field: string } | undefined;
} = {
  "42501": {
    message: "You do not have permission to perform this action",
    field: "server",
  },
};

enum errorCodes {
  PERMISSION = "42501",
}

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

  const modelIndex = React.useMemo(
    () =>
      models.reduce((acc, item) => {
        acc[item.name.toLowerCase()] = item.id;
        return acc;
      }, {} as { [key: string]: number }),
    [models]
  );

  const typeIndex = React.useMemo(
    () =>
      types.reduce((acc, item) => {
        acc[item.name.toLowerCase()] = item.id;
        return acc;
      }, {} as { [key: string]: number }),
    [types]
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
            setInput={(value) =>
              dispatch({ type: "UpdateModel", value: value })
            }
            dataIndex={modelIndex}
          />

          {error?.model && (
            <p className="text-sm mt-2 text-red-500">{error.model}</p>
          )}
        </div>

        <div>
          <input type="hidden" name="type" value={formData.type} />
          <SelectTemplate
            input={formData.type}
            data={types}
            setInput={(value) => dispatch({ type: "UpdateType", value: value })}
            type="Type"
            dataIndex={typeIndex}
          />

          {error?.type && (
            <p className="text-sm mt-2 text-red-500">{error.type}</p>
          )}
        </div>

        <div className="">
          <input
            type="hidden"
            name="pros"
            value={formData.characteristics.pros}
          />
          <Label htmlFor="pro-0">Pros</Label>
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
          <Label htmlFor="con-0">Cons</Label>
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
      {error?.server?.code === errorCodes.PERMISSION && (
        <p className="text-center text-sm text-red-500 my-6">
          {errorMessages[error.server.code]?.message}
        </p>
      )}
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

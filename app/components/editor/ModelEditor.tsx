import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "../ui/label";
import { gunTypes } from "~/lib/types";
import { cn } from "~/lib/utils";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SheetClose } from "../ui/sheet";

import type { Database } from "~/types/supabase";
import { useFetcher } from "@remix-run/react";
import type { Error } from "~/lib/types";
import type { SetStateAction } from "jotai";
import { RefreshCw } from "lucide-react";

type Model = Database["public"]["Tables"]["models"]["Insert"];

type Action =
  | {
      type: "UpdateName" | "UpdateType";
      value: string;
    }
  | {
      type: "Reset";
      value: Model;
    };

const reducer = (state: Model, action: Action) => {
  switch (action.type) {
    case "UpdateName": {
      return { ...state, name: action.value };
    }
    case "UpdateType": {
      return { ...state, type: action.value };
    }
    case "Reset": {
      return action.value;
    }
  }
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

export default function ModelEditor({
  id,
  model,
  setOpen,
}: {
  id?: number;
  model?: Model;
  setOpen: (args_0: SetStateAction<boolean>) => void;
}) {
  const [formData, dispatch] = React.useReducer(
    reducer,
    model || {
      name: "",
      type: "assault",
    }
  );

  const fetcher = useFetcher<{ success: boolean; errors: Error }>();

  const error = fetcher.data?.errors;
  const success = fetcher.data?.success;
  const pending = fetcher.state !== "idle";

  React.useEffect(() => {
    if (success) {
      setOpen(false);
    }
  }, [setOpen, success]);

  return (
    <fetcher.Form method={"POST"} action="/api/models">
      <input type="hidden" name="id" value={id} />
      <div className="mt-10 flex flex-col gap-y-6">
        <div className="">
          <Label htmlFor="type">Type</Label>
          <div className="mt-2">
            <Select
              name="type"
              onValueChange={(value) => dispatch({ type: "UpdateType", value })}
              defaultValue={formData.type}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a weapon category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(gunTypes).map((key) => (
                  <SelectItem value={key} key={key}>
                    {gunTypes[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="">
          <Label htmlFor="name">Name</Label>
          <div className="mt-2">
            <Input
              name="name"
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                dispatch({ type: "UpdateName", value: e.target.value })
              }
            />
          </div>
          {error?.name && (
            <p className="text-sm mt-2 text-red-500">{error.name}</p>
          )}
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

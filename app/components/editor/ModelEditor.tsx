import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
          <label
            htmlFor="type"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Type
          </label>
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
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="name"
          >
            Name
          </label>
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
          {error?.name && <p className="text-sm text-red-500">{error.name}</p>}
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
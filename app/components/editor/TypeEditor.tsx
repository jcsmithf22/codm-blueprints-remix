import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { deleteItem, getItem, insertItem, updateItem } from "~/lib/api";
import { attachmentTypes } from "~/lib/types";
import { cn } from "~/lib/utils";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SheetClose } from "../ui/sheet";

import type { Database } from "~/types/supabase";

type Type = Database["public"]["Tables"]["attachment_names"]["Insert"];

type Action =
  | {
      type: "UpdateName" | "UpdateType";
      value: string;
    }
  | {
      type: "Reset";
      value: Type;
    };

const reducer = (state: Type, action: Action) => {
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

// const errorMessages: {
//   [key: string]: { message: string; field: string } | undefined;
// } = {
//   "23505": {
//     message: "A model with that name already exists",
//     field: "name",
//   },
// };

type Error = {
  name?: string;
  server?: string;
};

export default function TypeEditor({ id, type }: { id?: number; type?: Type }) {
  const [formData, dispatch] = React.useReducer(
    reducer,
    type || {
      name: "",
      type: "assault",
    }
  );

  const [error, setError] = React.useState<Error | null>(null);

  const handleSubmit = async () => {
    if (!id) {
      // add new model
      return;
    }

    // update model
  };

  const handleDelete = async (id: number) => {
    // delete model
  };

  return (
    <form className="">
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
              onValueChange={(value) => dispatch({ type: "UpdateType", value })}
              defaultValue={formData.type}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select an weapon category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(attachmentTypes).map((key) => (
                  <SelectItem value={key} key={key}>
                    {attachmentTypes[key]}
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
            type="button"
            variant="destructive"
            onClick={() => handleDelete(id)}
          >
            Delete
          </Button>
        )}
        <div className="space-x-2">
          <SheetClose asChild>
            <Button
              variant="ghost"
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              // onClick={() => console.log("add sidebar state atom here")}
            >
              Cancel
            </Button>
          </SheetClose>
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
}

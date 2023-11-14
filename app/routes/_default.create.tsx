import {
  type ActionFunctionArgs,
  defer,
  json,
  type LoaderFunctionArgs,
  redirect,
} from "@vercel/remix";
import { getProtectedSession } from "~/session";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Plus, AlertCircle } from "lucide-react";

import { SelectTemplate } from "~/components/editor/Select";
import { produce } from "immer";

import { attachmentTypes } from "~/lib/types";

import { getItems, getAttachments } from "~/lib/api";
import type { Attachment, Model } from "./_default.dashboard._admin";
import { Await, Form, useActionData, useLoaderData } from "@remix-run/react";
import React, { Suspense } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import type { Database } from "~/types/supabase";
import type { Error } from "~/lib/types";
import type { PostgrestError } from "@supabase/supabase-js";

type Loadout = Database["public"]["Tables"]["loadouts"]["Insert"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, response } = await getProtectedSession(request);

  const models = getItems<Model>(supabase, "models");
  const attachments = getAttachments(supabase) as Promise<Array<Attachment>>;

  const data = Promise.all([models, attachments]);

  return defer({ data }, { headers: response.headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  let loadout: { [key: string]: string | number } = {
    muzzle: Number(formData.get("muzzle")),
    barrel: Number(formData.get("barrel")),
    optic: Number(formData.get("optic")),
    stock: Number(formData.get("stock")),
    grip: Number(formData.get("grip")),
    magazine: Number(formData.get("magazine")),
    underbarrel: Number(formData.get("underbarrel")),
    laser: Number(formData.get("laser")),
    perk: Number(formData.get("perk")),
  };

  const objectFilter = (
    obj: typeof loadout,
    predicate: (value: string) => boolean
  ) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, value]) => predicate(value.toString()))
    );

  loadout = objectFilter(loadout, (value) => value !== "-1");

  const errors: Error | null = {};

  if (Object.keys(loadout).length > 5) {
    errors.attachment = "You can only select up to 5 attachments";
  }

  loadout.model = Number(formData.get("model"));
  loadout.tags = formData.get("tags") as string;
  loadout.name = formData.get("name") as string;

  if (loadout.model === -1) {
    errors.model = "Please select a model";
  }
  if (loadout.name === "") {
    errors.name = "Please enter a name";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  const { supabase, response, uuid } = await getProtectedSession(request);

  const { data: user_data } = await supabase
    .from("profiles")
    .select(`username`)
    .eq("id", uuid as string)
    .single();

  const data = loadout as Loadout;
  data.username = user_data?.username;

  try {
    await supabase.from("loadouts").insert(data).throwOnError();
  } catch (error) {
    errors.server = error as PostgrestError;
    return json({ errors }, { headers: response.headers });
  }

  // return json({ success: true, errors: null }, { headers: response.headers });
  return redirect("/dashboard/loadouts", { headers: response.headers });
};

// Next step, add submiting indicator on submit button

export default function Page() {
  const { data } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ errors: Error }>();
  const errors = actionData?.errors || null;

  return (
    <Suspense fallback="loading">
      <Await resolve={data}>
        {([models, attachments]) => (
          <Form
            method="post"
            className="pt-14 md:pb-8 md:pt-[88px] w-full md:max-w-2xl mx-auto animate-in"
          >
            <Card className="rounded-none border-0 border-b md:border md:rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Create new loadout
                </CardTitle>
                <CardDescription>
                  Choose up to five attachments and add relevant tags.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateForm
                  models={models}
                  attachments={attachments}
                  errors={errors}
                />
              </CardContent>
              <CardFooter className="justify-end gap-x-2">
                {errors && (
                  <div className="border border-red-600 text-red-600 rounded-md bg-red-50 px-3 py-2 h-10 flex gap-x-2 items-center">
                    <AlertCircle className="w-5 h-5" />
                    {Object.keys(errors).length} error
                    {Object.keys(errors).length > 1 && "s"}
                  </div>
                )}
                <Button>Create</Button>
              </CardFooter>
            </Card>
          </Form>
        )}
      </Await>
    </Suspense>
  );
}

interface CreateFormProps {
  models: Array<Model>;
  attachments: Array<Attachment>;
  errors: Error | null;
}

const defaultAttachments: { [key: string]: number } = {
  muzzle: -1,
  barrel: -1,
  optic: -1,
  stock: -1,
  grip: -1,
  magazine: -1,
  underbarrel: -1,
  laser: -1,
  perk: -1,
};

type FormData = {
  name: string;
  model: number;
  attachments: typeof defaultAttachments;
  tags: Array<string>;
};

const CreateForm = ({ models, attachments, errors }: CreateFormProps) => {
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    model: -1,
    attachments: defaultAttachments,
    tags: [],
  });

  const [tagInput, setTagInput] = React.useState("");

  const modelIndex = React.useMemo(
    () =>
      models.reduce((acc, item) => {
        acc[item.name.toLowerCase()] = item.id;
        return acc;
      }, {} as { [key: string]: number }),
    [models]
  );

  const availableAttachments = React.useMemo(
    () =>
      attachments.filter((attachment) => attachment.model === formData.model),
    [attachments, formData.model]
  );

  const selectedNumber = Object.keys(formData.attachments).filter(
    (key) => formData.attachments[key] !== -1
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
      <div className="sm:col-span-4">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-2"
        />
        <div className="mt-2 text-muted-foreground text-[0.8rem]">
          {errors?.name ? (
            <span className="text-red-600">{errors.name}</span>
          ) : (
            "Give your loadout a name."
          )}
        </div>
      </div>
      <div className="sm:col-span-4">
        <input type="hidden" name="model" value={formData.model} />
        <SelectTemplate
          data={models}
          input={formData.model}
          dataIndex={modelIndex}
          setInput={(value) => {
            setFormData({
              ...formData,
              model: value,
              attachments: defaultAttachments,
            });
          }}
        />
        <div className="mt-2 text-muted-foreground text-[0.8rem]">
          {errors?.model ? (
            <span className="text-red-600">{errors.model}</span>
          ) : (
            "Choose the gun model for your new loadout."
          )}
        </div>
      </div>
      <Separator className="sm:col-span-6" />
      <div className="sm:col-span-6">
        <div className="pb-6 space-y-1.5">
          <h4>
            Attachments{" "}
            <span className={selectedNumber > 5 ? "text-red-500" : ""}>
              ({selectedNumber}/5)
            </span>
          </h4>
          <p className="text-muted-foreground text-sm">
            {errors?.attachment && selectedNumber > 5 ? (
              <span className="text-red-600">
                Remove {selectedNumber - 5} attachment
                {selectedNumber - 5 > 1 ? "s" : ""}.
              </span>
            ) : (
              "Choose up to 5 attachments."
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-y-4 gap-x-6">
          {Object.keys(attachmentTypes).map((type) => {
            const attachments = availableAttachments.filter(
              (attachment) => attachment.attachment_names?.type === type
            );
            const height = Math.min(attachments.length, 7) * 32 + 32;
            return (
              <div key={type} className="sm:col-span-3">
                <Label htmlFor={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Label>
                <Select
                  name={type}
                  onValueChange={(value) =>
                    setFormData(
                      produce(formData, (draft) => {
                        draft.attachments[type] = parseInt(value);
                      })
                    )
                  }
                  value={formData.attachments[type].toString()}
                >
                  <SelectTrigger id={type} className="mt-2">
                    <SelectValue placeholder={`Select ${type}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea
                      style={{
                        height: `${height}px`,
                      }}
                    >
                      <SelectItem value="-1">None</SelectItem>
                      {attachments.map((attachment) => (
                        <SelectItem
                          value={attachment.id.toString()}
                          key={attachment.id}
                        >
                          {attachment.attachment_names?.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </div>
      <Separator className="sm:col-span-6" />
      <div className="sm:col-span-6 grid grid-cols-1 sm:grid-cols-6">
        <input type="hidden" name="tags" value={formData.tags.toString()} />
        <div className="sm:col-span-4">
          <label htmlFor="tags">Tags</label>
          <div className="relative">
            <Input
              className="pr-10 mt-2"
              id="tags"
              name="tags-input"
              placeholder="Awesome"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setTagInput("");
                  if (formData.tags.includes(tagInput) || tagInput === "")
                    return;
                  setFormData(
                    produce(formData, (draft) => {
                      draft.tags.push(tagInput);
                    })
                  );
                }
              }}
            />

            <Button
              type="button"
              className="absolute inset-y-2 right-2 h-6 w-6"
              variant="secondary"
              size="icon"
              onClick={() => {
                setTagInput("");
                if (formData.tags.includes(tagInput) || tagInput === "") return;
                setFormData(
                  produce(formData, (draft) => {
                    draft.tags.push(tagInput);
                  })
                );
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-1 mt-2 sm:col-span-6 flex-wrap">
          {formData.tags.length > 0 ? (
            formData.tags.map((tag) => (
              <Badge
                tabIndex={0}
                key={tag}
                className="cursor-pointer"
                onClick={() =>
                  setFormData(
                    produce(formData, (draft) => {
                      draft.tags = draft.tags.filter((t) => t !== tag);
                    })
                  )
                }
              >
                {tag}
              </Badge>
            ))
          ) : (
            <Badge variant={"outline"}>No tags</Badge>
          )}
        </div>
        <div className="mt-2 text-muted-foreground text-[0.8rem] sm:col-span-4">
          Add tags relevant to the loadout.
        </div>
      </div>
    </div>
  );
};

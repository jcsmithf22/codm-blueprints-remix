import React from "react";
import type { Model, Attachment } from "~/routes/_default.dashboard._admin";
import type { Database } from "~/types/supabase";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useFetcher, Link } from "@remix-run/react";
import { Skeleton } from "./ui/skeleton";

type Loadout = Database["public"]["Tables"]["loadouts"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type LoadoutRating = {
  id: string;
  rating: number;
  loadouts: Loadout | null;
};

type LoadoutRatingNonNull = {
  id: string;
  rating: number;
  loadouts: Loadout;
};

const attachmentKeys = [
  "muzzle",
  "barrel",
  "optic",
  "stock",
  "grip",
  "magazine",
  "underbarrel",
  "laser",
  "perk",
];

interface LoadoutDisplayProps {
  models: Array<Model> | null;
  attachments: Array<Attachment> | null;
  unfilteredLoadouts: Array<LoadoutRating> | null;
  profile: Profile | null;
}

export default function LoadoutDisplay({
  models,
  attachments,
  unfilteredLoadouts,
  profile,
}: LoadoutDisplayProps) {
  // filter loadouts from loadout_rating table that do not have an associated loadout row
  const loadouts = unfilteredLoadouts?.filter(
    (loadout) => loadout.loadouts !== null
  ) as Array<LoadoutRatingNonNull> | null;

  const isSignedIn = !!profile;
  const likedPosts = profile?.liked_posts || "";
  const user = profile?.id || "";

  const modelIndex = React.useMemo(
    () =>
      models?.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {} as Record<number, string>),
    [models]
  );

  const attachmentIndex = React.useMemo(
    () =>
      attachments?.reduce((acc, item) => {
        acc[item.id] = item.attachment_names!.name;
        return acc;
      }, {} as Record<number, string>),
    [attachments]
  );

  const sortedLoadouts = loadouts?.sort((a, b) => {
    if (!a.loadouts || !b.loadouts) return 0;
    if (a.loadouts?.created_at < b.loadouts?.created_at) {
      return 1;
    }
    if (a.loadouts?.created_at > b.loadouts?.created_at) {
      return -1;
    }
    return 0;
  });

  if (!sortedLoadouts || !modelIndex || !attachmentIndex) {
    return <div className="pt-20">Error loading data</div>;
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 sm:gap-8 p-4 sm:p-0 sm:py-8 animate-in">
      {sortedLoadouts.length > 0 ? (
        sortedLoadouts.map((loadout) => {
          const model = modelIndex[loadout.loadouts.model];
          const attachments = Object.entries(loadout.loadouts)
            .filter(([key, value]) => attachmentKeys.includes(key) && value)
            .map(([key, value]) => ({
              key,
              name: attachmentIndex[Number(value)],
            }));
          return (
            <LoadoutCard
              key={loadout.id}
              loadout={loadout}
              model={model}
              attachments={attachments}
              likedPosts={likedPosts}
              isSignedIn={isSignedIn}
              user={user}
            />
          );
        })
      ) : (
        <Card className="w-full md:max-w-2xl mx-auto">
          <CardContent className="pt-6 flex justify-between items-center">
            No loadouts found. Be the first to create one!
            <Button asChild>
              <Link to="/create">Create</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface LoadoutCardProps {
  loadout: LoadoutRatingNonNull;
  likedPosts: string;
  isSignedIn: boolean;
  user: string | null;
  model: string;
  attachments: Array<{ key: string; name: string }>;
}

const LoadoutCard = ({
  loadout,
  likedPosts,
  isSignedIn,
  user,
  model,
  attachments,
}: LoadoutCardProps) => {
  const fetcher = useFetcher();
  const id = loadout.id;
  const editable = isSignedIn && user === loadout.loadouts.user;
  const liked = likedPosts.includes(id);
  const optimisticLiked = fetcher.formData
    ? fetcher.formData?.get(id) === "true"
    : liked;
  const optimisticRating = fetcher.formData
    ? fetcher.formData?.get(id) === "true"
      ? 1
      : -1
    : 0;
  const tags = loadout.loadouts.tags?.split(",") || null;
  const disabled = fetcher.state !== "idle" || !isSignedIn;
  return (
    <Card className="w-full md:max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>
            {model} -{" "}
            <span className="font-normal">{loadout.loadouts.name}</span>
          </div>
          <div className="text-muted-foreground font-normal text-base">
            {loadout.loadouts.username}
          </div>
        </CardTitle>
        {tags && (
          <div className="flex gap-1 pt-1 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-2">
          {attachments.length > 0 ? (
            attachments.map(({ key, name }) => (
              <div
                key={key}
                className="w-full border rounded-md p-2 px-3 bg-muted flex flex-col gap-y-1 hover:-translate-y-1 hover:shadow-md transition-all"
              >
                <div className="text-sm font-light">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </div>
                <div>{name}</div>
              </div>
            ))
          ) : (
            <div className="w-full text-center">No attachments</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-x-2 text-sm">
            <span className="text-muted-foreground">
              {new Date(loadout.loadouts.created_at).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
            {editable && (
              <Link to="/create" className="hover:underline">
                Edit
              </Link>
            )}
          </div>
          <fetcher.Form
            action="/api/like"
            method={"POST"}
            className="rounded-full border flex gap-x-2 items-center pr-3"
          >
            <input type="hidden" name="post" value={loadout.id} />
            <Button
              type="submit"
              size={"icon"}
              className="rounded-full h-8 w-8 disabled:opacity-100"
              value={liked ? "false" : "true"}
              name={id}
              disabled={disabled}
            >
              <Heart
                className="w-5 h-5 mt-0.5"
                fill={optimisticLiked ? "red" : "inherit"}
              />
            </Button>
            <span className="font-mono">
              {loadout.rating + optimisticRating}
            </span>
          </fetcher.Form>
        </div>
      </CardFooter>
    </Card>
  );
};

// Next step, add loading state for cards

export const LoadingCard = () => {
  return (
    <div className="w-full flex flex-col items-center gap-8 sm:py-8">
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="flex flex-col gap-y-0.5">
          <Skeleton className="w-1/2 h-7" />
          <Skeleton className="w-3/4 h-5" />
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
        </CardContent>
        <CardFooter>
          <Skeleton className="w-1/3 h-5" />
        </CardFooter>
      </Card>
    </div>
  );
};

export const LoadingSpinner = () => {
  return <div>Loading...</div>;
};

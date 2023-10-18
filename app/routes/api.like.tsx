import { json, type ActionFunctionArgs } from "@vercel/remix";
import { getRating, getUserProfile } from "~/lib/api";
import { getProtectedSession } from "~/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const post = formData.get("post") as string;
  if (!post) {
    return json({ success: false });
  }

  const { supabase, response, uuid } = await getProtectedSession(request);

  const user_profile_promise = getUserProfile(supabase, uuid!);
  const rating_promise = getRating(supabase, post);

  const [user_profile, rating] = await Promise.all([
    user_profile_promise,
    rating_promise,
  ]);

  if (!user_profile) {
    return json({ success: false }, { headers: response.headers });
  }

  if (!rating) {
    return json({ success: false }, { headers: response.headers });
  }

  const liked = user_profile.liked_posts?.includes(post) || false;
  const addedPost = user_profile.liked_posts
    ? user_profile.liked_posts + "," + post
    : post;
  const filteredLikes = user_profile.liked_posts
    ?.split(",")
    .filter((id) => id !== post);

  console.log(liked);

  if (liked) {
    await Promise.all([
      supabase
        .from("loadout_ratings")
        .update({
          rating: rating.rating - 1,
        })
        .eq("id", post),
      supabase
        .from("profiles")
        .update({
          liked_posts: filteredLikes?.toString(),
        })
        .eq("id", uuid!),
    ]);
  } else {
    await Promise.all([
      supabase
        .from("loadout_ratings")
        .update({
          rating: rating.rating + 1,
        })
        .eq("id", post),
      supabase
        .from("profiles")
        .update({
          liked_posts: addedPost,
        })
        .eq("id", uuid!),
    ]);
  }

  return json({ success: true }, { headers: response.headers });
};

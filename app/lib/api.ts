import type { Database } from "~/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getItem<T>(
  supabase: SupabaseClient<Database>,
  table: string,
  id: string
) {
  const { data: item } = (await supabase
    .from(table)
    .select()
    .eq("id", id)
    .single()
    .throwOnError()) as {
    data: T;
  };
  return item;
}

export async function getItems<T>(
  supabase: SupabaseClient<Database>,
  table: string
) {
  const { data: items } = (await supabase
    .from(table)
    .select()
    .order("id")
    .throwOnError()) as {
    data: Array<T>;
  };
  return items;
}

export async function updateItem<T>(
  supabase: SupabaseClient<Database>,
  table: string,
  id: string,
  item: T
) {
  const { data, error } = await supabase
    .from(table)
    .update(item)
    .eq("id", id)
    .throwOnError();
  return { data, error };
}

export async function deleteItem(
  supabase: SupabaseClient<Database>,
  table: string,
  id: string
) {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .throwOnError();
  return { data, error };
}

export async function getAttachments(supabase: SupabaseClient<Database>) {
  const { data: attachments } = await supabase
    .from("attachments")
    .select(
      `id, model, type, attachment_names (name, type), models (id, name), characteristics`
    )
    .order("id")
    .throwOnError();
  return attachments;
}

export async function getUsersLoadouts(
  supabase: SupabaseClient<Database>,
  uuid: string
) {
  const { data } = await supabase
    .from("loadout_ratings")
    .select("*, loadouts(*)")
    .eq("loadouts.user", uuid)
    .throwOnError();
  return data;
}

export async function getLoadouts(supabase: SupabaseClient<Database>) {
  const { data } = await supabase
    .from("loadout_ratings")
    .select("*, loadouts(*)")
    .throwOnError();
  return data;
}

export async function getUserProfile(
  supabase: SupabaseClient<Database>,
  uuid: string
) {
  const { data } = await supabase
    .from("profiles")
    .select()
    .eq("id", uuid)
    .single()
    .throwOnError();
  return data;
}

export async function getRating(
  supabase: SupabaseClient<Database>,
  id: string
) {
  const { data } = await supabase
    .from("loadout_ratings")
    .select("rating")
    .eq("id", id)
    .single();
  return data;
}

export async function insertItem<T>(
  supabase: SupabaseClient<Database>,
  table: string,
  item: T
) {
  const { data, error } = await supabase
    .from(table)
    .insert([item])
    .throwOnError();
  return { data, error };
}

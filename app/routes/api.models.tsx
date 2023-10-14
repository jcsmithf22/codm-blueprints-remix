import type { PostgrestError } from "@supabase/supabase-js";
import { json, type ActionFunctionArgs } from "@vercel/remix";
import { deleteItem, insertItem, updateItem } from "~/lib/api";
import { getProtectedSession } from "~/session";
import type { Error } from "~/lib/types";
import type { Database } from "~/types/supabase";

type ModelInsert = Database["public"]["Tables"]["models"]["Insert"];

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data: ModelInsert = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
  };

  const intent = formData.get("intent") as string;

  const errors: Error = {};
  if (!data.type || data.type.trim() === "")
    errors.type = "Select attachment type";
  if (!data.name || data.name.trim() === "") errors.name = "Enter weapon name";

  if (Object.keys(errors).length > 0) {
    return json({ success: false, errors });
  }

  const { supabase, response } = await getProtectedSession(request);

  switch (intent) {
    case "insert": {
      try {
        await insertItem<ModelInsert>(supabase, "models", data);
        return json(
          { success: true, error: null },
          { headers: response.headers }
        );
      } catch (error) {
        errors.server = error as PostgrestError;
        return json({ success: false, errors }, { headers: response.headers });
      }
    }
    case "update": {
      data.id = Number(formData.get("id"));
      if (!data.id) {
        errors.request = "Invalid attachment id";
        return json({ success: false, errors }, { headers: response.headers });
      }
      try {
        await updateItem<ModelInsert>(
          supabase,
          "models",
          String(data.id),
          data
        );
        return json(
          { success: true, error: null },
          { headers: response.headers }
        );
      } catch (error) {
        errors.server = error as PostgrestError;
        return json({ success: false, errors }, { headers: response.headers });
      }
    }
    case "delete": {
      data.id = Number(formData.get("id"));
      if (!data.id) {
        errors.request = "Invalid attachment id";
        return json({ success: false, errors }, { headers: response.headers });
      }
      try {
        await deleteItem(supabase, "models", String(data.id));
        return json(
          { success: true, error: null },
          { headers: response.headers }
        );
      } catch (error) {
        errors.server = error as PostgrestError;
        return json({ success: false, errors }, { headers: response.headers });
      }
    }
  }

  errors.request = "Invalid submission type";
  return json({ success: false, errors }, { headers: response.headers });
}

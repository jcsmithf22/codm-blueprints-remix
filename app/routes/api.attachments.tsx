import type { PostgrestError } from "@supabase/supabase-js";
import { json, type ActionFunctionArgs } from "@vercel/remix";
import { deleteItem, insertItem, updateItem } from "~/lib/api";
import { getProtectedSession } from "~/session";
import type { Error } from "~/lib/types";
import type { Database } from "~/types/supabase";

type AttachmentInsert = Database["public"]["Tables"]["attachments"]["Insert"];

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const pros = (formData.get("pros") as string)
    .split(",")
    .filter((pro) => pro.length > 0);
  const cons = (formData.get("cons") as string)
    .split(",")
    .filter((con) => con.length > 0);
  const data: AttachmentInsert = {
    type: Number(formData.get("type")),
    model: Number(formData.get("model")),
    characteristics: {
      pros,
      cons,
    },
  };

  const intent = formData.get("intent") as string;

  const errors: Error = {};
  if (!data.type || data.type < 0) errors.type = "Select attachment type";
  if (!data.model || data.model < 0) errors.model = "Select attachment model";

  if (Object.keys(errors).length > 0) {
    return json({ success: false, errors });
  }

  const { supabase, response } = await getProtectedSession(request);

  switch (intent) {
    case "insert": {
      try {
        await insertItem<AttachmentInsert>(supabase, "attachments", data);
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
        await updateItem<AttachmentInsert>(
          supabase,
          "attachments",
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
        await deleteItem(supabase, "attachments", String(data.id));
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

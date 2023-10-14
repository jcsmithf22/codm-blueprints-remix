import { atom, useAtom, useSetAtom } from "jotai";
import React from "react";
import AttachmentEditor from "~/components/editor/AttachmentEditor";
import Sidebar from "~/components/editor/Sidebar";
import { attachmentColumns } from "~/components/table/columns";
import Controls from "~/components/table/Controls";
import DataTable from "~/components/table/DataTable";

import { useOutletContext } from "@remix-run/react";

import type { Attachment, Model, Type } from "./_default.dashboard";
import type { Database } from "~/types/supabase";
import type { Sort, Filter } from "~/lib/types";

export type SingleAttachment =
  Database["public"]["Tables"]["attachments"]["Row"];

const updateAtom = atom(false);
const insertAtom = atom(false);
export const itemIdAtom = atom<number | null>(null);

const sortingAtom = atom<Array<Sort>>([]);
const sortableColumns = ["name", "type", "model"];
const filteringAtom = atom<Array<Filter>>([]);
const filterableColumns = ["name", "type", "model", "characteristics"];

export default function Page() {
  const { attachments, models, types } = useOutletContext<{
    attachments: Array<Attachment>;
    models: Array<Model>;
    types: Array<Type>;
  }>();

  const setUpdateOpen = useSetAtom(updateAtom);
  const setInsertOpen = useSetAtom(insertAtom);
  const [itemId, setItemId] = useAtom(itemIdAtom);

  const openEditor = React.useCallback(
    () => setUpdateOpen(true),
    [setUpdateOpen]
  );

  const columns = React.useMemo(
    () => attachmentColumns(openEditor, setItemId),
    [openEditor, setItemId]
  );

  return (
    <>
      <Controls
        insertAtom={insertAtom}
        sortingAtom={sortingAtom}
        sortableColumns={sortableColumns}
        filteringAtom={filteringAtom}
        filterableColumns={filterableColumns}
      />
      <div className="pt-10">
        <DataTable
          sortingAtom={sortingAtom}
          filteringAtom={filteringAtom}
          columns={columns}
          data={attachments}
        />
      </div>
      <Sidebar
        state={insertAtom}
        title="Attachment Editor"
        description="Add a new gun attachment to the database."
      >
        <AttachmentEditor
          models={models}
          types={types}
          setOpen={setInsertOpen}
        />
      </Sidebar>
      <Sidebar
        state={updateAtom}
        title="Attachment Editor"
        description="Edit an existing gun attachment."
      >
        {itemId && (
          <AttachmentEditor
            models={models}
            types={types}
            setOpen={setUpdateOpen}
            attachment={attachments.find(
              (attachment) => attachment.id === itemId
            )}
            id={itemId}
          />
        )}
      </Sidebar>
    </>
  );
}

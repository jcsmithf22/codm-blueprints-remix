import { atom, useAtom, useSetAtom } from "jotai";
import React from "react";
import ModelEditor from "~/components/editor/ModelEditor";
import Sidebar from "~/components/editor/Sidebar";
import { ModelColumns } from "~/components/table/columns";
import Controls from "~/components/table/Controls";
import DataTable from "~/components/table/DataTable";

import { useOutletContext } from "@remix-run/react";

import type { Sort } from "~/lib/types";
import type { Attachment, Model } from "./_default.dashboard";

const updateAtom = atom(false);
const insertAtom = atom(false);
export const itemIdAtom = atom<number | null>(null);

const sortingAtom = atom<Array<Sort>>([]);
const sortableColumns = ["name", "type", "attachments"];

export default function Page() {
  const { models, attachments } = useOutletContext<{
    models: Array<Model>;
    attachments: Array<Attachment>;
  }>();

  const setOpen = useSetAtom(updateAtom);
  const [itemId, setItemId] = useAtom(itemIdAtom);

  const data = React.useMemo(
    () =>
      models.map((model) => ({
        ...model,
        attachments: attachments?.filter(
          (attachment) => attachment.models?.id === model.id
        ),
      })),
    [attachments, models]
  );

  const openEditor = React.useCallback(() => setOpen(true), [setOpen]);

  const columns = React.useMemo(
    () => ModelColumns(openEditor, setItemId),
    [openEditor, setItemId]
  );

  console.log("page rendered");

  return (
    <>
      <Controls
        insertAtom={insertAtom}
        sortableColumns={sortableColumns}
        sortingAtom={sortingAtom}
      />
      <div className="pt-10">
        <DataTable sortingAtom={sortingAtom} columns={columns} data={data} />
      </div>
      <Sidebar
        state={insertAtom}
        title="Model Editor"
        description="Add a new gun model to the database."
      >
        <ModelEditor />
      </Sidebar>
      <Sidebar
        state={updateAtom}
        title="Model Editor"
        description="Edit an existing gun model."
      >
        {itemId && (
          <ModelEditor
            id={itemId}
            model={models.find((model) => model.id === itemId)}
          />
        )}
      </Sidebar>
    </>
  );
}

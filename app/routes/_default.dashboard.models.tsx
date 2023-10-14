import { atom, useAtom, useSetAtom } from "jotai";
import React from "react";
import ModelEditor from "~/components/editor/ModelEditor";
import Sidebar from "~/components/editor/Sidebar";
import { modelColumns } from "~/components/table/columns";
import Controls from "~/components/table/Controls";
import DataTable from "~/components/table/DataTable";

import { useOutletContext } from "@remix-run/react";

import type { Sort, Filter } from "~/lib/types";
import type { Attachment, Model } from "./_default.dashboard";

const updateAtom = atom(false);
const insertAtom = atom(false);
export const itemIdAtom = atom<number | null>(null);

const sortingAtom = atom<Array<Sort>>([]);
const sortableColumns = ["name", "type", "attachments"];
const filteringAtom = atom<Array<Filter>>([]);
const filterableColumns = ["name", "type"];

export default function Page() {
  const { models, attachments } = useOutletContext<{
    models: Array<Model>;
    attachments: Array<Attachment>;
  }>();

  const setUpdateOpen = useSetAtom(updateAtom);
  const setInsertOpen = useSetAtom(insertAtom);
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

  const openEditor = React.useCallback(
    () => setUpdateOpen(true),
    [setUpdateOpen]
  );

  const columns = React.useMemo(
    () => modelColumns(openEditor, setItemId),
    [openEditor, setItemId]
  );

  return (
    <>
      <Controls
        insertAtom={insertAtom}
        sortableColumns={sortableColumns}
        sortingAtom={sortingAtom}
        filteringAtom={filteringAtom}
        filterableColumns={filterableColumns}
      />
      <div className="pt-10">
        <DataTable
          sortingAtom={sortingAtom}
          filteringAtom={filteringAtom}
          columns={columns}
          data={data}
        />
      </div>
      <Sidebar
        state={insertAtom}
        title="Model Editor"
        description="Add a new gun model to the database."
      >
        <ModelEditor setOpen={setInsertOpen} />
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
            setOpen={setUpdateOpen}
          />
        )}
      </Sidebar>
    </>
  );
}

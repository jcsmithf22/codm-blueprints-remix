import { atom, useAtom, useSetAtom } from "jotai";
import React from "react";
import Sidebar from "~/components/editor/Sidebar";
import TypeEditor from "~/components/editor/TypeEditor";
import { typeColumns } from "~/components/table/columns";
import Controls from "~/components/table/Controls";
import DataTable from "~/components/table/DataTable";

import { useOutletContext } from "@remix-run/react";

import type { Type } from "./_default.dashboard";
import type { Sort, Filter } from "~/lib/types";

const updateAtom = atom(false);
const insertAtom = atom(false);
export const itemIdAtom = atom<number | null>(null);

const sortingAtom = atom<Array<Sort>>([]);
const sortableColumns = ["name", "type"];
const filteringAtom = atom<Array<Filter>>([]);
const filterableColumns = ["name", "type"];

export default function Page() {
  const { types } = useOutletContext<{
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
    () => typeColumns(openEditor, setItemId),
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
          data={types}
        />
      </div>
      <Sidebar
        state={insertAtom}
        title="Attachment Type Editor"
        description="Add a new gun attachment type to the database."
      >
        <TypeEditor setOpen={setInsertOpen} />
      </Sidebar>
      <Sidebar
        state={updateAtom}
        title="Attachment Type Editor"
        description="Edit an existing gun attachment type."
      >
        {itemId && (
          <TypeEditor
            id={itemId}
            type={types.find((type) => type.id === itemId)}
            setOpen={setUpdateOpen}
          />
        )}
      </Sidebar>
    </>
  );
}

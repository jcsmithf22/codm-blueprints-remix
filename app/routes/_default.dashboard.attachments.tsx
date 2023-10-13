import React from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Filter, RefreshCw, List } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useOutletContext } from "@remix-run/react";
import type { Attachment } from "./_default.dashboard";
import DataTable from "~/components/table/DataTable";
import { AttachmentColumns } from "~/components/table/columns";
import type { Database } from "~/types/supabase";
import { atom, useAtom, useSetAtom } from "jotai";
import Sidebar from "~/components/editor/Sidebar";

export type SingleAttachment =
  Database["public"]["Tables"]["attachments"]["Row"];

const editorOpenAtom = atom(false);
const insertOpenAtom = atom(false);
export const editorItemIdAtom = atom<number | null>(null);

export default function Page() {
  const { attachments } = useOutletContext<{
    attachments: Array<Attachment>;
  }>();

  const setOpen = useSetAtom(editorOpenAtom);
  const [itemId, setItemId] = useAtom(editorItemIdAtom);

  const editorFunction = React.useCallback(() => setOpen(true), [setOpen]);

  const columns = React.useMemo(
    () => AttachmentColumns(editorFunction, setItemId),
    [editorFunction, setItemId]
  );

  return (
    <>
      <div className="border-b border-b-200 bg-white fixed top-14 left-0 md:left-64 right-0 h-10 flex gap-x-2 items-center px-4 text-gray-700 z-30">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 font-normal flex gap-x-2 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
          Refresh
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 font-normal flex gap-x-2 text-xs"
            >
              <Filter className="h-3.5 w-3.5 text-gray-500" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            Filters
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 font-normal flex gap-x-2 text-xs"
            >
              <List className="h-3.5 w-3.5 text-gray-500" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            Sort
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Sidebar
          atom={insertOpenAtom}
          title="Attachment Editor"
          description="Add a new gun attachment to the database."
          trigger={
            <Button
              variant="default"
              size="sm"
              className="h-6 font-normal flex gap-x-2 text-xs"
            >
              Insert
            </Button>
          }
        >
          This is where we create new stuff
        </Sidebar>
      </div>
      <div className="pt-10">
        <DataTable columns={columns} data={attachments} />
      </div>
      <Sidebar
        atom={editorOpenAtom}
        title="Attachment Editor"
        description="Edit an existing gun attachment."
      >
        {itemId && (
          <>
            {JSON.stringify(
              attachments.find((attachment) => attachment.id === itemId)
            )}
          </>
        )}
      </Sidebar>
    </>
  );
}

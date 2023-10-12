import React from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Filter, RefreshCw, List } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useFetcher, useOutletContext } from "@remix-run/react";
import type { Attachment, Model } from "./_default.dashboard";
import DataTable from "~/components/table/DataTable";
import { ModelColumns } from "~/components/table/columns";

export default function Page() {
  const { models, attachments } = useOutletContext<{
    models: Array<Model>;
    attachments: Array<Attachment>;
  }>();

  const fetcher = useFetcher<{ data: Model }>();
  const fetcherRef = React.useRef(fetcher);

  const [editorOpen, setEditorOpen] = React.useState(false);

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

  const editorFunction = React.useCallback(async (id: number) => {
    console.log(id);
    fetcherRef.current.load(`/dashboard/models/${id}`);
    setEditorOpen(true);
  }, []);

  const columns = React.useMemo(
    () => ModelColumns(editorFunction),
    [editorFunction]
  );

  return (
    <div>
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
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="h-6 font-normal flex gap-x-2 text-xs"
            >
              Insert
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Model Editor</SheetTitle>
              <SheetDescription>
                Upload a new gun model to the database.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="pt-10">
        <DataTable columns={columns} data={data} />
      </div>
      <Sheet open={editorOpen} onOpenChange={setEditorOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Model Editor</SheetTitle>
            <SheetDescription>
              Upload a new gun model to the database.
              {fetcher.state === "idle" && (
                <>{JSON.stringify(fetcher.data?.data)}</>
              )}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

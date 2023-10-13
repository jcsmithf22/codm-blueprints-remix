import type { ColumnDef } from "@tanstack/react-table";
import type { SetStateAction } from "jotai";
import type { Attachment, Type } from "~/routes/_default.dashboard";

type ModelAttachment = {
  id: number;
  name: string;
  type: string;
  attachments: Array<Attachment>;
};

type Characteristics = {
  pros: Array<string>;
  cons: Array<string>;
};

export const ModelColumns = (
  editorFunction: () => void,
  setItemId: (args_0: SetStateAction<number | null>) => void
) => {
  const columns: ColumnDef<ModelAttachment>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorFn: (row) => row.attachments.length,
      header: "Attachments",
      id: "attachments",
    },
    {
      accessorKey: "id",
      header: "",
      cell: (props) => (
        <div className="w-full flex justify-center">
          <button
            onClick={() => {
              setItemId(props.getValue() as number);
              editorFunction();
            }}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];
  return columns;
};

export const TypeColumns = (
  editorFunction: () => void,
  setItemId: (args_0: SetStateAction<number | null>) => void
) => {
  const columns: ColumnDef<Type>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "id",
      header: "",
      cell: (props) => (
        <div className="w-full flex justify-center">
          <button
            onClick={() => {
              setItemId(props.getValue() as number);
              editorFunction();
            }}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];
  return columns;
};

// Make attachment columns more efficient, probably by storing the data as a string

export const AttachmentColumns = (
  editorFunction: () => void,
  setItemId: (args_0: SetStateAction<number | null>) => void
) => {
  const columns: ColumnDef<Attachment>[] = [
    {
      accessorKey: "attachment_names.name",
      header: "Name",
    },
    {
      accessorKey: "attachment_names.type",
      header: "Type",
    },
    {
      accessorKey: "models.name",
      header: "Model",
    },
    {
      accessorFn: (row) => JSON.stringify(row.characteristics),
      header: "Characteristics",
      id: "characteristics",
      cell: (info) => {
        const values = JSON.parse(info.getValue() as string) as Characteristics;
        return (
          <>
            {values.pros.map((pro) => (
              <p className="text-green-600 flex gap-x-1 items-center" key={pro}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                  />
                </svg>
                {pro}
              </p>
            ))}
            {values.cons.map((con) => (
              <p className="text-red-600 flex gap-x-1 items-center" key={con}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
                  />
                </svg>
                {con}
              </p>
            ))}
          </>
        );
      },
    },
    {
      accessorKey: "id",
      header: "",
      cell: (props) => (
        <div className="w-full flex justify-center">
          <button
            onClick={() => {
              setItemId(props.getValue() as number);
              editorFunction();
            }}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];
  return columns;
};

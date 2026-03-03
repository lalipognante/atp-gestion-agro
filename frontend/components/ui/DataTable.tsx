import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string;
  emptyMessage?: string;
}

// Generic table — JSX generic syntax requires explicit type parameter via wrapper
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "Sin datos",
}: DataTableProps<T>) {
  const alignClass = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  } as const;

  if (rows.length === 0) {
    return (
      <p className="text-[0.82rem] text-neutral-400 py-4 text-center">
        {emptyMessage}
      </p>
    );
  }

  return (
    <table className="w-full border-collapse" role="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              scope="col"
              className={[
                "text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-neutral-400 py-[10px] px-[14px] border-b border-gray-200",
                alignClass[col.align ?? "left"],
              ].join(" ")}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={getRowKey(row, i)}
            className="border-b border-gray-50 last:border-b-0 hover:bg-neutral-50 transition-colors"
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className={[
                  "py-[11px] px-[14px] text-[0.82rem] text-neutral-800",
                  alignClass[col.align ?? "left"],
                ].join(" ")}
              >
                {col.render(row, i)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

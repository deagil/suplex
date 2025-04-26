import type { ColumnDef } from "@tanstack/table-core";
// import { renderComponent } from "$lib/components/ui/data-table/index.js";
// import DataTableActions from "./data-table-actions.svelte";
// import DataTableEmailButton from "./data-table-email-button.svelte";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// Types for Supabase Management API
export type SupabaseColumn = {
    name: string;
    data_type: string;
    description: string | null;
};

export type Table = {
    name: string;
    description: string | null;
    row_estimate: number;
    columns: SupabaseColumn[];
};

// Generate columns for TanStack Table from SupabaseTable.columns
export function generateColumns(columns: SupabaseColumn[]): ColumnDef<any>[] {
    console.log("Generating columns for TanStack Table", columns);
    return columns.map((col) => ({
        id: col.name,
        accessorKey: col.name,
        header: col.name,
        cell: info => info.getValue(),
    }));
}
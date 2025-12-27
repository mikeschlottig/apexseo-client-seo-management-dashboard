"use client";
import React from "react";
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ClientFormModal } from "./ClientFormModal";
import { DeleteClientDialog } from "./DeleteClientDialog";
import { createClientColumns } from "./ClientColumns";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { Client } from "@shared/types";
import { useClientStore } from "@/store/client-store";
interface DataTableProps<TData extends Client> {
  data: TData[];
}
export function ClientDataTable<TData extends Client>({
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = React.useState<Client | null>(null);
  const fetchClients = useClientStore((state) => state.fetchClients);
  const handleEdit = (client: Client) => {
    setEditingClient(client);
  };
  const handleDelete = (client: Client) => {
    setDeletingClient(client);
  };
  const columns = React.useMemo(
    () => createClientColumns(handleEdit, handleDelete),
    []
  );
  const handleUpdateClient = async (data: any) => {
    if (!editingClient) return;
    try {
      await api(`/api/clients/${editingClient.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          company: data.company,
          contactPerson: data.contactPerson,
          email: data.email,
          phone: data.phone,
          website: data.website,
          industry: data.industry,
          seoStats: {
            ...editingClient.seoStats,
            indexedKeywords: data.indexedKeywords,
            seoClicks: data.seoClicks,
            websiteQualityRating: data.websiteQualityRating,
          },
        }),
      });
      toast.success('Client updated successfully!');
      fetchClients();
      setEditingClient(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update client');
      throw error;
    }
  };
  const handleConfirmDelete = async () => {
    if (!deletingClient) return;
    try {
      await api(`/api/clients/${deletingClient.id}`, {
        method: 'DELETE',
      });
      toast.success('Client deleted successfully!');
      fetchClients();
      setDeletingClient(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete client');
      throw error;
    }
  };
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <Input
            placeholder="Filter by company..."
            value={(table.getColumn("company")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("company")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardContent>
      <ClientFormModal
        open={!!editingClient}
        onClose={() => setEditingClient(null)}
        client={editingClient}
        onSubmit={handleUpdateClient}
      />
      <DeleteClientDialog
        open={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        clientName={deletingClient?.company || ''}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}
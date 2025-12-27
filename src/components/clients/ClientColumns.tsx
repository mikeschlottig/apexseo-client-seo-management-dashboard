"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Client } from "@shared/types";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
export const createClientColumns = (
  onEdit: (client: Client) => void,
  onDelete: (client: Client) => void
): ColumnDef<Client>[] => [
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const client = row.original;
      return (
        <Link to={`/clients/${client.id}`} className="font-medium text-primary hover:underline">
          {client.company}
        </Link>
      );
    },
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.original.industry}</Badge>;
    },
  },
  {
    accessorKey: "seoStats.indexedKeywords",
    header: "Keywords",
    cell: ({ row }) => {
      return new Intl.NumberFormat().format(row.original.seoStats.indexedKeywords);
    },
  },
  {
    accessorKey: "seoStats.seoClicks",
    header: "SEO Clicks",
    cell: ({ row }) => {
      return new Intl.NumberFormat().format(row.original.seoStats.seoClicks);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.id)}>
              Copy client ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/clients/${client.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(client)}>Edit client</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(client)}>
              Delete client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
// For backward compatibility
export const clientColumns = createClientColumns(() => {}, () => {});
import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Lead } from '@shared/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
interface LeadsTableProps {
  leads: Lead[];
}
const getStageColor = (stage: string) => {
  switch (stage) {
    case 'Lead In':
      return 'bg-slate-500 hover:bg-slate-600';
    case 'Contact Made':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'Proposal Sent':
      return 'bg-purple-500 hover:bg-purple-600';
    case 'Negotiation':
      return 'bg-orange-500 hover:bg-orange-600';
    case 'Won':
      return 'bg-green-500 hover:bg-green-600';
    case 'Lost':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};
const getStageDescription = (stage: string) => {
  const descriptions: Record<string, string> = {
    'Lead In': 'Initial lead received',
    'Contact Made': 'First contact established',
    'Proposal Sent': 'Proposal submitted to client',
    'Negotiation': 'In active negotiation',
    'Won': 'Deal successfully closed',
    'Lost': 'Opportunity lost',
  };
  return descriptions[stage] || stage;
};
export function LeadsTable({ leads }: LeadsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'company',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-muted/50"
          >
            Company
            <ArrowUpDown className={`ml-2 h-4 w-4 transition-transform ${column.getIsSorted() === 'asc' ? 'rotate-180' : ''}`} />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.original.company}</div>,
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <a href={`mailto:${row.original.email}`} className="text-primary hover:underline">
          {row.original.email}
        </a>
      ),
    },
    {
      accessorKey: 'estimatedValue',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-muted/50"
          >
            Value
            <ArrowUpDown className={`ml-2 h-4 w-4 transition-transform ${column.getIsSorted() === 'asc' ? 'rotate-180' : ''}`} />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.original.estimatedValue;
        const trend = value > 5000 ? 'up' : 'down';
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
            </span>
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'stage',
      header: 'Stage',
      cell: ({ row }) => {
        const stage = row.original.stage;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge className={`${getStageColor(stage)} transition-colors`} variant="default">
                  {stage}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getStageDescription(stage)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        return formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true });
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => toast.info('Feature coming soon')}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Feature coming soon')}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background shadow-sm z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow 
                    key={row.id} 
                    className={`hover:bg-gradient-to-r hover:from-muted/30 hover:to-transparent transition-all ${
                      index % 2 === 0 ? 'bg-muted/20' : ''
                    }`}
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
                  <TableCell colSpan={columns.length} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="text-4xl">🔍</div>
                      <p className="text-lg font-medium">No leads found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
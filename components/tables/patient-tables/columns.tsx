'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Patient } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<Patient>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'gender',
    header: 'GENDER'
  },
  {
    accessorKey: 'phone',
    header: 'PHONE NUMBER'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL ADDRESS'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

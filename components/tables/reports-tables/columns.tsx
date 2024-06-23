'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Report } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Report>[] = [
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
    header: 'PATIENT NAME',
    cell: ({ row }) => {
      const patient = row.original.patient as
        | { first_name: string; last_name: string }
        | undefined;
      return patient
        ? `${patient.first_name} ${patient.last_name}`
        : 'Unknown Patient';
    }
  },
  {
    accessorKey: 'report_title',
    header: 'REPORT TITLE'
  },
  {
    accessorKey: 'report_description',
    header: 'REPORT DESCRIPTION'
  },
  {
    accessorKey: 'report_link',
    header: 'VIEW REPORT'
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

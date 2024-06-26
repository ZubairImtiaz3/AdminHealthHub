'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Report } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '@/components/tables/reports-tables/cell-action';
import { Button } from '@/components/ui/button';

const ReportLinkCell = ({ reportLink }: { reportLink: string }) => {
  const handleClick = () => {
    const url =
      reportLink.startsWith('http://') || reportLink.startsWith('https://')
        ? reportLink
        : `https://${reportLink}`;
    window.open(url, '_blank');
  };

  return (
    <Button className="px-0" onClick={handleClick} variant="link">
      View Report
    </Button>
  );
};

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
    accessorKey: 'report_title',
    header: 'Report Title'
  },
  {
    accessorKey: 'report_description',
    header: 'Report Description'
  },
  {
    accessorKey: 'report_link',
    header: 'Report',
    cell: ({ row }) => <ReportLinkCell reportLink={row.original.report_link} />
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

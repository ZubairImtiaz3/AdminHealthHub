'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Patient } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const AssociatedPatientsCell = ({
  associatedPatients
}: {
  associatedPatients: Patient[];
}) => {
  const router = useRouter();

  return (
    <div>
      {associatedPatients.length > 0 ? (
        associatedPatients.map((patient: Patient) => (
          <Button
            className="px-0 pr-4"
            onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
            variant="link"
            key={patient.id}
          >
            {patient.first_name} {patient.last_name}
          </Button>
        ))
      ) : (
        <span>No Associated Patients</span>
      )}
    </div>
  );
};

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
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    header: 'NAME'
  },
  {
    accessorKey: 'gender',
    header: 'GENDER'
  },
  {
    accessorKey: 'phone_number',
    header: 'PHONE NUMBER'
  },
  {
    header: 'Associated Patients',
    accessorKey: 'associated_patients',
    cell: ({ row }) => (
      <AssociatedPatientsCell
        associatedPatients={row.original.associated_patients ?? []}
      />
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

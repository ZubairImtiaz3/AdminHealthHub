'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Admin } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import { columns } from './columns';

interface ClientProps {
  data: Admin[];
}

export const UserClient: React.FC<ClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Admins (${data.length})`}
          description="Manage Admins"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/admins/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="NAME" columns={columns} data={data} />
    </>
  );
};

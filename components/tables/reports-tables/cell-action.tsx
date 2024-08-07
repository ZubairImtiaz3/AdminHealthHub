'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { Report } from '@/constants/data';
import { createClient } from '@/utils/supabase/client';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';

interface CellActionProps {
  data: Report;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    const report = data ? data.report_link : '';

    // Extract the file path from the URL
    const filePath = report.split('/storage/v1/object/public/reports/')[1];
    try {
      setLoading(true);

      const { error: dbError } = await supabase
        .from('reports')
        .delete()
        .eq('id', data.id);

      if (dbError) throw dbError;

      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('reports')
        .remove([filePath]);

      if (storageError) throw storageError;

      toast({
        title: 'Success',
        description: 'Patient Report successfully deleted.'
      });

      router.refresh();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/reports/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

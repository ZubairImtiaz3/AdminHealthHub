import BreadCrumb from '@/components/breadcrumb';
import { CreateProfileOne } from '@/components/forms/user-profile/create-profile';
import { Heading } from '@/components/ui/heading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const breadcrumbItems = [{ title: 'Add Admin', link: '/dashboard/admins/new' }];

export default async function Page({
  params
}: {
  params: { adminsId: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let admin = null;

  if (params.adminsId !== 'new') {
    const { data, error } = await supabase
      .from('admins')
      .select(
        `*, 
        profiles (*)
      `
      )
      .eq('id', params.adminsId)
      .single();

    if (error || !data) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Heading
            title="Invalid Admin Request"
            description="Something Went Wrong..."
          />
        </div>
      );
    }

    admin = data;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <CreateProfileOne categories={[]} initialData={admin ? admin : {}} />
      </div>
    </ScrollArea>
  );
}

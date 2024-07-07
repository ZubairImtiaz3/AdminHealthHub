import BreadCrumb from '@/components/breadcrumb';
import { CreateProfileOne } from '@/components/forms/user-profile/create-profile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const breadcrumbItems = [{ title: 'Profile', link: '/dashboard/profile' }];
export default async function page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from('admins').select(
    `*, 
        profiles (*)
      `
  );

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <CreateProfileOne disable={true} categories={[]} initialData={data} />
      </div>
    </ScrollArea>
  );
}

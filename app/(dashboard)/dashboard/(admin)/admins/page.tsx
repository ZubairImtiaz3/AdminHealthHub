import BreadCrumb from '@/components/breadcrumb';
import { UserClient } from '@/components/tables/admin-table/client';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const breadcrumbItems = [{ title: 'Admins', link: '/dashboard/admins' }];

export default async function page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from('admins').select(
    `*, 
    profiles (*)
  `
  );

  const admins = data ? data : [];

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <UserClient data={admins} />
      </div>
    </>
  );
}

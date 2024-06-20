import BreadCrumb from '@/components/breadcrumb';
import { UserClient } from '@/components/tables/patient-tables/client';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const breadcrumbItems = [{ title: 'Patients', link: '/dashboard/patients' }];
export default async function page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from('patients').select('*');

  const patients = data ? data : [];

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <UserClient data={patients} />
      </div>
    </>
  );
}

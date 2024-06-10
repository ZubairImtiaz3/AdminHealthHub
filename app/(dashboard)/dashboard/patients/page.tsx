import BreadCrumb from '@/components/breadcrumb';
import { UserClient } from '@/components/tables/patient-tables/client';
import { patients } from '@/constants/data';

const breadcrumbItems = [{ title: 'Patients', link: '/dashboard/patients' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <UserClient data={patients} />
      </div>
    </>
  );
}

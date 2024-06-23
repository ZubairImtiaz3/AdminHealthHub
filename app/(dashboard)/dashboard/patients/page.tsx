import BreadCrumb from '@/components/breadcrumb';
import { UserClient } from '@/components/tables/patient-tables/client';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import _ from 'lodash';

const breadcrumbItems = [{ title: 'Patients', link: '/dashboard/patients' }];
export default async function page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from('patients').select('*');

  const patients = data ? data : [];

  // Group patients by user_id
  const patientsByUserId = _.groupBy(patients, 'user_id');

  // Add associated patients to each patient
  const patientsWithAssociates = patients.map((patient) => {
    const associated_patients = _.reject(patientsByUserId[patient.user_id], {
      id: patient.id
    });
    return {
      ...patient,
      associated_patients
    };
  });

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <UserClient data={patientsWithAssociates} />
      </div>
    </>
  );
}

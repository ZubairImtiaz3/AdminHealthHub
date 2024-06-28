import BreadCrumb from '@/components/breadcrumb';
import { UserClient } from '@/components/tables/patient-tables/client';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import _ from 'lodash';

const breadcrumbItems = [{ title: 'Patients', link: '/dashboard/patients' }];

interface Patient {
  id: string;
  [key: string]: any;
}

type Group = {
  [key: string]: Patient[];
};

export default async function page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from('patients').select('*');

  const patients = data ? data : [];

  // Group patients by user_id
  const patientsByUserId = _.groupBy(patients, 'user_id');

  // Group patients with null user_id by phone_number
  const patientsWithNullUserId = _.groupBy(
    patients.filter((patient) => patient.user_id === null),
    'phone_number'
  );

  // Function to get associated patients
  const getAssociatedPatients = (
    patient: Patient,
    groupByField: string,
    group: Group
  ) => {
    return _.reject(group[patient[groupByField]], { id: patient.id });
  };

  // Add associated patients to each patient
  const patientsWithAssociates = patients.map((patient) => {
    let associated_patients;
    if (patient.user_id !== null) {
      associated_patients = getAssociatedPatients(
        patient,
        'user_id',
        patientsByUserId
      );
    } else {
      associated_patients = getAssociatedPatients(
        patient,
        'phone_number',
        patientsWithNullUserId
      );
    }
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

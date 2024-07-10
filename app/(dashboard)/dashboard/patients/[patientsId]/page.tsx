import BreadCrumb from '@/components/breadcrumb';
import { PatientsForm } from '@/components/forms/patients-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { columns as assocColumns } from '@/components/tables/association-table/columns';

import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import _ from 'lodash';
import { columns } from '@/components/tables/patient-report-table/columns';
import { mergeAndRemoveDuplicates } from '@/utils/client/basicUtlis';

export default async function Page({
  params
}: {
  params: { patientsId: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const breadcrumbItems = [
    { title: 'Patients', link: '/dashboard/patients' },
    { title: 'Add', link: '/dashboard/patients/add' }
  ];

  if (params.patientsId === 'new') {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-5">
          <BreadCrumb items={breadcrumbItems} />
          <PatientsForm
            categories={[
              { _id: 'Male', name: 'Male' },
              { _id: 'Female', name: 'Female' }
            ]}
            key={null}
          />
        </div>
      </ScrollArea>
    );
  }

  const { data, error: patientError } = await supabase
    .from('patients')
    .select(
      `*, 
    reports (*)
  `
    )
    .eq('id', params.patientsId);

  const patient = data && data.length > 0 ? data[0] : null;

  if (!patient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Heading
          title="Invalid Patient Request"
          description="Something Went Wrong..."
        />
      </div>
    );
  }

  const patientsReports = patient.reports;
  const patientUserId = patient.user_id;
  const patientPhoneNumber = patient.phone_number;

  const {
    data: associatedPatientsByUserId,
    error: associatedPatientsByUserIdError
  } = await supabase.from('patients').select('*').eq('user_id', patientUserId);

  const associationListByUserId = associatedPatientsByUserId
    ? associatedPatientsByUserId
    : [];

  // Remove the object with id of params.patientsId from associationListByUserId array
  const filteredAssociationsByUserId = associationListByUserId.filter(
    (patient) => patient.id !== params.patientsId
  );

  const {
    data: associatedPatientsByPhoneNumber,
    error: associatedPatientsByPhoneNumberError
  } = await supabase
    .from('patients')
    .select('*')
    .eq('phone_number', patientPhoneNumber);

  const associationListByPhoneNumber = associatedPatientsByPhoneNumber
    ? associatedPatientsByPhoneNumber
    : [];

  // Remove the object with id of params.patientsId from associationListByPhoneNumber array
  const filteredAssociationsByPhoneNumber = associationListByPhoneNumber.filter(
    (patient) => patient.id !== params.patientsId
  );

  // Merge and remove duplicate in the filtered arrays
  const mergedFilteredAssociations = mergeAndRemoveDuplicates(
    filteredAssociationsByUserId,
    filteredAssociationsByPhoneNumber,
    'id'
  );

  // Render Additional Data if params.patientId is not "new"
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <PatientsForm
          categories={[
            { _id: 'Male', name: 'Male' },
            { _id: 'Female', name: 'Female' }
          ]}
          key={null}
        />

        <div className="flex items-start justify-between pt-10">
          <Heading
            title={`Existing Reports (${patientsReports?.length})`}
            description="Report History Of Patient"
          />
        </div>
        <Separator />
        <DataTable searchKey="NAME" columns={columns} data={patientsReports} />

        <div className="flex items-start justify-between pt-10">
          <Heading
            title={`Associated Patients (${mergedFilteredAssociations.length})`}
            description="Relationships Of Patient"
          />
        </div>
        <Separator />
        <DataTable
          searchKey="NAME"
          columns={assocColumns}
          data={mergedFilteredAssociations}
        />
      </div>
    </ScrollArea>
  );
}

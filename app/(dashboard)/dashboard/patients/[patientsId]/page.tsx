import BreadCrumb from '@/components/breadcrumb';
import { PatientsForm } from '@/components/forms/patients-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { columns as assocColumns } from '@/components/tables/association-report/columns';

import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import _ from 'lodash';
import { columns } from '@/components/tables/patient-report-table/columns';

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

  const { data: Reports, error } = await supabase
    .from('reports')
    .select()
    .eq('patient_id', params.patientsId);

  const patientsReports = Reports ? Reports : [];

  let userId;

  if (Reports && Reports.length > 0) {
    userId = Reports[0]?.user_id;
  } else {
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select()
      .eq('id', params.patientsId);

    if (patient && patient.length > 0) {
      userId = patient[0].user_id;
    }
  }

  const { data: assocsPatient, error: assocsPatientError } = await supabase
    .from('patients')
    .select('*')
    .eq('user_id', userId);

  const assocsPatients = assocsPatient ? assocsPatient : [];

  // Remove the object with id of params.patientsId from assocsPatients array
  const filteredAssocsPatients = assocsPatients.filter(
    (patient) => patient.id !== params.patientsId
  );

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
            title={`Associated Patients (${filteredAssocsPatients.length})`}
            description="Relationships Of Patient"
          />
        </div>
        <Separator />
        <DataTable
          searchKey="NAME"
          columns={assocColumns}
          data={filteredAssocsPatients}
        />
      </div>
    </ScrollArea>
  );
}

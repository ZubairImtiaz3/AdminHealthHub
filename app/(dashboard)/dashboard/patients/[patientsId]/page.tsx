import BreadCrumb from '@/components/breadcrumb';
import { PatientsForm } from '@/components/forms/patients-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { columns } from '@/components/tables/reports-tables/columns';
import { DataTable } from '@/components/ui/data-table';
import { reports } from '@/constants/data';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';

export default function Page({ params }: { params: { patientsId: string } }) {
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
            title={`Existing Reports (${reports.length})`}
            description="Report History Of Patient"
          />
        </div>
        <Separator />
        <DataTable searchKey="NAME" columns={columns} data={reports} />

        <div className="flex items-start justify-between pt-10">
          <Heading
            title={`Associated Patients (${reports.length})`}
            description="Relationships Of Patient"
          />
        </div>
        <Separator />
        <DataTable searchKey="NAME" columns={columns} data={reports} />
      </div>
    </ScrollArea>
  );
}

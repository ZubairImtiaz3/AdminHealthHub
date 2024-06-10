import BreadCrumb from '@/components/breadcrumb';
import { PatientsForm } from '@/components/forms/patients-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Patients', link: '/dashboard/patients' },
    { title: 'Add', link: '/dashboard/patients/add' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <PatientsForm
          categories={[
            { _id: 'Male', name: 'Male' },
            { _id: 'Female', name: 'Female' }
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}

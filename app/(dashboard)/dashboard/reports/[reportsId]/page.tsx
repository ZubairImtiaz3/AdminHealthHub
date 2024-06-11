import BreadCrumb from '@/components/breadcrumb';
import { ReportsForm } from '@/components/forms/reports-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Reports', link: '/dashboard/reports' },
    { title: 'Add', link: '/dashboard/reports/add' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <ReportsForm
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

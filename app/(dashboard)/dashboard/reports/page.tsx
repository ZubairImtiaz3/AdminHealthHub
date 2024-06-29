import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/reports-tables/columns';
import { ReportsTable } from '@/components/tables/reports-tables/reports-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

const breadcrumbItems = [{ title: 'Reports', link: '/dashboard/reports' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // get reports with their patients
  const { data: patientsReportsData } = await supabase.from('reports')
    .select(`*, 
    patients (*)
  `);
  const patientsReports = patientsReportsData ? patientsReportsData : [];

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  // search functionality
  const report_title = Array.isArray(searchParams.search)
    ? searchParams.search[0]
    : searchParams.search || null;

  const filteredReports = report_title
    ? patientsReports.filter((patientsReports) =>
        patientsReports.report_title
          .toLowerCase()
          .includes(report_title.toLowerCase())
      )
    : patientsReports;

  const totalUsers = filteredReports.length;
  const pageCount = Math.ceil(totalUsers / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Reports (${totalUsers})`}
            description="Manage reports"
          />
        </div>
        <Separator />

        <ReportsTable
          searchKey="report_title"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={filteredReports}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}

import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Overview } from '@/components/overview';
import { RecentPatients } from '@/components/recent-patients';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatReleaseDate } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';
import { isWithinInterval, parseISO } from 'date-fns';
import { cookies } from 'next/headers';

interface SearchParams {
  from?: string;
  to?: string;
}

export default async function page({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // to get today's date in local timezone
  const today = new Date();
  const todayString = formatReleaseDate(
    today.toLocaleDateString(),
    'YYYY-MM-DD'
  );

  // get patients with their reports
  const { data: patientsReportsData } = await supabase
    .from('patients')
    .select(
      `*, 
    reports (*)
  `
    )
    .order('created_at', { ascending: true });
  const patientsWithReports = patientsReportsData ? patientsReportsData : [];

  // to get today's patients in local timezone
  const todayPatients = patientsWithReports.filter((patientsReport) => {
    const createdAt = formatReleaseDate(
      patientsReport?.created_at,
      'YYYY-MM-DD'
    );
    return createdAt === todayString;
  });

  const todayReports = patientsWithReports
    .flatMap((patient) => patient.reports || [])
    .filter((report) => {
      const createdAt = formatReleaseDate(report?.created_at, 'YYYY-MM-DD');
      return createdAt === todayString;
    });

  // filtering logic according to date
  let filteredPatients = patientsWithReports;
  let filteredReports = patientsWithReports.flatMap(
    (patient) => patient.reports || []
  );

  if (searchParams.from && searchParams.to) {
    const fromDate = parseISO(searchParams.from);
    const toDate = parseISO(searchParams.to);

    filteredPatients = patientsWithReports.filter((patientsReport) => {
      const createdAtDate = formatReleaseDate(
        patientsReport?.created_at,
        'YYYY-MM-DD'
      );
      const patientsDate = parseISO(createdAtDate);
      return isWithinInterval(patientsDate, { start: fromDate, end: toDate });
    });

    filteredReports = patientsWithReports
      .flatMap((patient) => patient.reports || [])
      .filter((report) => {
        const createdAtDate = formatReleaseDate(
          report?.created_at,
          'YYYY-MM-DD'
        );
        const reportsDate = parseISO(createdAtDate);
        return isWithinInterval(reportsDate, { start: fromDate, end: toDate });
      });
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div>
            <CalendarDateRangePicker />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredPatients.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Based On Selected Date Range
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reports
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredReports.length}</div>
              <p className="text-xs text-muted-foreground">
                Based On Selected Date Range
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today Patients
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 29 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-round-search text-muted-foreground"
              >
                <circle cx="10" cy="8" r="5" />
                <path d="M2 21a8 8 0 0 1 10.434-7.62" />
                <circle cx="18" cy="18" r="3" />
                <path d="m22 22-1.9-1.9" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayPatients.length}</div>
              <p className="text-xs text-muted-foreground">
                You Have Total {todayPatients.length} Patients Today.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today Reports
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayReports.length}</div>
              <p className="text-xs text-muted-foreground">
                You Have Total {todayReports.length} Reports Today.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>
                You have added these patients recently.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentPatients
                patientsReports={patientsWithReports ? patientsWithReports : []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}

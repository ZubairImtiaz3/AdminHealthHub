import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Report } from '@/constants/data';

interface Props {
  patientsReports: Report[];
}

export function RecentPatients({ patientsReports }: Props) {
  const getReportCount = (
    patientId: string,
    patientsReports: Report[]
  ): number => {
    const patient = patientsReports.find((report) => report.id === patientId);
    return patient && patient.reports ? patient.reports.length : 0;
  };

  return (
    <div className="space-y-8">
      {patientsReports
        .reverse()
        .slice(0, 5)
        .map((patient) => (
          <div key={patient.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/default.png" alt="Avatar" />
              <AvatarFallback>
                {patient?.first_name?.charAt(0)}
                {patient?.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {patient.first_name} {patient.last_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {patient.phone_number}
              </p>
            </div>
            <div className="ml-auto font-medium">
              +{getReportCount(patient.id, patientsReports)} Report
            </div>
          </div>
        ))}
    </div>
  );
}

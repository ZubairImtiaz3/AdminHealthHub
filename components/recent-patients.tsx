import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Patient, Report } from '@/constants/data';

interface Props {
  patients: Patient[];
  patientsReports: Report[];
}

export function RecentPatients({ patients, patientsReports }: Props) {
  const getReportCount = (patientId: string) => {
    return patientsReports.filter((report) => report.patient_id === patientId)
      .length;
  };

  return (
    <div className="space-y-8">
      {patients
        .reverse()
        .slice(0, 5)
        .map((patient) => (
          <div key={patient.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/default.png" alt="Avatar" />
              <AvatarFallback>
                {patient.first_name.charAt(0)}
                {patient.last_name.charAt(0)}
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
              +{getReportCount(patient.id)} Report
            </div>
          </div>
        ))}
    </div>
  );
}

import { NavItem } from '@/types';

export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  associated_patients?: Patient[];
  created_at: string;
};

export type Report = {
  id: string;
  patient_id: string;
  admin_id: string;
  user_id: string;
  last_name: string;
  report_description: string;
  report_link: string;
  report_title: string;
  associated_patients?: Patient[];
  created_at: string;
  patient?: string;

};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Patients',
    href: '/dashboard/patients',
    icon: 'users',
    label: 'patients'
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: 'post',
    label: 'reports'
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'profile'
  }
];

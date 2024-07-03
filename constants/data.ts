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
  report_description: string;
  report_link: string;
  report_title: string;
  created_at: string;
  // optional props for patientsWithReports
  associated_patients?: Patient[];
  patient?: string;
  patients?: string;
  reports?: [];
  first_name?: string;
  last_name?: string;
  phone_number?: string;
};

export type Profile = {
  id: string;
  role: string;
  email: string;
  gender: string | null;
  last_name: string;
  first_name: string;
  phone_number: string;
};

export type Admin = {
  id: string;
  created_at: string;
  super_admin_id: string;
  country: string;
  city: string;
  profiles: Profile;
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

export const superNavItems: NavItem[] = [
  {
    title: 'Admins',
    href: '/dashboard/admins',
    icon: 'users',
    label: 'admins'
  },
  {
    title: 'Add Admin',
    href: '/dashboard/admins/new',
    icon: 'profile',
    label: 'add-admin'
  }
];

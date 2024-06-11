import { NavItem } from '@/types';

export type Patient = {
  id: number;
  name: string;
  gender: string;
  phone: string;
  email: string;
};

// dummy data for patients
export const patients: Patient[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    gender: 'Female',
    phone: '123-456-7890',
    email: 'candice.schiner@example.com'
  },
  {
    id: 2,
    name: 'John Doe',
    gender: 'Male',
    phone: '234-567-8901',
    email: 'john.doe@example.com'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    gender: 'Female',
    phone: '345-678-9012',
    email: 'alice.johnson@example.com'
  },
  {
    id: 4,
    name: 'David Smith',
    gender: 'Male',
    phone: '456-789-0123',
    email: 'david.smith@example.com'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    gender: 'Female',
    phone: '567-890-1234',
    email: 'emma.wilson@example.com'
  },
  {
    id: 6,
    name: 'James Brown',
    gender: 'Male',
    phone: '678-901-2345',
    email: 'james.brown@example.com'
  },
  {
    id: 7,
    name: 'Laura White',
    gender: 'Female',
    phone: '789-012-3456',
    email: 'laura.white@example.com'
  },
  {
    id: 8,
    name: 'Michael Lee',
    gender: 'Male',
    phone: '890-123-4567',
    email: 'michael.lee@example.com'
  },
  {
    id: 9,
    name: 'Olivia Green',
    gender: 'Female',
    phone: '901-234-5678',
    email: 'olivia.green@example.com'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    gender: 'Male',
    phone: '012-345-6789',
    email: 'robert.taylor@example.com'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
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
    icon: 'user',
    label: 'patients'
  },
  {
    title: 'Employee',
    href: '/dashboard/employee',
    icon: 'employee',
    label: 'employee'
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'profile'
  },
];

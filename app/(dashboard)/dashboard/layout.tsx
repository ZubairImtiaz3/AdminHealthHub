import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import MainNav from '@/components/layout/mainNav';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin HealthHub',
  description: 'Your Dashboard'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <MainNav />
        </Sidebar>
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  );
}

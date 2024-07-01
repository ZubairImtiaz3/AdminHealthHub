import { navItems, superNavItems } from '@/constants/data';
import { DashboardNav } from '../dashboard-nav';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const MainNav = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  const profile = profiles ? profiles : null;

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav
              items={profile?.role === 'superadmin' ? superNavItems : navItems}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainNav;

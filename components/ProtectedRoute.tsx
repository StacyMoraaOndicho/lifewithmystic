'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [roleLoading, setRoleLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuthorization() {
      if (loading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      // 1. Fetch profile from DB
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, subscription_status')
        .eq('id', user.id)
        .maybeSingle();

      // 2. Identify Role & Status (Checking both DB and Metadata)
      const role = profile?.role || user.user_metadata?.role || user.user_metadata?.plan || 'seeker';
      const status = profile?.subscription_status || 'inactive';

      // 3. ADMIN BYPASS: Admins have free pass everywhere
      if (role === 'admin' || user.email === "lifewithmystic@gmail.com") {
        setIsAuthorized(true);
        setRoleLoading(false);
        return;
      }

      // 4. JUST PAID BYPASS: If they just returned from Paystack
      if (searchParams.get('status') === 'success') {
        setIsAuthorized(true);
        setRoleLoading(false);
        return;
      }

      // 5. WRITER PROTECTION: Must be active to see /writer/ routes
      if (pathname.includes('/writer/')) {
        if (status !== 'active') {
          router.push('/pricing?status=confirmed&plan=writer&force_gateway=true');
          return;
        }
      }

      setIsAuthorized(true);
      setRoleLoading(false);
    }

    checkAuthorization();
  }, [user, loading, router, pathname, searchParams]);

  if (loading || roleLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">✨</div>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.5em]">Synchronizing Presence...</p>
        </div>
      </main>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}

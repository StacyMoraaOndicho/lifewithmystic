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

      // If they just paid, let them into the dashboard component so it can handle the "wait" UI
      if (searchParams.get('status') === 'success') {
        setIsAuthorized(true);
        setRoleLoading(false);
        return;
      }

      // Check subscription status in the database
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .maybeSingle();

      const isActive = profile?.subscription_status === 'active';

      // If trying to access writer tools without being active, send to pricing
      if (pathname.includes('/writer/') && !isActive) {
        // Only redirect if NOT already on a successful payment return path
        router.push('/pricing?status=confirmed&plan=writer&force_gateway=true');
        return;
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
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.5em]">Authenticating Presence...</p>
        </div>
      </main>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}

'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = "lifewithmystic@gmail.com";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [roleLoading, setRoleLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuthorization() {
      if (loading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      // 1. Admin always has access
      if (user.email === ADMIN_EMAIL) {
        setIsAuthorized(true);
        setRoleLoading(false);
        return;
      }

      // 2. For Writer Dashboard, check if user is a writer and active
      if (pathname.includes('/writer/')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, subscription_status')
          .eq('id', user.id)
          .maybeSingle();

        const isWriter = profile?.role === 'writer' || user.user_metadata?.plan === 'writer';
        const isActive = profile?.subscription_status === 'active';

        if (!isWriter || !isActive) {
          router.push('/pricing');
          return;
        }
      }

      // 3. For Admin Panel, strict email check
      if (pathname.includes('/admin') && user.email !== ADMIN_EMAIL) {
        router.push('/');
        return;
      }

      setIsAuthorized(true);
      setRoleLoading(false);
    }

    checkAuthorization();
  }, [user, loading, router, pathname]);

  if (loading || roleLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">✨</div>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.5em]">Verifying Identity...</p>
        </div>
      </main>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}

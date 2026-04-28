"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated && pathname !== '/login') {
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, pathname, router, mounted]);

  if (!mounted) return null; // or a loading spinner

  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <div className="flex h-screen items-center justify-center bg-[#F8F9FA] text-[#141414] font-bold text-xl uppercase font-mono tracking-widest">ACCESS DENIED</div>;
  }

  return <>{children}</>;
}

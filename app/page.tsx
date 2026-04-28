"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === 'Cajero') {
      router.push('/pos');
    } else {
      router.push('/dashboard');
    }
  }, [router, user]);

  return <div className="h-screen w-full flex items-center justify-center bg-[#F8F9FA] text-[#141414] font-mono text-xs uppercase tracking-widest font-bold">INITIALIZING SYSTEM...</div>;
}

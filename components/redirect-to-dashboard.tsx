'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function RedirectToDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return null;
}

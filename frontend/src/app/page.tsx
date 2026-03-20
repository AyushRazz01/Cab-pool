'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/appStore';

export default function Home() {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      if (user.role === 'DRIVER') {
        router.push('/trips');
      } else {
        router.push('/search');
      }
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return null;
}

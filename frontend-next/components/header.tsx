'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/services/auth';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between h-full px-6">
        <div></div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            {user?.name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
} 
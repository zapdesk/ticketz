'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/services/auth';

interface SidebarItem {
  name: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

const navigation: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (props) => (
      <svg
        fill="none"
        strokeWidth={1.5}
        stroke="currentColor"
        viewBox="0 0 24 24"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
  // Add more navigation items here
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = auth.getUser();

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <main className="py-0">
          <div className="mx-auto max-w-7xl px-0 sm:px-0 lg:px-0">
            {children}
          </div>
        </main>
      </div>

  );
} 
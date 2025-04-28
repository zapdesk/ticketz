'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/lib/services/auth';
import { User } from '@/lib/types/user';
import { useRouter } from 'next/navigation';

interface TicketStats {
  total: number;
  open: number;
  resolved: number;
  pending: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats] = useState<TicketStats>({
    total: 150,
    open: 45,
    resolved: 89,
    pending: 16,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (!userData) {
          router.push('/login');
          return;
        }
        setUser(userData);
        console.log('userData:');
        console.log(userData);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user.email}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your tickets today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tickets */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Tickets</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.total}</dd>
        </div>

        {/* Open Tickets */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Open Tickets</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">{stats.open}</dd>
        </div>

        {/* Resolved Tickets */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Resolved Tickets</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">{stats.resolved}</dd>
        </div>

        {/* Pending Tickets */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Pending Tickets</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-600">{stats.pending}</dd>
        </div>
      </div>
    </div>
  );
} 
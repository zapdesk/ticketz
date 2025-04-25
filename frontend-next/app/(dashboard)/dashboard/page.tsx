'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/services/auth';

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  pendingTickets: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    pendingTickets: 0,
  });
  const [userData, setUserData] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const user = auth.getUser();
    setUserData(user);
  }, []);

  useEffect(() => {
    // TODO: Fetch actual stats from your backend API
    // This is just mock data for now
    setStats({
      totalTickets: 150,
      openTickets: 45,
      resolvedTickets: 89,
      pendingTickets: 16,
    });
  }, []);

  // Use a placeholder during server-side rendering and initial hydration
  const welcomeMessage = userData?.name ? `Welcome back, ${userData.name}!` : 'Welcome back!';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {welcomeMessage}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your tickets today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tickets */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Total Tickets
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats.totalTickets}
          </dd>
        </div>

        {/* Open Tickets */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Open Tickets
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">
            {stats.openTickets}
          </dd>
        </div>

        {/* Resolved Tickets */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Resolved Tickets
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">
            {stats.resolvedTickets}
          </dd>
        </div>

        {/* Pending Tickets */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Pending Tickets
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-600">
            {stats.pendingTickets}
          </dd>
        </div>
      </div>

      {/* TODO: Add more dashboard content like recent tickets, charts, etc. */}
    </div>
  );
} 
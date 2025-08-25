import React, { useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, Calendar, Building2, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBookings } from '@/services/booking.service';
import { useBusinesses, useMyBusinesses } from '@/services/business.service';
import { useServices, useMyServices } from '@/services/service.service';
import { useUserProfile } from '@/services/profile.service';

function BusinessDashboard() {
  const { data: profile } = useUserProfile();
  const isSuperAdmin = profile?.role === 'super_admin';

  const { data: businessesAll } = useBusinesses();
  const { data: businessesMine } = useMyBusinesses();
  const businesses: any[] = isSuperAdmin ? (businessesAll as any[] || []) : (businessesMine as any[] || []);

  const { data: servicesAll } = useServices();
  const { data: servicesMine } = useMyServices();
  const services: any[] = isSuperAdmin ? (servicesAll as any[] || []) : (servicesMine as any[] || []);

  const { data: bookings } = useBookings({ refetchInterval: 10000 });

  const metrics = [
    { title: 'Bookings (live)', value: String((bookings as any[] | undefined)?.length || 0), icon: Calendar },
    { title: 'Businesses', value: String((businesses as any[]).length), icon: Building2 },
    { title: 'Services', value: String((services as any[]).length), icon: Wrench },
    { title: 'Users', value: isSuperAdmin ? '--' : '--', icon: Users },
  ];

  const recentBookings = useMemo(() => (bookings as any[] || []).slice(0, 5), [bookings]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Live overview</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => {
              const Icon = metric.icon as any;
              return (
                <Card key={metric.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {metric.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <p className="text-sm text-gray-500">Last 5 bookings</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((b: any) => (
                    <div key={b.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{b.fullName} • {b.serviceName}</div>
                        <div className="text-xs text-gray-500">{b.date} • {b.email}</div>
                      </div>
                      <Badge variant={b.status === 'pending' ? 'secondary' : b.status === 'confirmed' ? 'default' : 'destructive'}>
                        {b.status}
                      </Badge>
                    </div>
                  ))}
                  {recentBookings.length === 0 && <div className="text-sm text-gray-500">No bookings yet</div>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>At a glance</CardTitle>
                <p className="text-sm text-gray-500">Key totals</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {metrics.map((m) => {
                    const Icon = m.icon as any;
                    return (
                      <div key={m.title} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Icon className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">{m.title}</div>
                          <div className="text-lg font-semibold">{m.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDashboard;
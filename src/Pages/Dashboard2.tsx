import { useState } from 'react';
import { Search } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
// import Sidebar from '@/components/Sidebar';
import Sidebar from '@/components/NewSideBar';
function BusinessDashboard2() {
  const [timeFilter, setTimeFilter] = useState("7");
  
  // Sample data for charts
  const paymentData = [
    { name: '3 Dec', succeeded: 2.00, failed: 6.00, uncaptured: 0, refunded: 0 },
    { name: '4 Dec', succeeded: 1.50, failed: 4.00, uncaptured: 0.5, refunded: 0.2 },
    { name: '5 Dec', succeeded: 3.00, failed: 2.00, uncaptured: 0.3, refunded: 0 },
    { name: '6 Dec', succeeded: 2.50, failed: 3.00, uncaptured: 0.1, refunded: 0.1 },
    { name: 'Today', succeeded: 2.00, failed: 6.00, uncaptured: 0, refunded: 0 },
  ];

  const volumeData = [
    { name: '3 Dec', value: 0 },
    { name: '4 Dec', value: 0.5 },
    { name: '5 Dec', value: 2.0 },
    { name: '6 Dec', value: 0.8 },
    { name: 'Today', value: 0 },
  ];

  const newCustomersData = [
    { name: '3 Dec', value: 0 },
    { name: '4 Dec', value: 1 },
    { name: '5 Dec', value: 2 },
    { name: '6 Dec', value: 0 },
    { name: 'Today', value: 0 },
  ];

  const failedPayments = [
    {
      amount: 'MYR 2.00',
      date: '6 Dec, 00:41',
      email: 'iamleonardkim@gmail.com'
    },
    {
      amount: 'MYR 2.00',
      date: '6 Dec, 00:40',
      email: 'iamleonardkim@gmail.com'
    },
    {
      amount: 'MYR 2.00',
      date: '6 Dec, 00:38',
      email: 'iamleonardkim@gmail.com'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-semibold">Your overview</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Last</span>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span className="text-sm text-gray-500">compared to</span>
              <Select defaultValue="previous">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous">Previous period</SelectItem>
                  <SelectItem value="year">Same period last year</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="daily">
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payments Overview */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  Payments
                </CardTitle>
                <span className="text-xs text-gray-500">Updated yesterday</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Succeeded</span>
                  </div>
                  <p className="text-lg font-medium mt-1">MYR 2.00</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Uncaptured</span>
                  </div>
                  <p className="text-lg font-medium mt-1">MYR 0.00</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                    <span className="text-sm">Refunded</span>
                  </div>
                  <p className="text-lg font-medium mt-1">MYR 0.00</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Failed</span>
                  </div>
                  <p className="text-lg font-medium mt-1">MYR 6.00</p>
                </div>
              </div>
              <div className="h-48">
                <LineChart width={800} height={180} data={paymentData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="succeeded" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="failed" stroke="#F97316" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="uncaptured" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="refunded" stroke="#14B8A6" strokeWidth={2} dot={false} />
                </LineChart>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-8">
            {/* Gross Volume */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-medium">Gross volume</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">+0%</Badge>
                  </div>
                  <span className="text-xs text-gray-500">Updated 06:23</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-lg font-medium">MYR 2.00</p>
                  <p className="text-xs text-gray-500">MYR 0.00 previous period</p>
                </div>
                <div className="h-32">
                  <LineChart width={400} height={120} data={volumeData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  </LineChart>
                </div>
              </CardContent>
            </Card>

            {/* New Customers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-medium">New customers</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">+0%</Badge>
                  </div>
                  <span className="text-xs text-gray-500">Updated 06:23</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-lg font-medium">2</p>
                  <p className="text-xs text-gray-500">0 previous period</p>
                </div>
                <div className="h-32">
                  <LineChart width={400} height={120} data={newCustomersData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  </LineChart>
                </div>
              </CardContent>
            </Card>

            {/* Failed Payments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Failed payments</CardTitle>
                  <span className="text-xs text-gray-500">Updated 06:23</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {failedPayments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">{payment.amount}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">{payment.date}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{payment.email}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-red-100 text-red-700">Failed</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-medium">Top customers by spend</CardTitle>
                    <Badge variant="outline" className="text-xs">All time</Badge>
                  </div>
                  <span className="text-xs text-gray-500">Updated 03:00</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Leonard Kim</p>
                    <p className="text-xs text-gray-500">iamleonardkim@gmail.com</p>
                  </div>
                  <p className="text-sm font-medium">MYR 2.00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BusinessDashboard2;
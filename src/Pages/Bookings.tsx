import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";

const Bookings = () => {
  const [isExpandedNew, setIsExpandedNew] = useState(false);
  const [isExpandedUpcoming, setIsExpandedUpcoming] = useState(false);
  const [isExpandedPast, setIsExpandedPast] = useState(false);

  const bookingData = [
    {
      customerName: "John Doe",
      date: "2025-03-14",
      time: "10:00 AM",
      service: "Haircut",
    },
    {
      customerName: "Jane Smith",
      date: "2025-03-15",
      time: "2:00 PM",
      service: "Massage",
    },
    {
      customerName: "Mike Johnson",
      date: "2025-03-16",
      time: "4:30 PM",
      service: "Manicure",
    },
    {
      customerName: "Emily Davis",
      date: "2025-03-17",
      time: "11:00 AM",
      service: "Facial",
    },
    {
      customerName: "David Wilson",
      date: "2025-03-18",
      time: "1:30 PM",
      service: "Hair Coloring",
    },
  ];

  const upcomingBookings = [
    {
      customerName: "David Wilson",
      date: "2025-03-18",
      time: "1:30 PM",
    },
    {
      customerName: "Emily Davis",
      date: "2025-03-17",
      time: "11:00 AM",
    },
    {
      customerName: "Mike Johnson",
      date: "2025-03-16",
      time: "4:30 PM",
    },
    {
      customerName: "John Doe",
      date: "2025-03-14",
      time: "10:00 AM",
      service: "Haircut",
    },
    {
      customerName: "John Doe",
      date: "2025-03-14",
      time: "10:00 AM",
      service: "Haircut",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex flex-col h-screen gap-4 flex-1 overflow-auto ">
        <div className="w-full">
          <h1 className="text-3xl ml-4 mt-4">Manage Bookings</h1>
        </div>

        <Separator className="bg-gradient-to-b from-blue-600 to-blue-800 border-r-blue-500/30 h-1 p-0 m-0" />

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="h-[100px] rounded-xl bg-muted/50 border-2 border-x-gray-300 flex flex-col p-8 gap-4 justify-center">
              <h1 className="text-2xl">New Booking</h1>
              <h2 className="text-red-500 text-2xl">12</h2>
            </div>

            <div className="flex flex-col gap-4 h-[100px] border-2 border-x-gray-300 p-8 rounded-xl bg-muted/50 justify-center">
              <h1 className="text-2xl">Upcoming Booking</h1>
              <h2 className="text-blue-500 text-2xl">24</h2>
            </div>

            <div className="flex flex-col gap-4 h-[100px] border-2 border-x-gray-300 p-8 rounded-xl bg-muted/50 justify-center">
              <h1 className="text-2xl">Past Booking</h1>
              <h2 className="text-green-500 text-2xl">31</h2>
            </div>
          </div>

          <div className="border-2 border-x-gray-300 rounded-xl bg-muted/50 px-4 md:px-8 py-4">
            <h1 className="text-2xl">New Booking Requests</h1>
            <div
              className={`flex flex-1 flex-col ${
                isExpandedNew ? "h-auto" : "h-[200px]"
              } overflow-hidden overflow-y-scroll overflow-x-scroll gap-4 mt-4`}
            >
              <table className="min-w-full border-collapse border border-gray-300 ">
                <thead className="sticky top-0">
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2 text-start">
                      Customer Name
                    </th>
                    <th className="border border-gray-300 p-2 text-start">
                      Date
                    </th>
                    <th className="border border-gray-300 p-2 text-start">
                      Time
                    </th>
                    <th className="border border-gray-300 p-2 text-start">
                      Service
                    </th>
                    <th className="border border-gray-300 p-2 text-start">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookingData.map((data, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-100">
                      <td className="border-b border-gray-300 p-2 text-gray-500">
                        {data.customerName}
                      </td>
                      <td className="border-b border-gray-300 p-2 text-gray-500">
                        {data.date}
                      </td>
                      <td className="border-b border-gray-300 p-2 text-gray-500">
                        {data.time}
                      </td>
                      <td className="border-b border-gray-300 p-2 text-gray-500">
                        {data.service}
                      </td>
                      <td className="border-b border-gray-300 p-2 flex gap-4">
                        <button className="bg-green-500 text-white px-3 py-1 rounded-xl">
                          Accept
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded-xl">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                className="mt-4 mr-4 font-bold text-blue-500"
                onClick={() => setIsExpandedNew(!isExpandedNew)}
              >
                {isExpandedNew ? "Collapse" : "View All"}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 auto-rows-min gap-4">
            <div className="border-2 col-span-2 border-gray-300 rounded-xl bg-muted/50 px-4 md:px-8 py-4">
              <h1 className="text-2xl mb-4">Upcoming Bookings</h1>
              <div
                className={`${
                  isExpandedUpcoming ? "h-auto" : "h-[200px]"
                } overflow-hidden overflow-y-scroll border border-gray-300 rounded-lg`}
              >
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gradient-to-b from-blue-600 to-blue-800 border-r-blue-500/30 sticky top-0">
                    <tr>
                      <th className="border border-blue-700 p-2 text-start text-white">
                        Customer
                      </th>
                      <th className="border border-blue-700 p-2 text-start text-white">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto w-full">
                    {upcomingBookings.map((booking, index) => (
                      <tr
                        key={index}
                        className="odd:bg-white even:bg-gray-100"
                      >
                        <td className="border-b-2 border-blue-800 p-2 w-1/2 text-gray-500">
                          {booking.customerName}
                        </td>
                        <td className="border-b-2 border-blue-800 p-2 w-1/2 text-gray-500">
                          {booking.date} at {booking.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <button
                  className="mt-4 mr-4 font-bold text-blue-500"
                  onClick={() => setIsExpandedUpcoming(!isExpandedUpcoming)}
                >
                  {isExpandedUpcoming ? "Collapse" : "View All"}
                </button>
              </div>
            </div>

            <div className="border-2 col-span-2 border-gray-300 rounded-xl bg-muted/50 px-4 md:px-8 py-4">
              <h1 className="text-2xl mb-4">Past Bookings</h1>
              <div
                className={`${
                  isExpandedPast ? "h-auto" : "h-[200px]"
                } overflow-hidden overflow-y-scroll border border-gray-300 rounded-lg`}
              >
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gradient-to-b from-blue-600 to-blue-800 border-r-blue-500/30 sticky top-0">
                    <tr>
                      <th className="border-b-2 border-blue-700 p-2 text-start text-white">
                        Customer
                      </th>
                      <th className="border-b-2 border-blue-700 p-2 text-start text-white">
                        Date & Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto w-full">
                    {upcomingBookings.map((booking, index) => (
                      <tr
                        key={index}
                        className="odd:bg-white even:bg-gray-100"
                      >
                        <td className="border-b-2 border-blue-700 p-2 w-1/2 text-gray-500">
                          {booking.customerName}
                        </td>
                        <td className="border-b-2 border-blue-700 p-2 w-1/2 text-gray-500">
                          {booking.date} at {booking.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <button
                  className="mt-4 mr-4 font-bold text-blue-500"
                  onClick={() => setIsExpandedPast(!isExpandedPast)}
                >
                  {isExpandedPast ? "Collapse" : "View All"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bookings;
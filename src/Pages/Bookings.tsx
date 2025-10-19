"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/BookingForm";
import { useBookings, useDeleteBooking } from "@/services/booking.service";
import { updateBookingStatus } from "@/lib/firestoreCrud";

const BookingsPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: bookings, isLoading, error, refetch } = useBookings();
  const { mutate: remove } = useDeleteBooking();

  // ✅ Update booking status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateBookingStatus("bookings", id, newStatus);
      await refetch(); // refresh bookings after update
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
    setOpenId(null);
  };

  // ✅ Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".status-dropdown")) {
        setOpenId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="list">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="list">Bookings</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
            </TabsList>
            <BookingForm />
          </div>

          {/* BOOKINGS LIST */}
          <TabsContent value="list">
            {isLoading && <div>Loading...</div>}
            {error && <div>Failed to load bookings</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(bookings as any[] | undefined)?.map((b: any) => (
                <Card key={b.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{b.fullName}</CardTitle>

                      <div className="relative status-dropdown">
                        {/* Current Status Badge */}
                        <div
                          className="relative group cursor-pointer select-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenId(openId === b.id ? null : b.id);
                          }}
                        >
                          <Badge
                            variant={
                              b.status === "pending"
                                ? "secondary"
                                : b.status === "confirmed"
                                ? "default"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {b.status}
                          </Badge>

                          {/* Tooltip */}
                          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Click to change status
                          </span>
                        </div>

                        {/* Dropdown */}
                        {openId === b.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                            {["pending", "confirmed", "cancelled"]
                              .filter((status) => status !== b.status)
                              .map((status) => (
                                <button
                                  key={status}
                                  onClick={() => updateStatus(b.id, status)}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 capitalize"
                                >
                                  {status}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Date: {b.date}</div>
                      <div>Invoice: {b.invoice}</div>
                      <div>Email: {b.email}</div>
                      <div>Phone: {b.phone}</div>
                      <div>
                        Service: {b.serviceName} (${b.servicePrice})
                      </div>
                      <div>People: {b.numberOfPeople}</div>
                      {b.instructions && <div>Instructions: {b.instructions}</div>}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this item?")) {
                            remove(b.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* CREATE FORM TAB */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BookingsPage;

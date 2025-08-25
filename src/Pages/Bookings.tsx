import React from "react";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/BookingForm";
import { useBookings, useDeleteBooking } from "@/services/booking.service";

const BookingsPage: React.FC = () => {
  const { data: bookings, isLoading, error } = useBookings();
  const { mutate: remove } = useDeleteBooking();

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
          <TabsContent value="list">
            {isLoading && <div>Loading...</div>}
            {error && <div>Failed to load bookings</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(bookings as any[] | undefined)?.map((b: any) => (
                <Card key={b.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{b.fullName}</CardTitle>
                      <Badge variant={b.status === 'pending' ? 'secondary' : b.status === 'confirmed' ? 'default' : 'destructive'}>
                        {b.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Date: {b.date}</div>
                      <div>Invoice: {b.invoice}</div>
                      <div>Email: {b.email}</div>
                      <div>Phone: {b.phone}</div>
                      <div>Service: {b.serviceName} (${b.servicePrice})</div>
                      <div>People: {b.numberOfPeople}</div>
                      {b.instructions && <div>Instructions: {b.instructions}</div>}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" onClick={() => remove(b.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
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



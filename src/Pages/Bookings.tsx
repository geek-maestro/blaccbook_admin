import React from "react";
import Sidebar from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";

const Bookings = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex lg:flex-col gap-4 w-full">
        <div className="w-full">
          <h1 className="text-3xl ml-12 mt-4">Manage Bookings</h1>
        </div>
        <Separator className="bg-blue-500/50 h-1" />
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

            <div className=" flex flex-col gap-4 h-[100px] border-2 border-x-gray-300 p-8 rounded-xl bg-muted/50 justify-center ">
              <h1 className="text-2xl">Past Booking</h1>
              <h2 className="text-green-500 text-2xl">31</h2>
            </div>
          </div>

          <div className=" border-2 border-x-gray-300 rounded-xl bg-muted/50 p-8">
            <h1 className="text-2xl">New Booking Requests</h1>
            <div className="flex flex-1 flex-col h-[200px] overflow-hidden overflow-y-scroll gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-video h-12 w-full rounded-lg bg-gray-200"
                />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-4 auto-rows-min gap-4">
            <div className="col-span-2 border-2 border-x-gray-300 h-[200px] rounded-xl py-4 px-8">
              <h1 className="text-2xl">Upcoming Bookings</h1>
              <div className="flex flex-1 flex-col h-[120px] overflow-hidden overflow-y-scroll gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-video h-12 w-full rounded-lg bg-gray-200"
                  />
                ))}
              </div>
            </div>

            <div className="col-span-2 border-2 border-x-gray-300 h-[200px] rounded-xl py-4 px-8">
              <h1 className="text-2xl">Past Bookings</h1>
              <div className="flex flex-1 flex-col h-[120px] overflow-hidden overflow-y-scroll gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-video h-12 w-full rounded-lg bg-gray-200"
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;

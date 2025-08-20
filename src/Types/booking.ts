export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type IBooking = {
  id?: string;
  date: string; // e.g. "2025-04-05"
  email: string;
  fullName: string;
  instructions?: string;
  invoice: string;
  numberOfPeople: number;
  phone: string;
  serviceName: string;
  servicePrice: number;
  status: BookingStatus;
};



export type BookingStatus = "pending" | "confirmed" | "cancelled" | "accepted" | "rejected";

export interface IApiBooking {
  id: string;
  customerUid: string;
  businessId: string;
  merchantUid: string;
  serviceId: string;
  serviceName: string;
  businessName: string;
  businessAddress: string;
  bookingDate: string;
  bookingTime: string;
  quantity: number;
  notes: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

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



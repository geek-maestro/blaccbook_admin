import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IBooking } from "@/Types/booking";
import { useAddBooking } from "@/services/booking.service";

const BookingForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { mutate: addBooking, isPending } = useAddBooking();
  const [form, setForm] = useState<IBooking>({
    date: "",
    email: "",
    fullName: "",
    instructions: "",
    invoice: "",
    numberOfPeople: 1,
    phone: "",
    serviceName: "",
    servicePrice: 0,
    status: "pending",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value } as any));
  };

  const handleNumber = (name: keyof Pick<IBooking, 'numberOfPeople' | 'servicePrice'>, value: string) => {
    setForm((p) => ({ ...p, [name]: Number(value || 0) }));
  };

  const handleSubmit = () => {
    addBooking(form, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Booking</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Booking</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Invoice</Label>
            <Input name="invoice" value={form.invoice} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Full Name</Label>
            <Input name="fullName" value={form.fullName} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Phone</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Service</Label>
            <Input name="serviceName" value={form.serviceName} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Price</Label>
            <Input type="number" value={form.servicePrice} onChange={(e) => handleNumber('servicePrice', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">People</Label>
            <Input type="number" value={form.numberOfPeople} onChange={(e) => handleNumber('numberOfPeople', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 md:col-span-2">
            <Label className="text-right">Instructions</Label>
            <Input name="instructions" value={form.instructions || ""} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <select
              className="col-span-3 border rounded px-3 py-2"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as IBooking['status'] }))}
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;



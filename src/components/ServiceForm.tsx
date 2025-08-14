import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IService } from "@/Types/service";
import { useAddService } from "@/services/service.service";
import { uploadMerchantImage } from "@/services/imageUpload.service";
import { useMerchants } from "@/services/merchant.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = { defaultMerchantId?: string; onCreated?: () => void };

const ServiceForm: React.FC<Props> = ({ defaultMerchantId = "", onCreated }) => {
  const [open, setOpen] = useState(false);
  const { mutate: addService, isPending } = useAddService();
  const [uploading, setUploading] = useState(false);
  const { data: merchants } = useMerchants();

  const [form, setForm] = useState<IService>({
    merchantId: defaultMerchantId,
    icon: "",
    serviceType: "",
    title: "",
    description: "",
    price: 0,
    availability: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isProduct: false,
    stock: 0,
    reviews: { average: 0, count: 0 },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value } as IService));
  };

  const handleNumber = (name: keyof Pick<IService, 'price' | 'stock'>, value: string) => {
    setForm((p) => ({ ...p, [name]: Number(value || 0) }));
  };

  const handleAvailability = (day: keyof NonNullable<IService['availability']>, value: string) => {
    setForm((p) => ({ ...p, availability: { ...(p.availability || {}), [day]: value } }));
  };

  const handleIconFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      // Reuse merchant upload path, grouping under merchantId/services
      const url = await uploadMerchantImage(file, form.merchantId || "services");
      setForm((p) => ({ ...p, icon: url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    addService(form, {
      onSuccess: () => {
        setOpen(false);
        onCreated?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Service</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Service</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Merchant</Label>
            <div className="col-span-3">
              <Select value={form.merchantId} onValueChange={(v) => setForm((p) => ({ ...p, merchantId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a merchant" />
                </SelectTrigger>
                <SelectContent>
                  {merchants?.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name || m.email || m.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Service Type</Label>
            <Input name="serviceType" value={form.serviceType} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Title</Label>
            <Input name="title" value={form.title} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Price</Label>
            <Input type="number" value={form.price} onChange={(e) => handleNumber('price', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 md:col-span-2">
            <Label className="text-right">Icon</Label>
            <Input type="file" accept="image/*" onChange={handleIconFile} className="col-span-3" />
          </div>
          <div className="md:col-span-2">
            <div className="mb-2 font-medium">Availability</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(["monday","tuesday","wednesday","thursday","friday","saturday","sunday"] as const).map((day) => (
                <div key={day} className="grid grid-cols-2 items-center gap-2">
                  <Label className="capitalize">{day}</Label>
                  <Input value={form.availability?.[day] || ""} onChange={(e) => handleAvailability(day, e.target.value)} placeholder="08:00-20:00" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Stock</Label>
            <Input type="number" value={form.stock ?? 0} onChange={(e) => handleNumber('stock', e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending || uploading}>{uploading ? 'Uploading...' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;



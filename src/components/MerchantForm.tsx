import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMerchant } from "@/Types/merchant";
import { useAddMerchant } from "@/services/merchant.service";
import { uploadMerchantImage } from "@/services/imageUpload.service";
import { auth } from "@/lib/firebaseConfig";

type Props = { onCreated?: () => void };

const MerchantForm: React.FC<Props> = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const { mutate: addMerchant, isPending } = useAddMerchant();

  const [form, setForm] = useState<IMerchant>({
    id: undefined,
    name: "",
    phone: "",
    email: "",
    address: "",
    image: "",
    role: "merchant",
    approvalStatus: "pending",
    documentURL: "",
    serviceTypes: [],
    website: "",
    availability: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
    pricing: { fixedPrice: undefined, hourlyRate: undefined },
    reviews: { average: 0, count: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceTokens: [],
    ownerUserId: "",
    assignedAdminId: "",
  });

  const [serviceTypesInput, setServiceTypesInput] = useState("");
  const [deviceTokensInput, setDeviceTokensInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as IMerchant));
  };

  const handleAvailabilityChange = (
    day: keyof NonNullable<IMerchant["availability"]>,
    field: "open" | "close",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      availability: {
        ...(prev.availability || {}),
        [day]: { ...(prev.availability?.[day] || { open: "", close: "" }), [field]: value },
      },
    }));
  };

  const handlePricingChange = (field: "fixedPrice" | "hourlyRate", value: string) => {
    const num = value === "" ? undefined : Number(value);
    setForm((prev) => ({
      ...prev,
      pricing: { ...(prev.pricing || {}), [field]: num },
    }));
  };

  const handleReviewsChange = (field: "average" | "count", value: string) => {
    const num = Number(value || 0);
    setForm((prev) => ({
      ...prev,
      reviews: { ...(prev.reviews || { average: 0, count: 0 }), [field]: num },
    }));
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const uid = auth.currentUser?.uid || "temp";
      const url = await uploadMerchantImage(file, uid);
      setForm((prev) => ({ ...prev, image: url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    const payload: IMerchant = {
      ...form,
      serviceTypes: serviceTypesInput
        ? serviceTypesInput.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      deviceTokens: deviceTokensInput
        ? deviceTokensInput.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      updatedAt: new Date().toISOString(),
    };

    addMerchant(payload, {
      onSuccess: () => {
        setOpen(false);
        onCreated?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Merchant</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Merchant</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Firestore ID will be auto-generated; no manual input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 md:col-span-2">
            <Label htmlFor="address" className="text-right">Address</Label>
            <Input id="address" name="address" value={form.address} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">Website</Label>
            <Input id="website" name="website" value={form.website || ""} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 md:col-span-2">
            <Label className="text-right">Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageFile} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="documentURL" className="text-right">Document URL</Label>
            <Input id="documentURL" name="documentURL" value={form.documentURL || ""} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Approval Status</Label>
            <select
              className="col-span-3 border rounded px-3 py-2"
              value={form.approvalStatus}
              onChange={(e) => setForm((p) => ({ ...p, approvalStatus: e.target.value as IMerchant["approvalStatus"] }))}
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Service Types</Label>
            <Input placeholder="Comma separated" value={serviceTypesInput} onChange={(e) => setServiceTypesInput(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 md:col-span-2">
            <Label className="text-right">Device Tokens</Label>
            <Input placeholder="Comma separated" value={deviceTokensInput} onChange={(e) => setDeviceTokensInput(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ownerUserId" className="text-right">Owner User ID</Label>
            <Input id="ownerUserId" name="ownerUserId" value={form.ownerUserId || ""} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedAdminId" className="text-right">Assigned Admin ID</Label>
            <Input id="assignedAdminId" name="assignedAdminId" value={form.assignedAdminId || ""} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Pricing (Fixed)</Label>
            <Input type="number" value={form.pricing?.fixedPrice ?? ""} onChange={(e) => handlePricingChange("fixedPrice", e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Pricing (Hourly)</Label>
            <Input type="number" value={form.pricing?.hourlyRate ?? ""} onChange={(e) => handlePricingChange("hourlyRate", e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Reviews Avg</Label>
            <Input type="number" step="0.1" value={form.reviews?.average ?? 0} onChange={(e) => handleReviewsChange("average", e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Reviews Count</Label>
            <Input type="number" value={form.reviews?.count ?? 0} onChange={(e) => handleReviewsChange("count", e.target.value)} className="col-span-3" />
          </div>
          <div className="md:col-span-2">
            <div className="mb-2 font-medium">Availability</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(["monday","tuesday","wednesday","thursday","friday","saturday","sunday"] as const).map((day) => (
                <div key={day} className="grid grid-cols-3 items-center gap-2">
                  <Label className="capitalize">{day}</Label>
                  <Input placeholder="open" value={form.availability?.[day]?.open || ""} onChange={(e) => handleAvailabilityChange(day, "open", e.target.value)} />
                  <Input placeholder="close" value={form.availability?.[day]?.close || ""} onChange={(e) => handleAvailabilityChange(day, "close", e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending || uploading}>{uploading ? "Uploading..." : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantForm;



import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { IService } from "@/Types/service";
import { useAddService, useEditService, useAddProduct } from "@/services/service.service";
import { useMerchants, useMyMerchant } from "@/services/merchant.service";
import { useApiBusinesses } from "@/services/business.service";
import { useUserProfile } from "@/services/profile.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapPicker from "@/components/MapPicker";
import { Textarea } from "@/components/ui/textarea";

type Props = { defaultMerchantId?: string; onCreated?: () => void; serviceToEdit?: IService };

const ServiceForm: React.FC<Props> = ({ defaultMerchantId = "", onCreated, serviceToEdit }) => {
  const [open, setOpen] = useState(false);

  // We no longer need custom types since we have dynamic categories API
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const isProduct = selectedCategory?.type?.toLowerCase() === 'product';

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await fetch('https://api-wki5bofifq-uc.a.run.app/content/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    }
  });
  const categoriesList = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.items || categoriesData?.data || []);

  const { mutate: addService, isPending: isAddingService } = useAddService();
  const { mutate: addProduct, isPending: isAddingProduct } = useAddProduct();
  const { mutate: editService, isPending: isEditing } = useEditService();
  const isPending = isAddingService || isAddingProduct || isEditing;
  const [uploading, setUploading] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const { data: profile } = useUserProfile();
  const isSuperAdmin = profile?.role === 'super_admin';
  const { data: merchantsAll } = useMerchants(!!isSuperAdmin);
  const { data: merchantsMine } = useMyMerchant();
  const merchants = isSuperAdmin ? merchantsAll : merchantsMine;

  const { data: apiBusinesses } = useApiBusinesses();
  // We only permit creating services under approved businesses tied to this merchant (or all if super admin and no default passed).
  const businesses = apiBusinesses?.filter((b: any) => 
    (isSuperAdmin || b.merchantUid === profile?.uid || b.merchantUid === defaultMerchantId) && 
    b.verificationStatus === 'approved' // Or b.isActive if that's the desired metric, let's use both maybe, or just the status from the API.
  ) || [];

  const [form, setForm] = useState<IService>(
    serviceToEdit || {
      merchantId: defaultMerchantId,
      icon: "",
      serviceType: "",
      title: "",
      description: "",
      price: 0,
      hourlyPrice: 0,
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
      location: undefined,
    }
  );

  // Sync state if serviceToEdit prop changes
  React.useEffect(() => {
    if (serviceToEdit) {
      setForm(serviceToEdit);
    }
  }, [serviceToEdit]);

  // Sync selected category when categories list loads or form serviceType changes
  React.useEffect(() => {
    if (form.serviceType && categoriesList.length > 0) {
      const cat = categoriesList.find((c: any) => c.id === form.serviceType);
      if (cat) setSelectedCategory(cat);
    }
  }, [form.serviceType, categoriesList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value } as IService));
  };

  const handleNumber = (name: keyof Pick<IService, 'price' | 'hourlyPrice' | 'stock'>, value: string) => {
    setForm((p) => ({ ...p, [name]: Number(value || 0) }));
  };

  const handleAvailability = (day: keyof NonNullable<IService['availability']>, value: string) => {
    setForm((p) => ({ ...p, availability: { ...(p.availability || {}), [day]: value } }));
  };

  const handleIconFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("[ServiceForm] File selected:", file.name, file.size, file.type);
    setIconFile(file);
    // Show filename or preview in form state
    setForm((p) => ({ ...p, icon: file.name }));
  };

  const handleSubmit = () => {
    console.log("[ServiceForm] handleSubmit called with iconFile:", iconFile ? `${iconFile.name} (${iconFile.size}B)` : "null");
    if (serviceToEdit && serviceToEdit.id) {
      editService({ ...form, id: serviceToEdit.id, iconFile: iconFile || undefined }, {
        onSuccess: () => {
          console.log("[ServiceForm] Edit success, resetting iconFile");
          setIconFile(null);
          setOpen(false);
          onCreated?.();
        },
        onError: (err: any) => {
          console.error("Edit failed:", err);
          alert(err.message);
        }
      });
    } else {
      if (isProduct) {
        addProduct({ ...form, iconFile: iconFile || undefined }, {
          onSuccess: () => {
            console.log("[ServiceForm] Product add success, resetting iconFile");
            setIconFile(null);
            setOpen(false);
            onCreated?.();
          },
          onError: (err: any) => {
            console.error("Add product failed:", err);
            alert(err.message);
          }
        });
      } else {
        addService({ ...form, iconFile: iconFile || undefined }, {
          onSuccess: () => {
            console.log("[ServiceForm] Service add success, resetting iconFile");
            setIconFile(null);
            setOpen(false);
            onCreated?.();
          },
          onError: (err: any) => {
            console.error("Add service failed:", err);
            alert(err.message);
          }
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        console.log("[ServiceForm] Dialog closing, resetting iconFile");
        setIconFile(null);
      }
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button variant={serviceToEdit ? "outline" : "default"} size={serviceToEdit ? "sm" : "default"}>
          {serviceToEdit ? "Edit" : "Add Service/Product"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{serviceToEdit ? "Edit" : "New Service/Product"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Business</Label>
            <div className="col-span-3">
              <Select
                value={form.businessId || ''}
                onValueChange={(v) => {
                  setForm((p) => ({ ...p, businessId: v }));
                  const biz = businesses?.find((b: any) => b.id === v);
                  if (biz?.merchantUid) {
                    setForm((p) => ({ ...p, merchantId: biz.merchantUid }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  {businesses?.map((b: any) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.businessName || b.name || "Unnamed Business"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Category</Label>
            <div className="col-span-3 flex space-x-2">
              <Select
                value={form.serviceType}
                onValueChange={(v) => {
                  const cat = categoriesList.find((c: any) => c.id === v);
                  setSelectedCategory(cat);
                  setForm((p) => ({ ...p, serviceType: v }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesList.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name || cat.title || 'Unnamed'} ({cat.type || 'service'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Title</Label>
            <Input name="title" value={form.title} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Description</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>}
              className="col-span-3"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Price ($)</Label>
            <Input type="number" value={form.price} onChange={(e) => handleNumber('price', e.target.value)} className="col-span-3" />
          </div>
          
          {!isProduct && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Hourly Price ($)</Label>
                <Input type="number" value={form.hourlyPrice ?? 0} onChange={(e) => handleNumber('hourlyPrice', e.target.value)} className="col-span-3" />
              </div>
              <div className="md:col-span-2">
                <div className="mb-2 font-medium">Availability</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const).map((day) => (
                    <div key={day} className="grid grid-cols-2 items-center gap-2">
                      <Label className="capitalize">{day}</Label>
                      <Input value={form.availability?.[day] || ""} onChange={(e) => handleAvailability(day, e.target.value)} placeholder="e.g. 08:00-20:00 or Closed" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {isProduct && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Stock Quantity</Label>
              <Input type="number" value={form.stock ?? 0} onChange={(e) => handleNumber('stock', e.target.value)} className="col-span-3" />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4 md:col-span-2">
            <Label className="text-right">Image/Icon</Label>
            <Input type="file" accept="image/*" onChange={handleIconFile} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4 md:col-span-2">
            <div className="mb-2 font-medium">Location</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input placeholder="lat" value={form.location?.lat ?? ''} onChange={(e) => setForm((p) => ({ ...p, location: { ...(p.location || { lat: 0, lng: 0 }), lat: Number(e.target.value || 0) } }))} />
              <Input placeholder="lng" value={form.location?.lng ?? ''} onChange={(e) => setForm((p) => ({ ...p, location: { ...(p.location || { lat: 0, lng: 0 }), lng: Number(e.target.value || 0) } }))} />
            </div>
            {/* <MapPicker
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
              value={form.location || null}
              onChange={(coords) => setForm((p) => ({ ...p, location: coords }))}
              height="260px"
              address={form.locationAddress}
              onAddressChange={(address: string) => setForm((p) => ({ ...p, locationAddress: address }))}
            /> */}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending || uploading}>{uploading ? 'Uploading...' : (serviceToEdit ? 'Save Changes' : 'Create')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;



import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAddBizz } from "@/services/business.service";
import { IBusiness } from "@/Types/business";
import { features } from "process";

const AddBusinessForm = () => {
  const [open, setOpen] = useState(false);
  const { mutate: addBusiness, isPending, error } = useAddBizz();
  const [formData, setFormData] = useState<IBusiness>({
    name: "",
    email: "",
    featuredImage: "",
    description: "",
    website: "",
    contact: {
      telephone: "",
      countryCode: "",
      country: "",
      state: "",
      city: "",
      street: "",
      mapLocation: {
        lat: "",
        lng: "",
        staticMapUri: "",
        mapUrl: "",
      },
    },
    address: "",
    isBookable: false,
    hasMenu: false,
    categories: [],
    images: [],
    features: [],
    rating: 0,
    isEcommerce: false,
    isBanned: false,
    createdAt: new Date().toISOString(),
  });
  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      ...(name in prev.contact
        ? { contact: { ...prev.contact, [name]: value } } // Update contact fields
        : { [name]: value }), // Update top-level fields
    }));
  };

  const handleSwitchChange = (name: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name], // Correctly toggles boolean values
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    const businessData = {
      ...formData,
      categories: formData.categories ?? [],
      images: formData.images ?? [],
      features: formData.features ?? [],
    };
  
    addBusiness(businessData, {
      onSuccess: () => {
        setOpen(false);
        console.log("Business added successfully!");
      },
      onError: (error) => {
        console.error("Error adding business:", error);
      },
    });
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Business
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Business</DialogTitle>
          <DialogDescription>
            Enter the details of the new business below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter business name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="business@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter business description"
                className="h-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categories">Category</Label>
              <Select
                value={formData.categories && formData.categories[0] ? formData.categories[0] : ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    categories: value ? [value] : [],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Restaurants">Restaurants – Book tables or order food from top restaurants.</SelectItem>
                  <SelectItem value="Perfume">Perfume – Browse and purchase your favorite perfumes and fragrances.</SelectItem>
                  <SelectItem value="Barbering">Barbering – Book barber appointments for haircuts and grooming services.</SelectItem>
                  <SelectItem value="Cleaning">Cleaning – Schedule professional home or office cleaning services.</SelectItem>
                  <SelectItem value="Hotels">Hotels – Book hotel rooms, resorts, and accommodations.</SelectItem>
                  <SelectItem value="Plumbering">Plumbering – Request expert plumbing services for repairs and installations.</SelectItem>
                  <SelectItem value="Health">Health – Access healthcare services, wellness programs, and appointments.</SelectItem>
                  <SelectItem value="More">More – Explore additional categories and offerings.</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  value={formData.contact.telephone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.contact.country}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, country: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.contact.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Business Street"
              />
            </div>
          </div>

          {/* Business Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Features</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isBookable"
                  checked={formData.isBookable}
                  onCheckedChange={() => handleSwitchChange("isBookable")}
                />
                <Label htmlFor="isBookable">Enable Bookings</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="hasMenu"
                  checked={formData.hasMenu}
                  onCheckedChange={() => handleSwitchChange("hasMenu")}
                />
                <Label htmlFor="hasMenu">Has Menu</Label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Business"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBusinessForm;

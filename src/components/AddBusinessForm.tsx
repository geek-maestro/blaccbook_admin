import React, { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import MapPicker from "@/components/MapPicker";

const AddBusinessForm = () => {
  const [open, setOpen] = useState(false);
  const { mutate: addBusiness, isPending, error } = useAddBizz();
  const { toast } = useToast();
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

  // Image upload states
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, featuredImage: previewUrl }));
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryImageFiles(prev => [...prev, ...files]);
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newPreviewUrls]
      }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const uploadImages = async (businessId: string) => {
    const uploadedImages: { featuredImage?: string; galleryImages: string[] } = {
      galleryImages: []
    };
    let uploadErrors: string[] = [];

    try {
      // Upload featured image if exists
      if (featuredImageFile) {
        try {
          const { uploadBusinessImage } = await import("@/services/imageUpload.service");
          const featuredImageUrl = await uploadBusinessImage(featuredImageFile, businessId, 'featured');
          uploadedImages.featuredImage = featuredImageUrl;
        } catch (error) {
          console.error("Error uploading featured image:", error);
          uploadErrors.push("Featured image upload failed");
        }
      }

      // Upload gallery images if exist
      if (galleryImageFiles.length > 0) {
        try {
          const { uploadBusinessImage } = await import("@/services/imageUpload.service");
          const galleryImageUrls = await Promise.all(
            galleryImageFiles.map(file => uploadBusinessImage(file, businessId, 'gallery'))
          );
          uploadedImages.galleryImages = galleryImageUrls;
        } catch (error) {
          console.error("Error uploading gallery images:", error);
          uploadErrors.push("Gallery images upload failed");
        }
      }

      return { uploadedImages, uploadErrors };
    } catch (error) {
      console.error("Error in image upload process:", error);
      uploadErrors.push("Image upload process failed");
      return { uploadedImages, uploadErrors };
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setUploadingImages(true);

    try {
      // First, create the business to get an ID
      const businessData = {
        ...formData,
        categories: formData.categories ?? [],
        images: [], // Start with empty images array
        features: formData.features ?? [],
      };

      // Add the business first to get an ID
      addBusiness(businessData, {
        onSuccess: async (result) => {
          if (result?.objectId) {
            // Upload images after business is created
            const { uploadedImages, uploadErrors } = await uploadImages(result.objectId);
            
            // Update the business with the uploaded images
            if (uploadedImages.featuredImage || uploadedImages.galleryImages.length > 0) {
              try {
                const { useEditBizz } = await import("@/services/business.service");
                const editBusiness = useEditBizz();
                
                const updateData: any = {};
                if (uploadedImages.featuredImage) {
                  updateData.featuredImage = uploadedImages.featuredImage;
                }
                if (uploadedImages.galleryImages.length > 0) {
                  updateData.images = uploadedImages.galleryImages;
                }
                
                editBusiness.mutate({
                  id: result.objectId,
                  ...updateData
                });
              } catch (error) {
                console.error("Error updating business with images:", error);
                uploadErrors.push("Failed to update business with images");
              }
            }

            setOpen(false);
            setUploadingImages(false);
            
            if (uploadErrors.length > 0) {
              toast({
                title: "Business Added with Warnings",
                description: `Business created successfully, but some images failed to upload: ${uploadErrors.join(', ')}`,
                variant: "default",
              });
            } else {
              toast({
                title: "Success",
                description: "Business added successfully with images!",
              });
            }
            
            resetForm();
          }
        },
        onError: (error) => {
          setUploadingImages(false);
          console.error("Error adding business:", error);
          toast({
            title: "Error",
            description: "Failed to add business. Please try again.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      setUploadingImages(false);
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    // Clean up blob URLs to prevent memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setFormData({
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
    setFeaturedImageFile(null);
    setGalleryImageFiles([]);
    setPreviewUrls([]);
  };

  // Clean up blob URLs when component unmounts or dialog closes
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
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
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="business@example.com"
                  required
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

            {/* Featured Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="featuredImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('featuredImage')?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {formData.featuredImage && (
                <div className="relative inline-block">
                  <img
                    src={formData.featuredImage}
                    alt="Featured preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => {
                      setFeaturedImageFile(null);
                      setFormData(prev => ({ ...prev, featuredImage: "" }));
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Gallery Images Upload */}
            <div className="space-y-2">
              <Label htmlFor="galleryImages">Gallery Images</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="galleryImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('galleryImages')?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
            <div className="space-y-2">
              <Label>Map Location</Label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  name="lat"
                  placeholder="lat"
                  value={formData.contact.mapLocation.lat}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, mapLocation: { ...prev.contact.mapLocation, lat: e.target.value } }
                  }))}
                />
                <Input
                  name="lng"
                  placeholder="lng"
                  value={formData.contact.mapLocation.lng}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, mapLocation: { ...prev.contact.mapLocation, lng: e.target.value } }
                  }))}
                />
              </div>
              <MapPicker
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
                value={(formData.contact.mapLocation.lat && formData.contact.mapLocation.lng) ? { lat: Number(formData.contact.mapLocation.lat), lng: Number(formData.contact.mapLocation.lng) } : null}
                onChange={(coords) => setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, mapLocation: { ...prev.contact.mapLocation, lat: String(coords.lat), lng: String(coords.lng) } }
                }))}
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
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending || uploadingImages}>
              {isPending || uploadingImages ? "Adding..." : "Add Business"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBusinessForm;

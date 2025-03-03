import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Calendar,
  ArrowLeft,
  Image as ImageIcon,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockBusinesses } from "@/Data/business";
import Sidebar from "@/components/Sidebar";
import { Switch } from "./ui/switch";
import { IBusiness, IProduct } from "@/Types/business";
import { Textarea } from "./ui/textarea";
import {
  useBusinessById,
  useBusinesses,
  useEditBizz,
} from "@/services/business.service";
import { auth } from "@/lib/firebaseConfig";

const useBusinessData = (initialBusinesses: any[]) => {
  const [businesses, setBusinesses] = useState(initialBusinesses);

  // const updateBusiness = (id: string, updatedBusiness: any) => {
  //   setBusinesses((prev) =>
  //     prev.map((business) =>
  //       business.id === id ? { ...business, ...updatedBusiness } : business
  //     )
  //   );
  // };

  const deleteBusiness = (id: string) => {
    setBusinesses((prev) => prev.filter((business) => business.id !== id));
  };

  // const banBusiness = (id: string) => {
  //   setBusinesses((prev) =>
  //     prev.map((business) =>
  //       business.id === id ? { ...business, isBanned: true } : business
  //     )
  //   );
  // };

  return { businesses, deleteBusiness };
};
const BusinessDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    data: business,
    isLoading,
    error: fetchError,
  } = useBusinessById(id as string);

  console.log(business);

  const {
    mutate: banBusiness,
    isPending: banning,
    error: banError,
  } = useEditBizz();

  const {
    mutate: updateBusiness,
    isPending: updating,
    error: updateError,
  } = useEditBizz();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [editedBusiness, setEditedBusiness] = useState<IBusiness | null>(null);
  // const user = auth.currentUser;

  const userData = JSON.parse(localStorage.getItem("vendorData") || "{}");

  useEffect(() => {
    if (userData) {
      console.log(userData, "user");
    } else {
      navigate("/login");
    }
  }, [userData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (fetchError) {
    return <div>Error loading business</div>;
  }

  

  if (!business) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
            <Link to="/business">
              <Button>Back to Businesses</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handleEdit = () => {
    setEditedBusiness({ ...business }); // Ensure it's always an object
    setIsEditModalOpen(true);
  };

  const handleUpdate = (id: string) => {
    if (!editedBusiness) return;

    updateBusiness(
      {
        id,
        createdAt: new Date().toISOString(),
        isBanned: false,
        ...editedBusiness,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
        },
        onError: (error: unknown) => {
          console.error("Error updating business:", error);
        },
      }
    );
  };

  // const handleSaveEdit = () => {
  //   updateBusiness(business.id, editedBusiness);
  // };

  const handleDelete = () => {
    // Implement delete mutation here
    navigate("/business");
  };

  const handleBan = () => {
    if (business?.id) {
      banBusiness(
        {
          id: business.id,
          ...business, // Spread existing business data
          isBanned: true, // Override the isBanned property
        },
        {
          onSuccess: () => {
            setIsBanModalOpen(false);
            navigate("/business");
          },
        }
      );
    }
  };

  // const handleBan = () => {
  //   banBusiness(business.id);
  //   navigate("/business");
  // };

  const handleInputChange = (field: keyof IBusiness, value: any) => {
    setEditedBusiness((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleNestedChange = (
    parent: keyof IBusiness,
    field: string,
    value: any
  ) => {
    setEditedBusiness((prev) => {
      if (!prev) return null;
      const parentObj = prev[parent] as Record<string, any>;
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: value,
        },
      };
    });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "featuredImage" | "images"
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (field === "featuredImage") {
      const imageUrl = URL.createObjectURL(files[0]);
      handleInputChange("featuredImage", imageUrl);
    } else {
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      handleInputChange("images", [
        ...(editedBusiness?.images || []),
        ...imageUrls,
      ]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const imageUrls = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );

    handleInputChange("images", [
      ...(editedBusiness?.images || []),
      ...imageUrls,
    ]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(editedBusiness?.images || [])];
    updatedImages.splice(index, 1);
    handleInputChange("images", updatedImages);
  };

  const handleAddProduct = () => {
    handleInputChange("products", [
      ...(editedBusiness?.products || []),
      { name: "", price: 0, image: "" },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...(editedBusiness?.products || [])];
    updatedProducts.splice(index, 1);
    handleInputChange("products", updatedProducts);
  };

  const handleProductChange = (
    index: number,
    field: keyof IProduct,
    value: string | number
  ) => {
    const updatedProducts = [...(editedBusiness?.products || [])];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    handleInputChange("products", updatedProducts);
  };

  const handleProductImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!e.target.files) return;
    const imageUrl = URL.createObjectURL(e.target.files[0]);

    const updatedProducts = [...(editedBusiness?.products || [])];
    updatedProducts[index] = { ...updatedProducts[index], image: imageUrl };
    handleInputChange("products", updatedProducts);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="container mx-auto p-6 space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
            <Link
              to="/business"
              className="inline-flex items-center hover:text-blue-600"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Businesses
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Business
                </DropdownMenuItem>
                {userData && userData.role === "admin" && (
                  <>
                    <DropdownMenuItem
                      onSelect={() => setIsDeleteModalOpen(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Business
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setIsBanModalOpen(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Ban className="mr-2 h-4 w-4" /> Ban Business
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Main Content */}
          <div className="grid gap-6">
            {/* Business Overview Card */}
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {business.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-lg">
                      <MapPin className="h-5 w-5 mr-2" />
                      {business.contact.street}, {business.contact.city},{" "}
                      {business.contact.state}
                    </CardDescription>
                  </div>
                  {business.rating && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-2 text-lg p-2"
                    >
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      {business.rating}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Business Details */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">
                        Contact Information
                      </h2>
                      <div className="space-y-2 text-gray-700">
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 mr-2 text-gray-500" />
                          {business.contact.countryCode}{" "}
                          {business.contact.telephone}
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-gray-500" />
                          {business.website ? (
                            <a
                              href={business.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600"
                            >
                              {business.website}
                            </a>
                          ) : (
                            "No website available"
                          )}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                          Established on{" "}
                          {formatDate(business?.createdAt as string)}
                        </div>
                      </div>
                    </div>

                    {business.features && business.features.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold mb-3">Features</h2>
                        <div className="flex flex-wrap gap-2">
                          {business.features.map((feature: any) => (
                            <Badge key={feature} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {business.categories && business.categories.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold mb-3">
                          Categories
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {business.categories.map((category: any) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Images and Actions */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3 flex items-center">
                        <ImageIcon className="h-5 w-5 mr-2" /> Gallery
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        {business.images
                          ?.slice(0, 4)
                          .map((image: any, index: number) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${business.name} gallery image ${
                                index + 1
                              }`}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                          )) || <p>No images available</p>}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {business.isBookable && business.bookableDetails && (
                        <Button className="flex-1">
                          Book{" "}
                          {business.bookableDetails.bookableItemName ||
                            "Service"}
                        </Button>
                      )}

                      {business.hasMenu && (
                        <Button variant="outline" className="flex-1">
                          View Menu
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Section */}
            {business?.products && business.products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    Available products and services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {business.products.map((product, index) => (
                      <Card
                        key={index}
                        className="group hover:shadow-lg transition-shadow duration-200"
                      >
                        <div className="relative h-48">
                          <img
                            src={product.image || "/placeholder-image.png"}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <CardContent className="flex-1 p-4 space-y-2">
                          <h3 className="font-semibold text-lg line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-blue-600 font-bold text-xl">
                            ${product.price.toFixed(2)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-[80vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Business</DialogTitle>
                <DialogDescription>
                  Make changes to the business details
                </DialogDescription>
              </DialogHeader>
              {editedBusiness && (
                <div className="grid gap-6 py-6">
                  {/* Basic Information */}
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  {/* Featured Image */}
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Featured Image</Label>
                    <Input
                      type="file"
                      id="featuredImage"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "featuredImage")}
                    />
                    {editedBusiness.featuredImage && (
                      <img
                        src={editedBusiness.featuredImage}
                        alt="Featured"
                        className="w-full h-40 object-cover mt-2 rounded-lg"
                      />
                    )}
                  </div>

                  {/* Gallery Images */}
                  {/* Images Section */}
                  <h3 className="text-lg font-semibold">Business Images</h3>

                  {/* File Input for Multiple Image Uploads */}
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>

                  {/* Display Uploaded Images */}
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    {editedBusiness.images?.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Business Image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✖
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editedBusiness.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={editedBusiness.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedBusiness.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                  </div>

                  {/* Contact Information */}
                  <h3 className="text-lg font-semibold">Contact Information</h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Telephone</Label>
                      <Input
                        id="telephone"
                        value={editedBusiness.contact.telephone}
                        onChange={(e) =>
                          handleNestedChange(
                            "contact",
                            "telephone",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={editedBusiness.contact.country}
                        onChange={(e) =>
                          handleNestedChange(
                            "contact",
                            "country",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={editedBusiness.contact.state}
                        onChange={(e) =>
                          handleNestedChange("contact", "state", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={editedBusiness.contact.city}
                        onChange={(e) =>
                          handleNestedChange("contact", "city", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={editedBusiness.contact.street}
                        onChange={(e) =>
                          handleNestedChange(
                            "contact",
                            "street",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={editedBusiness.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Business Category */}

                  <div className="space-y-2">
                    <Label htmlFor="category">Business Category</Label>
                    <select
                      id="category"
                      value={editedBusiness.categories?.[0] || ""}
                      onChange={(e) =>
                        handleInputChange("categories", [e.target.value])
                      }
                      className="block w-full border rounded-md p-2"
                    >
                      <option value="">Select a category</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="retail">Retail</option>
                      <option value="services">Services</option>
                    </select>
                  </div>

                  {/* Products and Services */}
                  {/* Products */}
                  {/* Products Section */}
                  <h3 className="text-lg font-semibold">Products</h3>
                  {editedBusiness.products?.map((product, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 items-center"
                    >
                      <Input
                        type="text"
                        value={product.name}
                        placeholder="Product Name"
                        onChange={(e) =>
                          handleProductChange(index, "name", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        value={product.price}
                        placeholder="Price ($)"
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            "price",
                            Number(e.target.value)
                          )
                        }
                      />
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProductImageUpload(e, index)}
                        />
                        {product.image && (
                          <img
                            src={product.image}
                            alt="Product"
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveProduct(index)}
                      >
                        ✖
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddProduct}>
                    + Add Product
                  </Button>

                  {/* Business Features */}
                  <h3 className="text-lg font-semibold">Business Features</h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editedBusiness.isBookable}
                        onCheckedChange={() =>
                          handleInputChange(
                            "isBookable",
                            !editedBusiness.isBookable
                          )
                        }
                      />
                      <Label>Enable Bookings</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editedBusiness.hasMenu}
                        onCheckedChange={() =>
                          handleInputChange("hasMenu", !editedBusiness.hasMenu)
                        }
                      />
                      <Label>Has Menu</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editedBusiness.isEcommerce || false}
                        onCheckedChange={() =>
                          handleInputChange(
                            "isEcommerce",
                            !editedBusiness.isEcommerce
                          )
                        }
                      />
                      <Label>Is Ecommerce</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editedBusiness.isBanned || false}
                        onCheckedChange={() =>
                          handleInputChange(
                            "isBanned",
                            !editedBusiness.isBanned
                          )
                        }
                      />
                      <Label>Is Banned</Label>
                    </div>
                  </div>

                  {/* Bookable Details */}
                  {editedBusiness.isBookable && (
                    <>
                      <h3 className="text-lg font-semibold">
                        Bookable Details
                      </h3>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="bookableItemName">
                            Bookable Item Name
                          </Label>
                          <Input
                            id="bookableItemName"
                            value={
                              editedBusiness.bookableDetails
                                ?.bookableItemName || ""
                            }
                            onChange={(e) =>
                              handleNestedChange(
                                "bookableDetails",
                                "bookableItemName",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="itemPluralName">
                            Item Plural Name
                          </Label>
                          <Input
                            id="itemPluralName"
                            value={
                              editedBusiness.bookableDetails?.itemPluralName ||
                              ""
                            }
                            onChange={(e) =>
                              handleNestedChange(
                                "bookableDetails",
                                "itemPluralName",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Rating */}
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      value={editedBusiness.rating || ""}
                      onChange={(e) =>
                        handleInputChange("rating", Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => handleUpdate(editedBusiness?.id as string)}
                >
                  {updating ? "Updating..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Business</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this business? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Ban Confirmation Modal */}
          <Dialog open={isBanModalOpen} onOpenChange={setIsBanModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ban Business</DialogTitle>
                <DialogDescription>
                  Are you sure you want to ban this business? The business will
                  be removed from the active list.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBanModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleBan}>
                  Ban Business
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default BusinessDetailsPage;

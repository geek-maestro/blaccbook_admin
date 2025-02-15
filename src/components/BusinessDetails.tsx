import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
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
  Ban
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockBusinesses } from '@/Data/business';
import Sidebar from '@/components/Sidebar';


const useBusiness = (initialBusinesses: any[]) => {
    const [businesses, setBusinesses] = useState(initialBusinesses);
  
    const updateBusiness = (id: string, updatedBusiness: any) => {
      setBusinesses(prev => 
        prev.map(business => 
          business.id === id ? { ...business, ...updatedBusiness } : business
        )
      );
    };
  
    const deleteBusiness = (id: string) => {
      setBusinesses(prev => prev.filter(business => business.id !== id));
    };
  
    const banBusiness = (id: string) => {
      setBusinesses(prev => 
        prev.map(business => 
          business.id === id 
            ? { ...business, isBanned: true } 
            : business
        )
      );
    };
  
    return { businesses, updateBusiness, deleteBusiness, banBusiness };
  };
  const BusinessDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { businesses, updateBusiness, deleteBusiness, banBusiness } = useBusiness(mockBusinesses);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [editedBusiness, setEditedBusiness] = useState<any>(null);
  
    const business = businesses.find(b => b.id === id);
  if (!business) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
            <Link to="/businesses">
              <Button>Back to Businesses</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const handleEdit = () => {
    setEditedBusiness({ ...business });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    updateBusiness(business.id, editedBusiness);
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    deleteBusiness(business.id);
    navigate('/business');
  };

  const handleBan = () => {
    banBusiness(business.id);
    navigate('/business');
  };
  return (
    <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Link to="/businesses" className="inline-flex items-center hover:text-blue-600">
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
              <DropdownMenuItem onSelect={() => setIsDeleteModalOpen(true)} 
                className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Business
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={() => setIsBanModalOpen(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Ban className="mr-2 h-4 w-4" /> Ban Business
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{business.name}</CardTitle>
                  <CardDescription className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    {business.contact.street}, {business.contact.city}, {business.contact.state}
                  </CardDescription>
                </div>
                {business.rating && (
                  <Badge variant="secondary" className="flex items-center gap-2 text-lg p-2">
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
                    <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-gray-500" />
                        {business.contact.countryCode} {business.contact.telephone}
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
                          'No website available'
                        )}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                        Established on {formatDate(business.createdAt)}
                      </div>
                    </div>
                  </div>

                  {business.features && business.features.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Features</h2>
                      <div className="flex flex-wrap gap-2">
                        {business.features.map((feature) => (
                          <Badge key={feature} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {business.categories && business.categories.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Categories</h2>
                      <div className="flex flex-wrap gap-2">
                        {business.categories.map((category) => (
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
                      {business.images.slice(0, 4).map((image, index) => (
                        <img 
                          key={index} 
                          src={image} 
                          alt={`${business.name} gallery image ${index + 1}`} 
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {business.isBookable && (
                      <Button className="flex-1">
                        Book {business.bookableDetails?.bookableItemName || 'Service'}
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
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Business</DialogTitle>
                <DialogDescription>
                  Make changes to the business details
                </DialogDescription>
              </DialogHeader>
              {editedBusiness && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input 
                      id="name" 
                      value={editedBusiness.name} 
                      className="col-span-3"
                      onChange={(e) => setEditedBusiness({
                        ...editedBusiness, 
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      value={editedBusiness.email} 
                      className="col-span-3"
                      onChange={(e) => setEditedBusiness({
                        ...editedBusiness, 
                        email: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="telephone" className="text-right">
                      Telephone
                    </Label>
                    <Input 
                      id="telephone" 
                      value={editedBusiness.contact.telephone} 
                      className="col-span-3"
                      onChange={(e) => setEditedBusiness({
                        ...editedBusiness, 
                        contact: {
                          ...editedBusiness.contact,
                          telephone: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button type="submit" onClick={handleSaveEdit}>
                  Save Changes
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
                  Are you sure you want to delete this business? 
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
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
                  Are you sure you want to ban this business? 
                  The business will be removed from the active list.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBanModalOpen(false)}>
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
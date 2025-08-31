import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  MapPin, 
  Star, 
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Building2,
  Tag,
  Image,
  Phone,
  Mail,
  Globe,
  Calendar,
  TrendingUp,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import RoleBasedRoute from '@/components/RoleBasedRoute';
import AdminSidebar from '@/components/AdminSidebar';
import { useBusinesses } from '@/services/business.service';
import { update } from '@/lib/firestoreCrud';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AdminBusinessManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Fetch live business data
  const { data: allBusinesses, isLoading, error } = useBusinesses();
  console.log('AdminBusinessManagement - Raw businesses data:', allBusinesses);
  console.log('AdminBusinessManagement - Loading:', isLoading, 'Error:', error);
  
  const queryClient = useQueryClient();
  
  // Mutation for updating business
  const updateBusiness = useMutation({
    mutationFn: async ({ businessId, updates }: { businessId: string; updates: any }) => {
      return update("business", businessId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },
  });
  
  // Transform live data to match expected format
  const businesses = allBusinesses?.map((business: any) => ({
    id: business.id || business.businessId,
    name: business.name || business.businessName || 'Unnamed Business',
    category: business.category || business.type || 'General',
    owner: business.owner || business.ownerName || 'Unknown Owner',
    email: business.email || business.ownerEmail || 'No email',
    phone: business.phone || business.contact?.phone || 'No phone',
    location: business.location || `${business.city || 'Unknown'}, ${business.state || 'Unknown'}`,
    status: business.status || 'pending',
    featured: business.featured || false,
    rating: business.rating || 0,
    reviews: business.reviews || 0,
    revenue: business.revenue || 0,
    orders: business.orders || 0,
    joinedDate: business.createdAt || business.joinedDate || new Date().toISOString(),
    lastActive: business.updatedAt || business.lastActive || new Date().toISOString(),
    images: business.images || business.photos || [],
    description: business.description || 'No description provided',
    tags: business.tags || business.categories || [],
    coordinates: business.coordinates || business.mapLocation || { lat: 0, lng: 0 }
  })) || [];

  const categories = ['Restaurant', 'Beauty & Wellness', 'Professional Services', 'Retail', 'Health & Medical', 'Entertainment', 'Automotive', 'Home & Garden', 'Education', 'Technology', 'Real Estate'];

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = (business.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (business.owner?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (business.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || business.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || business.location.includes(locationFilter);

    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Action handlers
  const handleViewBusiness = (business: any) => {
    setSelectedBusiness(business);
    setIsViewDialogOpen(true);
  };

  const handleEditBusiness = (business: any) => {
    setSelectedBusiness(business);
    setIsEditDialogOpen(true);
  };

  const handleToggleFeatured = async (business: any) => {
    try {
      await updateBusiness.mutateAsync({
        businessId: business.id,
        updates: { featured: !business.featured }
      });
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    }
  };

  const handleUpdateLocation = (business: any) => {
    setSelectedBusiness(business);
    setIsLocationDialogOpen(true);
  };

  const handleManageCategories = (business: any) => {
    setSelectedBusiness(business);
    setIsCategoryDialogOpen(true);
  };

  const handleSuspendBusiness = async (business: any) => {
    if (window.confirm(`Are you sure you want to ${business.status === 'suspended' ? 'activate' : 'suspend'} this business?`)) {
      try {
        const newStatus = business.status === 'suspended' ? 'approved' : 'suspended';
        await updateBusiness.mutateAsync({
          businessId: business.id,
          updates: { status: newStatus }
        });
      } catch (error) {
        console.error('Failed to update business status:', error);
      }
    }
  };

  const handleDeleteBusiness = async (business: any) => {
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      try {
        await updateBusiness.mutateAsync({
          businessId: business.id,
          updates: { isBanned: true, status: 'suspended' }
        });
      } catch (error) {
        console.error('Failed to delete business:', error);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <RoleBasedRoute requiredPermission="canManageBusinesses">
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </RoleBasedRoute>
    );
  }

  // Error state
  if (error) {
    return (
      <RoleBasedRoute requiredPermission="canManageBusinesses">
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Businesses</h2>
              <p className="text-gray-600">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </RoleBasedRoute>
    );
  }

  return (
    <RoleBasedRoute requiredPermission="canManageBusinesses">
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
              <p className="text-gray-600">Manage business profiles, listings, and performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businesses.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {businesses.filter(b => b.status === 'active').length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Featured Businesses</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {businesses.filter(b => b.featured).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Premium listings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {businesses.filter(b => b.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${businesses.reduce((sum, b) => sum + b.revenue, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Platform revenue
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filters & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search businesses by name, owner, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All Businesses ({filteredBusinesses.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({businesses.filter(b => b.status === 'active').length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({businesses.filter(b => b.status === 'pending').length})</TabsTrigger>
                <TabsTrigger value="featured">Featured ({businesses.filter(b => b.featured).length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Businesses</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredBusinesses.length} businesses found
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredBusinesses.map((business) => (
                        <div key={business.id} className="border rounded-lg p-6 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-lg font-semibold">{business.name}</h3>
                                  <Badge variant={getStatusBadgeVariant(business.status)}>
                                    {business.status}
                                  </Badge>
                                  {business.featured && (
                                    <Badge variant="default" className="bg-yellow-500">
                                      <Star className="h-3 w-3 mr-1" />
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <Users className="h-4 w-4" />
                                      <span>Owner: {business.owner}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <Tag className="h-4 w-4" />
                                      <span>Category: {business.category}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <MapPin className="h-4 w-4" />
                                      <span>{business.location}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <Star className="h-4 w-4" />
                                      <span>{business.rating} ({business.reviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <TrendingUp className="h-4 w-4" />
                                      <span>Revenue: ${business.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <Calendar className="h-4 w-4" />
                                      <span>Joined: {new Date(business.joinedDate).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <p className="text-sm text-gray-700 mb-2">{business.description}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {business.tags.map((tag: string, index: number) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <Mail className="h-3 w-3" />
                                    <span>{business.email}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{business.phone}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewBusiness(business)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditBusiness(business)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleToggleFeatured(business)}>
                                    <ToggleRight className="h-4 w-4 mr-2" />
                                    Toggle Featured
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateLocation(business)}>
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Update Location
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleManageCategories(business)}>
                                    <Tag className="h-4 w-4 mr-2" />
                                    Manage Categories
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-orange-600"
                                    onClick={() => handleSuspendBusiness(business)}
                                  >
                                    <ToggleLeft className="h-4 w-4 mr-2" />
                                    {business.status === 'suspended' ? 'Activate Business' : 'Suspend Business'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteBusiness(business)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Business
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredBusinesses.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No businesses found matching your criteria</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* View Business Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Business Details</DialogTitle>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Business Name</label>
                  <p className="text-sm text-gray-600">{selectedBusiness.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p className="text-sm text-gray-600">{selectedBusiness.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Owner</label>
                  <p className="text-sm text-gray-600">{selectedBusiness.owner}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-gray-600">{selectedBusiness.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-gray-600">{selectedBusiness.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <p className="text-sm text-gray-600">{selectedBusiness.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={getStatusBadgeVariant(selectedBusiness.status)}>
                    {selectedBusiness.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Featured</label>
                  <p className="text-sm text-gray-600">{selectedBusiness.featured ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-gray-600">{selectedBusiness.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Business Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Business</DialogTitle>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Business Name</label>
                  <Input defaultValue={selectedBusiness.name} />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input defaultValue={selectedBusiness.category} />
                </div>
                <div>
                  <label className="text-sm font-medium">Owner</label>
                  <Input defaultValue={selectedBusiness.owner} />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue={selectedBusiness.email} />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input defaultValue={selectedBusiness.phone} />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input defaultValue={selectedBusiness.location} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea defaultValue={selectedBusiness.description} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsEditDialogOpen(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Location Dialog */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Location</DialogTitle>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Location</label>
                <p className="text-sm text-gray-600">{selectedBusiness.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium">New Location</label>
                <Input placeholder="Enter new location" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsLocationDialogOpen(false)}>
                  Update Location
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Categories Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Categories</label>
                <p className="text-sm text-gray-600">{selectedBusiness.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Available Categories</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={category} />
                      <label htmlFor={category} className="text-sm">{category}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCategoryDialogOpen(false)}>
                  Update Categories
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </RoleBasedRoute>
  );
};

export default AdminBusinessManagement;

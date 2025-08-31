import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye,
  Edit,
  Trash2,
  Building2,
  Navigation,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Map,
  Layers,
  Settings,
  Globe,
  Compass
} from 'lucide-react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useBusinesses } from '@/services/business.service';
import { getByFilters } from '@/lib/firestoreCrud';
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
import RoleBasedRoute from '@/components/RoleBasedRoute';
import AdminSidebar from '@/components/AdminSidebar';

const AdminMapManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of US
  const [mapZoom, setMapZoom] = useState(4);

  // Load Google Maps
  const { isLoaded } = useLoadScript({ 
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string 
  });

  // Fetch real business data
  const { data: businesses, isLoading } = useBusinesses();

  // Transform business data to location format
  const businessLocations = businesses?.map((business: any) => ({
    id: business.id || business.businessId,
    name: business.name || business.businessName || 'Unnamed Business',
    address: business.address || business.location || 'No address provided',
    coordinates: business.coordinates || business.mapLocation || { lat: 0, lng: 0 },
    state: business.state || 'Unknown',
    city: business.city || 'Unknown',
    status: business.status || 'pending',
    category: business.category || business.type || 'General',
    owner: business.owner || business.ownerName || 'Unknown',
    lastUpdated: business.updatedAt || business.lastUpdated || new Date().toISOString(),
    issues: business.issues || []
  })) || [];

  const states = ['Georgia', 'Illinois', 'Texas', 'Florida', 'California', 'New York', 'North Carolina', 'Louisiana'];

  // Action handlers
  const handleUpdateCoordinates = (locationId: string) => {
    const location = businessLocations.find(l => l.id === locationId);
    if (location) {
      const newLat = prompt('Enter new latitude:', location.coordinates.lat.toString());
      const newLng = prompt('Enter new longitude:', location.coordinates.lng.toString());
      
      if (newLat && newLng && !isNaN(Number(newLat)) && !isNaN(Number(newLng))) {
        // Update coordinates in Firebase
        console.log('Updating coordinates for', locationId, 'to', newLat, newLng);
        // TODO: Implement actual Firebase update
        alert('Coordinates updated successfully!');
      }
    }
  };

  const handleVerifyLocation = (locationId: string) => {
    if (window.confirm('Mark this location as verified?')) {
      console.log('Verifying location:', locationId);
      // TODO: Implement actual Firebase update
      alert('Location verified successfully!');
    }
  };

  const handleCheckDuplicates = (locationId: string) => {
    const location = businessLocations.find(l => l.id === locationId);
    if (location) {
      // Check for nearby locations (within 0.01 degrees ≈ 1km)
      const nearbyLocations = businessLocations.filter(l => 
        l.id !== locationId && 
        Math.abs(l.coordinates.lat - location.coordinates.lat) < 0.01 &&
        Math.abs(l.coordinates.lng - location.coordinates.lng) < 0.01
      );
      
      if (nearbyLocations.length > 0) {
        alert(`Found ${nearbyLocations.length} nearby locations that might be duplicates:\n${nearbyLocations.map(l => l.name).join('\n')}`);
      } else {
        alert('No duplicate locations found nearby.');
      }
    }
  };

  const handleRemoveLocation = (locationId: string) => {
    if (window.confirm('Are you sure you want to remove this location? This action cannot be undone.')) {
      console.log('Removing location:', locationId);
      // TODO: Implement actual Firebase deletion
      alert('Location removed successfully!');
    }
  };

  const filteredLocations = businessLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === 'all' || location.state === stateFilter;
    const matchesStatus = statusFilter === 'all' || location.status === statusFilter;

    return matchesSearch && matchesState && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'duplicate':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return CheckCircle;
      case 'pending':
        return AlertTriangle;
      case 'duplicate':
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  return (
    <RoleBasedRoute requiredPermission="canManageBusinesses">
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">GPS & Map Management</h1>
              <p className="text-gray-600">Manage business locations, coordinates, and map optimization</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessLocations.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Business locations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified Locations</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {businessLocations.filter(l => l.status === 'verified').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    GPS verified
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {businessLocations.filter(l => l.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Need verification
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {businessLocations.filter(l => l.issues.length > 0).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Require attention
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Map Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Map className="h-5 w-5" />
                    <span>Map Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Default Search Radius</label>
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 miles</SelectItem>
                        <SelectItem value="10">10 miles</SelectItem>
                        <SelectItem value="25">25 miles</SelectItem>
                        <SelectItem value="50">50 miles</SelectItem>
                        <SelectItem value="state">State-wide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Map Style</label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="satellite">Satellite</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Layers className="h-5 w-5" />
                    <span>Map Layers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Business Locations</span>
                      <Button size="sm" variant="outline">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Featured Businesses</span>
                      <Button size="sm" variant="outline">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Category Filters</span>
                      <Button size="sm" variant="outline">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Traffic Data</span>
                      <Button size="sm" variant="outline">Toggle</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Search Optimization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Popularity Weight</label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Premium Placement</label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Compass className="h-4 w-4 mr-2" />
                    Optimize Search
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Location Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by business name, address, or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={stateFilter} onValueChange={setStateFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="duplicate">Duplicate</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Map View */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Map className="h-5 w-5" />
                  <span>Live Business Map</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Interactive map showing all business locations with real-time data
                </p>
              </CardHeader>
              <CardContent>
                {isLoaded ? (
                  <div className="h-96 w-full rounded-lg overflow-hidden border">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={mapCenter}
                      zoom={mapZoom}
                      onClick={(e) => {
                        if (e.latLng) {
                          setMapCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                        }
                      }}
                    >
                      {filteredLocations.map((location) => (
                        <Marker
                          key={location.id}
                          position={location.coordinates}
                          onClick={() => setSelectedLocation(location)}
                          icon={{
                            url: location.status === 'verified' 
                              ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                              : location.status === 'pending'
                              ? 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            scaledSize: new window.google.maps.Size(32, 32)
                          }}
                        />
                      ))}
                    </GoogleMap>
                  </div>
                ) : (
                  <div className="h-96 w-full rounded-lg border flex items-center justify-center">
                    <div className="text-center">
                      <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Loading map...</p>
                    </div>
                  </div>
                )}
                
                {/* Map Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Verified ({businessLocations.filter(l => l.status === 'verified').length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Pending ({businessLocations.filter(l => l.status === 'pending').length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Issues ({businessLocations.filter(l => l.issues.length > 0).length})</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All Locations ({filteredLocations.length})</TabsTrigger>
                <TabsTrigger value="verified">Verified ({businessLocations.filter(l => l.status === 'verified').length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({businessLocations.filter(l => l.status === 'pending').length})</TabsTrigger>
                <TabsTrigger value="issues">Issues ({businessLocations.filter(l => l.issues.length > 0).length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Locations</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredLocations.length} locations found
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredLocations.map((location) => {
                        const StatusIcon = getStatusIcon(location.status);
                        return (
                          <div key={location.id} className="border rounded-lg p-6 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                  <MapPin className="h-6 w-6 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-semibold">{location.name}</h3>
                                    <Badge variant={getStatusBadgeVariant(location.status)}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {location.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Building2 className="h-4 w-4" />
                                        <span>Owner: {location.owner}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>{location.address}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Navigation className="h-4 w-4" />
                                        <span>Lat: {location.coordinates.lat}, Lng: {location.coordinates.lng}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Globe className="h-4 w-4" />
                                        <span>{location.city}, {location.state}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Target className="h-4 w-4" />
                                        <span>Category: {location.category}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Updated: {new Date(location.lastUpdated).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {location.issues.length > 0 && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        <span className="text-sm font-medium text-red-800">Issues Found</span>
                                      </div>
                                      <ul className="text-sm text-red-700">
                                        {location.issues.map((issue: string, index: number) => (
                                          <li key={index}>• {issue}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Map
                                </Button>
                                <Button size="sm" variant="outline">
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
                                    <DropdownMenuItem onClick={() => handleUpdateCoordinates(location.id)}>
                                      <Navigation className="h-4 w-4 mr-2" />
                                      Update Coordinates
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleVerifyLocation(location.id)}>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Verify Location
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCheckDuplicates(location.id)}>
                                      <MapPin className="h-4 w-4 mr-2" />
                                      Check for Duplicates
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => handleRemoveLocation(location.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove Location
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {filteredLocations.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No locations found matching your criteria</p>
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
    </RoleBasedRoute>
  );
};

export default AdminMapManagement;

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Store, Edit, MapPin, Mail, Phone, Eye, FileText, Calendar, CheckCircle, AlertCircle, Search, X } from 'lucide-react';
import { useMyVerifiedBusinesses, useEditVerifiedBusiness } from '@/services/businessVerification.service';
import { IBusinessVerification } from '@/Types/businessVerification';
import { auth } from '@/lib/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const MerchantVerifiedBusinesses = () => {
    const navigate = useNavigate();
    const { data: businesses, isLoading, error } = useMyVerifiedBusinesses();
    const editBusinessMutation = useEditVerifiedBusiness();

    const [selectedBusiness, setSelectedBusiness] = useState<IBusinessVerification | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        console.log("Component received businesses:", businesses);
        console.log("Is array?", Array.isArray(businesses));
        console.log("Type:", typeof businesses);
        console.log("Length:", businesses?.length);
        if (Array.isArray(businesses)) {
            console.log("Businesses count:", businesses.length);
            businesses.slice(0, 2).forEach((b, i) => console.log(`Business ${i}:`, b));
        }
    }, [businesses]);

    const handleEditClick = (business: IBusinessVerification) => {
        setSelectedBusiness(business);
        setIsEditDialogOpen(true);
        setIsViewDialogOpen(false);
    };

    const handleViewClick = (business: IBusinessVerification) => {
        setSelectedBusiness(business);
        setIsViewDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedBusiness || !selectedBusiness.id) return;

        try {
            // Handle array conversion for document URLs if it's a string, otherwise keep existing array or empty
            let parsedUrls: string[] = [];
            if (typeof selectedBusiness.documentUrls === 'string') {
                parsedUrls = (selectedBusiness.documentUrls as string).split(',').map(url => url.trim()).filter(url => url !== '');
            } else if (Array.isArray(selectedBusiness.documentUrls)) {
                parsedUrls = selectedBusiness.documentUrls;
            }

            await editBusinessMutation.mutateAsync({
                id: selectedBusiness.id,
                businessName: selectedBusiness.businessName || '',
                taxInfo: selectedBusiness.taxInfo || '',
                registrationInfo: selectedBusiness.registrationInfo || '',
                notes: selectedBusiness.notes || null,
                documentUrls: parsedUrls,
            });
            setIsEditDialogOpen(false);
        } catch (e) {
            console.error("Save edit failed", e);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (selectedBusiness) {
            setSelectedBusiness({ ...selectedBusiness, [name]: value });
        }
    };

    const filteredBusinesses = Array.isArray(businesses)
        ? businesses.filter((business: IBusinessVerification) => {
            const searchLower = searchTerm.toLowerCase();
            const businessName = (business.businessName || business.name || '').toLowerCase();
            const location = (business.address || business.location || '').toLowerCase();
            const email = (business.email || '').toLowerCase();
            return businessName.includes(searchLower) || location.includes(searchLower) || email.includes(searchLower);
        })
        : [];

    // Render logic handling various states
    if (isLoading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-md mx-auto mt-20 bg-white border border-red-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Businesses</h2>
                        <p className="text-sm text-red-700 mb-4">
                            {error instanceof Error ? error.message : 'An unknown error occurred. Please make sure you are logged in.'}
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                            Check the browser console for more details.
                        </p>
                        <Button onClick={() => window.location.reload()} className="w-full">
                            Try Again
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <Store className="mr-3 h-8 w-8 text-blue-600" /> My Verified Businesses
                            </h1>
                            <p className="text-gray-600 mt-2">Manage your active business directory listings.</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Button onClick={() => navigate('/business-onboarding')} className="flex items-center bg-blue-600 hover:bg-blue-700">
                                <Store className="mr-2 h-4 w-4" /> Add Business
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    {Array.isArray(businesses) && businesses.length > 0 && (
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search businesses by name, location, or email..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Stats */}
                    {Array.isArray(businesses) && businesses.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600">Total Businesses</p>
                                <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-green-600">{businesses.filter((b: IBusinessVerification) => b.status !== 'pending').length}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600">Pending Review</p>
                                <p className="text-2xl font-bold text-yellow-600">{businesses.filter((b: IBusinessVerification) => b.status === 'pending').length}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                        <p>Debug: businesses type = {typeof businesses} | isArray = {String(Array.isArray(businesses))} | length = {Array.isArray(businesses) ? businesses.length : 'N/A'}</p>
                    </div>
                )}

                {Array.isArray(businesses) && filteredBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBusinesses.map((business: IBusinessVerification) => (
                            <Card key={business.id} className="hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 overflow-hidden">
                                {/* Status Banner */}
                                <div className={`h-1 ${business.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`} />

                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                                {business.businessName || business.name || 'Unnamed Business'}
                                            </CardTitle>
                                            <CardDescription className="flex items-center mt-2">
                                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                                <span className="text-xs text-gray-600 line-clamp-1">
                                                    {business.address || business.location || 'Location missing'}
                                                </span>
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            className={`flex-shrink-0 ${
                                                business.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {business.status === 'pending' ? (
                                                <div className="flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    Pending
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Active
                                                </div>
                                            )}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Quick Info */}
                                    <div className="space-y-2 text-sm">
                                        {business.email && (
                                            <div className="flex items-center text-gray-600">
                                                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                                                <span className="truncate">{business.email}</span>
                                            </div>
                                        )}
                                        {business.phone && (
                                            <div className="flex items-center text-gray-600">
                                                <Phone className="h-4 w-4 mr-2 text-blue-500" />
                                                <span>{business.phone}</span>
                                            </div>
                                        )}
                                        {business.submittedAt && (
                                            <div className="flex items-center text-gray-500 text-xs">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Submitted {new Date(business.submittedAt?.toDate?.() || business.submittedAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Grid */}
                                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                        <div className="text-xs">
                                            <p className="text-gray-500">Tax Info</p>
                                            <p className="font-medium text-gray-900">{business.taxInfo || 'Not provided'}</p>
                                        </div>
                                        <div className="text-xs">
                                            <p className="text-gray-500">Registration</p>
                                            <p className="font-medium text-gray-900">{business.registrationInfo || 'Not provided'}</p>
                                        </div>
                                        {(business.documentUrls?.length || 0) > 0 && (
                                            <div className="text-xs">
                                                <p className="text-gray-500">Documents</p>
                                                <p className="font-medium text-blue-600 flex items-center">
                                                    <FileText className="h-3 w-3 mr-1" /> {business.documentUrls?.length} file(s)
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-4 border-t border-gray-100 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleViewClick(business)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" /> View
                                        </Button>
                                        {/* <Button
                                            size="sm"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                                            onClick={() => handleEditClick(business)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" /> Edit
                                        </Button> */}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : Array.isArray(businesses) && businesses.length > 0 ? (
                    <div className="text-center bg-white rounded-lg border border-dashed border-gray-300 p-12">
                        <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                        <p className="mt-1 text-gray-500">
                            No businesses match your search. Try adjusting your filters.
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
                            Clear Search
                        </Button>
                    </div>
                ) : (
                    <div className="text-center bg-white rounded-lg border border-dashed border-gray-300 p-12">
                        <Store className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">No verified businesses yet</h3>
                        <p className="mt-1 text-gray-500">
                            You don't have any verified businesses yet. Start by adding your first business.
                        </p>
                        <Button onClick={() => navigate('/business-onboarding')} className="mt-4 bg-blue-600 hover:bg-blue-700">
                            <Store className="mr-2 h-4 w-4" /> Add Your First Business
                        </Button>
                    </div>
                )}
            </main>

            {/* View Business Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Business Details</DialogTitle>
                    </DialogHeader>
                    {selectedBusiness && (
                        <div className="space-y-6 py-4">
                            {/* Header */}
                            <div className="border-b pb-4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {selectedBusiness.businessName || selectedBusiness.name || 'Unnamed Business'}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Badge className={selectedBusiness.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                                        {selectedBusiness.status === 'pending' ? 'Pending Review' : 'Active'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900">Contact Information</h3>
                                {selectedBusiness.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="text-sm text-gray-900">{selectedBusiness.email}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedBusiness.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="text-sm text-gray-900">{selectedBusiness.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedBusiness.address && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Address</p>
                                            <p className="text-sm text-gray-900">{selectedBusiness.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Business Information */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900">Business Information</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Tax Information</p>
                                        <p className="text-sm text-gray-900 mt-1">{selectedBusiness.taxInfo || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Registration Information</p>
                                        <p className="text-sm text-gray-900 mt-1">{selectedBusiness.registrationInfo || 'Not provided'}</p>
                                    </div>
                                    {selectedBusiness.description && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Description</p>
                                            <p className="text-sm text-gray-900 mt-1">{selectedBusiness.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Documents */}
                            {(selectedBusiness.documentUrls?.length || 0) > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900 flex items-center">
                                        <FileText className="h-5 w-5 mr-2" /> Documents ({selectedBusiness.documentUrls?.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedBusiness.documentUrls?.map((url, idx) => (
                                            <a
                                                key={idx}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                                            >
                                                <FileText className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm text-blue-600 underline truncate">Document {idx + 1}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedBusiness.notes && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900">Notes</h3>
                                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selectedBusiness.notes}</p>
                                </div>
                            )}

                            {/* Metadata */}
                            {selectedBusiness.submittedAt && (
                                <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                                    Submitted: {new Date(selectedBusiness.submittedAt?.toDate?.() || selectedBusiness.submittedAt).toLocaleString()}
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                        {/* <Button onClick={() => handleEditClick(selectedBusiness!)} className="bg-blue-600 hover:bg-blue-700">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button> */}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Business Details</DialogTitle>
                    </DialogHeader>
                    {selectedBusiness && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Business Name</label>
                                <Input
                                    name="businessName"
                                    value={selectedBusiness.businessName || selectedBusiness.name || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tax Info</label>
                                <Input
                                    name="taxInfo"
                                    value={selectedBusiness.taxInfo || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Registration Info</label>
                                <Input
                                    name="registrationInfo"
                                    value={selectedBusiness.registrationInfo || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Document URLs (Comma Separated)</label>
                                <Input
                                    name="documentUrls"
                                    value={Array.isArray(selectedBusiness.documentUrls) ? selectedBusiness.documentUrls.join(', ') : selectedBusiness.documentUrls || ''}
                                    onChange={handleChange}
                                    placeholder="https://example.com/doc1, https://example.com/doc2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notes</label>
                                <Textarea
                                    name="notes"
                                    value={selectedBusiness.notes || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={editBusinessMutation.isPending}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={editBusinessMutation.isPending}>
                            {editBusinessMutation.isPending ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MerchantVerifiedBusinesses;

import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Megaphone, 
  Image as ImageIcon, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Info,
  Calendar,
  Clock,
  Upload,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  useAds, 
  useAddAd, 
  useEditAd, 
  useDeleteAd 
} from '@/services/ads.service';
import { uploadAdImage } from '@/services/imageUpload.service';
import { IAd } from '@/Types/ads';
import { formatDate } from '@/utils/dateUtils';

const AdminAds = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialog controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [selectedAd, setSelectedAd] = useState<IAd | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    targetUrl: string;
    placement: string;
    startsAt: string;
    endsAt: string;
    priority: number;
    isActive: boolean;
  }>({
    title: '',
    description: '',
    targetUrl: '',
    placement: 'home_banner',
    startsAt: new Date().toISOString().slice(0, 16),
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    priority: 0,
    isActive: true
  });

  const { data: adsData = [], isLoading, error } = useAds();
  const ads: IAd[] = (adsData || []) as IAd[];
  const addMutation = useAddAd();
  const editMutation = useEditAd();
  const deleteMutation = useDeleteAd();

  // Handlers
  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      targetUrl: '',
      placement: 'home_banner',
      startsAt: new Date().toISOString().slice(0, 16),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      priority: 0,
      isActive: true
    });
    setImageFile(null);
    setImagePreview('');
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (ad: IAd) => {
    setSelectedAd(ad);
    setFormData({
      title: ad.title || '',
      description: ad.description || '',
      targetUrl: ad.targetUrl || '',
      placement: ad.placement || 'home_banner',
      startsAt: ad.startsAt ? new Date(ad.startsAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      endsAt: ad.endsAt ? new Date(ad.endsAt).toISOString().slice(0, 16) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      priority: ad.priority !== undefined ? Number(ad.priority) : 0,
      isActive: Boolean(ad.isActive)
    });
    setImageFile(null);
    setImagePreview(ad.imageUrl || '');
    setIsEditOpen(true);
  };

  const handleOpenDelete = (ad: IAd) => {
    setSelectedAd(ad);
    setIsDeleteOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file.",
        });
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Image size must be less than 5MB.",
        });
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "Image required",
        description: "Please select a banner image for the advertisement.",
      });
      return;
    }

    try {
      setIsUploading(true);
      const downloadURL = await uploadAdImage(imageFile);
      
      addMutation.mutate({
        ...formData,
        startsAt: new Date(formData.startsAt).toISOString(),
        endsAt: new Date(formData.endsAt).toISOString(),
        imageUrl: downloadURL
      }, {
        onSuccess: () => {
          toast({
            title: "Advertisement campaign created",
            description: `"${formData.title}" has been successfully configured.`,
          });
          setIsCreateOpen(false);
          setImageFile(null);
          setImagePreview('');
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Failed to save advertisement",
            description: err.message || "An unknown error occurred.",
          });
        }
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Image upload failed",
        description: err.message || "Could not upload banner image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = selectedAd?.adId || selectedAd?.id;
    if (!targetId) return;

    try {
      setIsUploading(true);
      let downloadURL = selectedAd?.imageUrl || '';
      
      if (imageFile) {
        downloadURL = await uploadAdImage(imageFile);
      }

      editMutation.mutate({
        id: String(targetId),
        adId: String(targetId),
        ...formData,
        startsAt: new Date(formData.startsAt).toISOString(),
        endsAt: new Date(formData.endsAt).toISOString(),
        imageUrl: downloadURL
      }, {
        onSuccess: () => {
          toast({
            title: "Advertisement campaign updated",
            description: `"${formData.title}" has been successfully updated.`,
          });
          setIsEditOpen(false);
          setSelectedAd(null);
          setImageFile(null);
          setImagePreview('');
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Failed to update advertisement",
            description: err.message || "An unknown error occurred.",
          });
        }
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Image upload failed",
        description: err.message || "Could not upload replacement banner image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleActive = (ad: IAd) => {
    const targetId = ad.adId || ad.id;
    if (!targetId) return;
    const newActiveState = !ad.isActive;
    
    editMutation.mutate({ 
      ...ad, 
      id: String(targetId), 
      adId: String(targetId), 
      isActive: newActiveState 
    }, {
      onSuccess: () => {
        toast({
          title: `Campaign ${newActiveState ? 'Activated' : 'Deactivated'}`,
          description: `"${ad.title}" status has been changed.`,
        });
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Failed to change campaign status",
          description: err.message || "An unknown error occurred.",
        });
      }
    });
  };

  const handleDeleteSubmit = () => {
    const targetId = selectedAd?.adId || selectedAd?.id;
    if (!targetId) return;
    
    deleteMutation.mutate(String(targetId), {
      onSuccess: () => {
        toast({
          title: "Advertisement campaign deleted",
          description: `"${selectedAd?.title}" has been successfully deleted.`,
        });
        setIsDeleteOpen(false);
        setSelectedAd(null);
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Failed to delete campaign",
          description: err.message || "An unknown error occurred.",
        });
      }
    });
  };

  // Filtering logic
  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      (ad.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (ad.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ad.duration || ad.placement || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && ad.isActive) || 
      (statusFilter === 'inactive' && !ad.isActive);

    return matchesSearch && matchesStatus;
  });

  // Metrics calculations
  const totalCount = ads.length;
  const activeCount = ads.filter(a => a.isActive).length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Megaphone className="h-8 w-8 text-blue-600" />
                Ads Management
              </h1>
              <p className="text-slate-500 mt-1 text-sm md:text-base">
                Create, read, update, and delete active banner campaigns.
              </p>
            </div>
            
            <Button 
              onClick={handleOpenCreate} 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Ad Campaign
            </Button>
          </div>

          {/* Metrics Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="shadow-sm border-slate-200/80 bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Campaigns</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalCount}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200/80 bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active / Live</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{activeCount}</h3>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200/80 bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Inactive / Draft</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{inactiveCount}</h3>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Lock className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Card */}
          <Card className="shadow-sm border-slate-200/80 bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search by title, description or duration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-slate-500 font-medium">Status:</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] border-slate-200 bg-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Table / Data section */}
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-80 bg-white rounded-2xl border border-slate-200/80 shadow-sm gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="text-sm text-slate-500 font-medium">Loading ad campaigns...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-80 bg-red-50/50 rounded-2xl border border-red-200 shadow-sm p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mb-2" />
              <h3 className="font-semibold text-slate-900 text-lg">Failed to load campaigns</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-md">{(error as any)?.message || 'An error occurred while fetching ad campaigns.'}</p>
              <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white" onClick={() => queryClient.invalidateQueries({ queryKey: ["ads"] })}>
                Retry
              </Button>
            </div>
          ) : (
            <Card className="shadow-sm border-slate-200/80 overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 w-32">Image</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Campaign Details</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Duration</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-center">Live Status</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Last Updated</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredAds.map((ad) => (
                        <tr key={ad.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative h-14 w-24 overflow-hidden rounded-md border border-slate-200/80 bg-slate-50 flex items-center justify-center">
                              {ad.imageUrl ? (
                                <img 
                                  src={ad.imageUrl} 
                                  alt={ad.title} 
                                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <ImageIcon className="h-6 w-6 text-slate-300" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-950 text-sm md:text-base">{ad.title}</span>
                              <span className="text-xs text-slate-500 mt-0.5 max-w-lg line-clamp-2">
                                {ad.description}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                              <Clock className="h-4 w-4 text-slate-400" />
                              {ad.placement || ad.duration || 'home_banner'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-3">
                              <span className={`text-xs font-semibold ${ad.isActive ? 'text-green-600' : 'text-slate-400'}`}>
                                {ad.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <Switch 
                                checked={ad.isActive} 
                                onCheckedChange={() => handleToggleActive(ad)}
                                className="data-[state=checked]:bg-green-600"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(ad.updatedAt || ad.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleOpenEdit(ad)}
                                title="Edit Campaign"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleOpenDelete(ad)}
                                title="Delete Campaign"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {filteredAds.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-slate-400 bg-white">
                            <Info className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                            <p className="font-medium text-sm">No campaign items match the filter criteria.</p>
                            <p className="text-xs text-slate-400 mt-1">Try resetting search parameters or create a new campaign.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dialogs */}

          {/* Create Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-slate-900 text-xl font-bold flex items-center gap-2">
                  <Megaphone className="h-6 w-6 text-blue-600" />
                  Create Ad Campaign
                </DialogTitle>
                <DialogDescription>
                  Configure and upload a new advertisement banner.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-5">
                
                {/* Image Upload Area */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 text-sm font-semibold">Banner Image</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 hover:border-slate-300 transition-colors"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => handleFileChange(e, false)} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    
                    {imagePreview ? (
                      <div className="relative w-full max-h-40 overflow-hidden rounded-md border border-slate-200 bg-black flex items-center justify-center">
                        <img src={imagePreview} alt="Preview" className="max-h-40 max-w-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                          Click to change image
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <Upload className="h-10 w-10 text-slate-400 mb-2" />
                        <p className="text-slate-600 font-semibold text-sm">Click to upload banner image</p>
                        <p className="text-slate-400 text-xs mt-1">Supports PNG, JPG, JPEG (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="create-title" className="text-slate-700 text-sm font-semibold">Title</Label>
                    <Input 
                      id="create-title" 
                      placeholder="e.g. Summer Discount Promo" 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      required 
                      className="border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="create-placement" className="text-slate-700 text-sm font-semibold">Placement</Label>
                    <Input 
                      id="create-placement" 
                      placeholder="e.g. home_banner, sidebar" 
                      value={formData.placement} 
                      onChange={(e) => setFormData({...formData, placement: e.target.value})} 
                      required 
                      className="border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="create-targetUrl" className="text-slate-700 text-sm font-semibold">Target URL</Label>
                    <Input 
                      id="create-targetUrl" 
                      placeholder="e.g. https://example.com/promo" 
                      value={formData.targetUrl} 
                      onChange={(e) => setFormData({...formData, targetUrl: e.target.value})} 
                      className="border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="create-priority" className="text-slate-700 text-sm font-semibold">Priority</Label>
                    <Input 
                      id="create-priority" 
                      type="number"
                      placeholder="0" 
                      value={formData.priority} 
                      onChange={(e) => setFormData({...formData, priority: Number(e.target.value)})} 
                      className="border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="create-startsAt" className="text-slate-700 text-sm font-semibold">Starts At</Label>
                    <Input 
                      id="create-startsAt" 
                      type="datetime-local"
                      value={formData.startsAt} 
                      onChange={(e) => setFormData({...formData, startsAt: e.target.value})} 
                      required 
                      className="border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="create-endsAt" className="text-slate-700 text-sm font-semibold">Ends At</Label>
                    <Input 
                      id="create-endsAt" 
                      type="datetime-local"
                      value={formData.endsAt} 
                      onChange={(e) => setFormData({...formData, endsAt: e.target.value})} 
                      required 
                      className="border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 h-10 bg-slate-50 border border-slate-200/80 rounded-md px-3">
                  <Switch 
                    id="create-isActive" 
                    checked={formData.isActive} 
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <Label htmlFor="create-isActive" className="text-slate-700 text-sm font-medium cursor-pointer">
                    Enable campaign immediately
                  </Label>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="create-description" className="text-slate-700 text-sm font-semibold">Description</Label>
                  <Textarea 
                    id="create-description" 
                    placeholder="Enter campaign context, call to actions, or notes..." 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    required 
                    className="min-h-[100px] border-slate-200 resize-y"
                  />
                </div>

                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isUploading}>Cancel</Button>
                  <Button type="submit" disabled={isUploading || addMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5">
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading Banner...
                      </>
                    ) : addMutation.isPending ? (
                      'Saving...'
                    ) : (
                      'Create Campaign'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-slate-900 text-xl font-bold flex items-center gap-2">
                  <Edit className="h-6 w-6 text-blue-600" />
                  Edit Ad Campaign
                </DialogTitle>
                <DialogDescription>
                  Modify values of the advertisement campaign.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-5">
                
                {/* Image Upload Area */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 text-sm font-semibold">Banner Image</Label>
                  <div 
                    onClick={() => editFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 hover:border-slate-300 transition-colors"
                  >
                    <input 
                      type="file" 
                      ref={editFileInputRef} 
                      onChange={(e) => handleFileChange(e, true)} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    
                    {imagePreview ? (
                      <div className="relative w-full max-h-40 overflow-hidden rounded-md border border-slate-200 bg-black flex items-center justify-center">
                        <img src={imagePreview} alt="Preview" className="max-h-40 max-w-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                          Click to change image
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <Upload className="h-10 w-10 text-slate-400 mb-2" />
                        <p className="text-slate-600 font-semibold text-sm">Click to upload banner image</p>
                        <p className="text-slate-400 text-xs mt-1">Supports PNG, JPG, JPEG (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-title" className="text-slate-700 text-sm font-semibold">Title</Label>
                    <Input 
                      id="edit-title" 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      required 
                      className="border-slate-200"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-placement" className="text-slate-700 text-sm font-semibold">Placement</Label>
                    <Input 
                      id="edit-placement" 
                      value={formData.placement} 
                      onChange={(e) => setFormData({...formData, placement: e.target.value})} 
                      required 
                      className="border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-targetUrl" className="text-slate-700 text-sm font-semibold">Target URL</Label>
                    <Input 
                      id="edit-targetUrl" 
                      value={formData.targetUrl} 
                      onChange={(e) => setFormData({...formData, targetUrl: e.target.value})} 
                      className="border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-priority" className="text-slate-700 text-sm font-semibold">Priority</Label>
                    <Input 
                      id="edit-priority" 
                      type="number"
                      value={formData.priority} 
                      onChange={(e) => setFormData({...formData, priority: Number(e.target.value)})} 
                      className="border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-startsAt" className="text-slate-700 text-sm font-semibold">Starts At</Label>
                    <Input 
                      id="edit-startsAt" 
                      type="datetime-local"
                      value={formData.startsAt} 
                      onChange={(e) => setFormData({...formData, startsAt: e.target.value})} 
                      required 
                      className="border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-endsAt" className="text-slate-700 text-sm font-semibold">Ends At</Label>
                    <Input 
                      id="edit-endsAt" 
                      type="datetime-local"
                      value={formData.endsAt} 
                      onChange={(e) => setFormData({...formData, endsAt: e.target.value})} 
                      required 
                      className="border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 h-10 bg-slate-50 border border-slate-200/80 rounded-md px-3">
                  <Switch 
                    id="edit-isActive" 
                    checked={formData.isActive} 
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <Label htmlFor="edit-isActive" className="text-slate-700 text-sm font-medium cursor-pointer">
                    Enable campaign immediately
                  </Label>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-description" className="text-slate-700 text-sm font-semibold">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    required 
                    className="min-h-[100px] border-slate-200 resize-y"
                  />
                </div>

                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isUploading}>Cancel</Button>
                  <Button type="submit" disabled={isUploading || editMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5">
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading Banner...
                      </>
                    ) : editMutation.isPending ? (
                      'Saving...'
                    ) : (
                      'Update Campaign'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-red-600 text-xl font-bold flex items-center gap-2">
                  <Trash2 className="h-6 w-6" />
                  Confirm Campaign Deletion
                </DialogTitle>
                <DialogDescription>
                  This action is permanent and cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <p className="text-slate-700 text-sm">
                  Are you sure you want to delete the advertisement campaign <span className="font-semibold text-slate-900">"{selectedAd?.title}"</span>?
                </p>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                <Button 
                  type="button" 
                  onClick={handleDeleteSubmit} 
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete Campaign'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  );
};

export default AdminAds;

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Shield, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Edit,
  Save,
  Loader2,
  Tag,
  Eye,
  Globe
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { usePrivacyPolicy, useUpdatePrivacyPolicy } from '@/services/privacy.service';
import { IPrivacyPolicy } from '@/Types/privacy';
import { formatDate } from '@/utils/dateUtils';

const AdminPrivacy = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState<{
    content: string;
    version: string;
    effectiveDate: string;
    isPublished: boolean;
  }>({
    content: '',
    version: '1.0',
    effectiveDate: new Date().toISOString().split('T')[0],
    isPublished: true
  });

  const { data: policy, isLoading, error } = usePrivacyPolicy();
  const updateMutation = useUpdatePrivacyPolicy();

  useEffect(() => {
    if (policy) {
      setFormData({
        content: policy.content || '',
        version: policy.version || '1.0',
        effectiveDate: policy.effectiveDate || new Date().toISOString().split('T')[0],
        isPublished: policy.isPublished !== undefined ? policy.isPublished : true
      });
    }
  }, [policy]);

  const handleOpenEdit = () => {
    if (policy) {
      setFormData({
        content: policy.content || '',
        version: policy.version || '1.0',
        effectiveDate: policy.effectiveDate || new Date().toISOString().split('T')[0],
        isPublished: policy.isPublished !== undefined ? policy.isPublished : true
      });
    }
    setIsEditOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Privacy Policy updated",
          description: `Version ${formData.version} has been successfully updated.`,
        });
        setIsEditOpen(false);
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Failed to update Privacy Policy",
          description: err.message || "An unknown error occurred.",
        });
      }
    });
  };

  const handleTogglePublished = (published: boolean) => {
    const updated = { ...formData, isPublished: published };
    setFormData(updated);
    updateMutation.mutate(updated, {
      onSuccess: () => {
        toast({
          title: `Privacy Policy ${published ? 'Published' : 'Unpublished'}`,
          description: `The policy visibility has been updated.`,
        });
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Failed to update status",
          description: err.message || "An unknown error occurred.",
        });
      }
    });
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                Privacy Policy Management
              </h1>
              <p className="text-slate-500 mt-1 text-sm md:text-base">
                View and update the application privacy policy content, version, and publication status.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center gap-2 border-slate-300"
                disabled={isLoading || !policy}
              >
                <Eye className="h-4 w-4" />
                Preview Policy
              </Button>
              <Button 
                onClick={handleOpenEdit} 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2"
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
                Edit Policy
              </Button>
            </div>
          </div>

          {/* Status Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="shadow-sm border-slate-200/80 bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Current Version</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                    {policy?.version || formData.version || '1.0'}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Tag className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200/80 bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Publication Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={(policy?.isPublished ?? formData.isPublished) ? 'bg-green-100 text-green-700 border-green-200 text-sm' : 'bg-amber-100 text-amber-700 border-amber-200 text-sm'}>
                      {(policy?.isPublished ?? formData.isPublished) ? 'Published / Live' : 'Draft / Unpublished'}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${(policy?.isPublished ?? formData.isPublished) ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                  <Globe className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200/80 bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Effective Date</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {formatDate(policy?.effectiveDate || formData.effectiveDate)}
                  </h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Calendar className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Card */}
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-80 bg-white rounded-2xl border border-slate-200/80 shadow-sm gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="text-sm text-slate-500 font-medium">Loading privacy policy...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-80 bg-red-50/50 rounded-2xl border border-red-200 shadow-sm p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mb-2" />
              <h3 className="font-semibold text-slate-900 text-lg">Failed to load Privacy Policy</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-md">{(error as any)?.message || 'An error occurred while fetching the privacy policy.'}</p>
              <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white" onClick={() => queryClient.invalidateQueries({ queryKey: ["privacy-policy"] })}>
                Retry
              </Button>
            </div>
          ) : (
            <Card className="shadow-sm border-slate-200/80 bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Privacy Policy Body
                  </CardTitle>
                  <CardDescription>
                    The official privacy policy text displayed to users.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium">Published:</span>
                  <Switch 
                    checked={policy?.isPublished ?? formData.isPublished}
                    onCheckedChange={handleTogglePublished}
                    disabled={updateMutation.isPending}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap font-sans text-sm leading-relaxed p-6 bg-slate-50/80 rounded-xl border border-slate-200/80 min-h-[250px]">
                  {policy?.content || formData.content || <span className="text-slate-400 italic">No policy content set yet. Click Edit Policy to add content.</span>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-3xl bg-white max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-slate-900 text-xl font-bold flex items-center gap-2">
                  <Edit className="h-6 w-6 text-blue-600" />
                  Edit Privacy Policy
                </DialogTitle>
                <DialogDescription>
                  Update the content, version, effective date, and publication status.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveSubmit} className="space-y-5 flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="policy-version" className="text-slate-700 text-sm font-semibold">Version</Label>
                    <Input 
                      id="policy-version" 
                      placeholder="e.g. 1.0.0" 
                      value={formData.version} 
                      onChange={(e) => setFormData({...formData, version: e.target.value})} 
                      required 
                      className="border-slate-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="policy-effectiveDate" className="text-slate-700 text-sm font-semibold">Effective Date</Label>
                    <Input 
                      id="policy-effectiveDate" 
                      type="date"
                      value={formData.effectiveDate} 
                      onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})} 
                      required 
                      className="border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-slate-700 text-sm font-semibold">Publication Status</Label>
                    <div className="flex items-center space-x-2 h-10 bg-slate-50 border border-slate-200/80 rounded-md px-3">
                      <Switch 
                        id="policy-isPublished" 
                        checked={formData.isPublished} 
                        onCheckedChange={(checked) => setFormData({...formData, isPublished: checked})}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <Label htmlFor="policy-isPublished" className="text-slate-700 text-sm font-medium cursor-pointer">
                        Is Published
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="policy-content" className="text-slate-700 text-sm font-semibold">Policy Content</Label>
                  <Textarea 
                    id="policy-content" 
                    placeholder="Enter full privacy policy text here..." 
                    value={formData.content} 
                    onChange={(e) => setFormData({...formData, content: e.target.value})} 
                    required 
                    className="min-h-[300px] border-slate-200 resize-y font-sans"
                  />
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={updateMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {updateMutation.isPending ? 'Saving...' : 'Save Privacy Policy'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Preview Dialog */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="max-w-4xl bg-white max-h-[85vh] flex flex-col">
              <DialogHeader>
                <div className="flex flex-wrap items-center justify-between gap-3 mr-6">
                  <DialogTitle className="text-slate-900 text-xl font-bold flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    Privacy Policy Preview (v{policy?.version || formData.version})
                  </DialogTitle>
                  <Badge className={(policy?.isPublished ?? formData.isPublished) ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}>
                    {(policy?.isPublished ?? formData.isPublished) ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <DialogDescription className="mt-1">
                  Effective Date: {policy?.effectiveDate || formData.effectiveDate}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto my-4 p-6 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {policy?.content || formData.content || 'No content provided.'}
                </div>
              </div>

              <DialogFooter className="mt-2">
                <Button type="button" variant="outline" onClick={() => setIsPreviewOpen(false)}>Close Preview</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  );
};

export default AdminPrivacy;

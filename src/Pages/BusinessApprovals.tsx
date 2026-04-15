import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useBusinessApprovals, useApproveBusiness, useRejectBusiness, useApproveBusinessDirect, useRejectBusinessDirect } from '@/services/admin.service';
import { useBusinesses } from '@/services/business.service';
import { BusinessApprovalWorkflow } from '@/Types/admin';
import AdminSidebar from '@/components/AdminSidebar';

const BusinessApprovals = () => {
  const { data: allBusinesses, isLoading } = useBusinesses();
  const approveBusiness = useApproveBusinessDirect();
  const rejectBusiness = useRejectBusinessDirect();
  
  // Filter businesses that need approval
  const approvals = allBusinesses?.filter(business => 
    business.status === 'pending' || business.status === 'rejected'
  ) || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<BusinessApprovalWorkflow | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);

  // Approval handlers
  const handleApprove = async () => {
    if (selectedApproval) {
      try {
        await approveBusiness.mutateAsync({
          businessId: selectedApproval.id || '',
          adminNotes: approvalNotes
        });
        setIsApprovalDialogOpen(false);
        setApprovalNotes('');
        setSelectedApproval(null);
      } catch (error) {
        console.error('Failed to approve business:', error);
      }
    }
  };

  const handleReject = async () => {
    if (selectedApproval && rejectionReason.trim()) {
      try {
        await rejectBusiness.mutateAsync({
          businessId: selectedApproval.id || '',
          reason: rejectionReason
        });
        setIsRejectionDialogOpen(false);
        setRejectionReason('');
        setSelectedApproval(null);
      } catch (error) {
        console.error('Failed to reject business:', error);
      }
    }
  };

  // Filter approvals based on search and filters
  const filteredApprovals = approvals?.filter(approval => {
    const matchesSearch = 
      (approval.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (approval.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (approval.ownerUserId?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  // Group approvals by status
  const approvalsByStatus = {
    all: filteredApprovals,
    pending: filteredApprovals.filter(a => a.status === 'pending'),
    under_review: filteredApprovals.filter(a => a.status === 'under_review'),
    approved: filteredApprovals.filter(a => a.status === 'approved'),
    rejected: filteredApprovals.filter(a => a.status === 'rejected'),
    needs_more_info: filteredApprovals.filter(a => a.status === 'needs_more_info')
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'under_review':
        return 'default';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'needs_more_info':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'under_review':
        return Eye;
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      case 'needs_more_info':
        return AlertTriangle;
      default:
        return Clock;
    }
  };





  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Business Approvals</h1>
              <p className="text-gray-600">Review and approve business applications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{approvals?.length || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {approvals?.filter(a => a.status === 'pending').length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {approvals?.filter(a => a.status === 'under_review').length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {approvals?.filter(a => a.status === 'approved').length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {approvals?.filter(a => a.status === 'rejected').length || 0}
                  </div>
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
                        placeholder="Search by business name, owner name, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="needs_more_info">Needs More Info</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Approval Tabs */}
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({approvalsByStatus.all.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({approvalsByStatus.pending.length})</TabsTrigger>
                <TabsTrigger value="under_review">Under Review ({approvalsByStatus.under_review.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvalsByStatus.approved.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({approvalsByStatus.rejected.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Business Applications</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {approvalsByStatus.pending.length} applications awaiting review
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {approvalsByStatus.pending.map((approval) => {
                        const StatusIcon = getStatusIcon(approval.status);
                        return (
                          <div key={approval.id} className="border rounded-lg p-6 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                  <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-semibold">{approval.name}</h3>
                                    <Badge variant={getStatusBadgeVariant(approval.status)}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {approval.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <User className="h-4 w-4" />
                                        <span>Owner ID: {approval.ownerUserId}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span>{approval.email}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span>Created: {approval.createdAt ? new Date(approval.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="text-sm font-medium text-gray-700">Business Details:</div>
                                      <div className="flex flex-wrap gap-2">
                                        {approval.categories?.map((category: string, index: number) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            <Building2 className="h-3 w-3 mr-1" />
                                            {category}
                                          </Badge>
                                        ))}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {approval.description || 'No description provided'}
                                      </div>
                                    </div>
                                  </div>

                                  {approval.notes && (
                                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm font-medium text-yellow-800">Notes</span>
                                      </div>
                                      <p className="text-sm text-yellow-700">{approval.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedApproval(approval);
                                    setIsApprovalDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedApproval(approval);
                                    setIsRejectionDialogOpen(true);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {approvalsByStatus.pending.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No pending applications</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Business Applications</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {approvalsByStatus.all.length} total applications
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {approvalsByStatus.all.map((approval) => {
                        const StatusIcon = getStatusIcon(approval.status);
                        return (
                          <div key={approval.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="p-2 bg-gray-100 rounded-full">
                                  <Building2 className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-medium">{approval.businessName}</h3>
                                    <Badge variant={getStatusBadgeVariant(approval.status)}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {approval.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {approval.ownerName} • {new Date(approval.submittedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Approve Business Application</DialogTitle>
            <DialogDescription>
              Review the business application and add any notes before approval.
            </DialogDescription>
          </DialogHeader>
          
          {selectedApproval && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  {selectedApproval.businessName}
                </h3>
                <p className="text-sm text-green-700">
                  Owner: {selectedApproval.ownerName} ({selectedApproval.ownerEmail})
                </p>
              </div>
              
              <div>
                <Label htmlFor="approval-notes">Approval Notes (Optional)</Label>
                <Textarea
                  id="approval-notes"
                  placeholder="Add any notes about this approval..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={approveBusiness.isPending}>
              {approveBusiness.isPending ? 'Approving...' : 'Approve Business'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reject Business Application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this business application.
            </DialogDescription>
          </DialogHeader>
          
          {selectedApproval && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">
                  {selectedApproval.businessName}
                </h3>
                <p className="text-sm text-red-700">
                  Owner: {selectedApproval.ownerName} ({selectedApproval.ownerEmail})
                </p>
              </div>
              
              <div>
                <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={rejectBusiness.isPending || !rejectionReason.trim()}
            >
              {rejectBusiness.isPending ? 'Rejecting...' : 'Reject Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessApprovals;

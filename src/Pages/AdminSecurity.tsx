import React, { useState } from 'react';
import { 
  Shield, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Edit,
  Download,
  MoreHorizontal,
  Search,
  Filter,
  Users,
  Building2,
  CreditCard,
  Lock,
  Key,
  User,
  Activity,
  BarChart3,
  Settings,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Flag,
  Ban,
  CheckCircle2,
  UserX,
  FileCheck,
  Database,
  Globe,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AdminSidebar from '@/components/AdminSidebar';

const AdminSecurity = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock verification data
  const verifications = [
    {
      id: '1',
      type: 'business_license',
      businessName: 'Soul Kitchen Restaurant',
      ownerName: 'Marcus Johnson',
      ownerEmail: 'marcus@soulkitchen.com',
      status: 'verified',
      submittedAt: '2024-04-01T10:00:00Z',
      verifiedAt: '2024-04-02T14:30:00Z',
      verifiedBy: 'Admin User',
      documents: ['business_license.pdf', 'tax_id.pdf'],
      notes: 'All documents verified and approved',
      expiryDate: '2025-04-01T00:00:00Z'
    },
    {
      id: '2',
      type: 'identity_verification',
      businessName: 'Black Excellence Barber Shop',
      ownerName: 'James Wilson',
      ownerEmail: 'james@blackexcellence.com',
      status: 'pending',
      submittedAt: '2024-04-05T09:15:00Z',
      verifiedAt: null,
      verifiedBy: null,
      documents: ['drivers_license.jpg', 'utility_bill.pdf'],
      notes: 'Awaiting document review',
      expiryDate: null
    },
    {
      id: '3',
      type: 'kyc_verification',
      businessName: 'Tech Solutions LLC',
      ownerName: 'Sarah Davis',
      ownerEmail: 'sarah@techsolutions.com',
      status: 'rejected',
      submittedAt: '2024-04-03T16:20:00Z',
      verifiedAt: '2024-04-04T11:45:00Z',
      verifiedBy: 'Admin User',
      documents: ['passport.pdf', 'bank_statement.pdf'],
      notes: 'Documents do not meet requirements. Please resubmit with clearer images.',
      expiryDate: null
    }
  ];

  // Mock audit logs
  const auditLogs = [
    {
      id: '1',
      action: 'user_suspension',
      user: 'Admin User',
      target: 'John Smith (john@email.com)',
      details: 'User account suspended for policy violation',
      timestamp: '2024-04-05T15:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'high'
    },
    {
      id: '2',
      action: 'business_approval',
      user: 'Admin User',
      target: 'Soul Kitchen Restaurant',
      details: 'Business application approved and activated',
      timestamp: '2024-04-05T14:15:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'medium'
    },
    {
      id: '3',
      action: 'data_export',
      user: 'Support Staff',
      target: 'User Data Export',
      details: 'Exported user data for GDPR compliance request',
      timestamp: '2024-04-05T13:45:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'low'
    }
  ];

  // Mock compliance requests
  const complianceRequests = [
    {
      id: '1',
      type: 'data_deletion',
      requester: 'Jane Doe',
      requesterEmail: 'jane@email.com',
      status: 'pending',
      submittedAt: '2024-04-05T10:00:00Z',
      dueDate: '2024-04-12T00:00:00Z',
      description: 'Request to delete all personal data under GDPR Article 17',
      assignedTo: 'Support Team',
      priority: 'high'
    },
    {
      id: '2',
      type: 'data_portability',
      requester: 'Mike Johnson',
      requesterEmail: 'mike@email.com',
      status: 'in_progress',
      submittedAt: '2024-04-04T14:30:00Z',
      dueDate: '2024-04-11T00:00:00Z',
      description: 'Request to export all personal data in machine-readable format',
      assignedTo: 'Support Team',
      priority: 'medium'
    }
  ];

  const filteredVerifications = verifications.filter(verification => {
    const matchesSearch = verification.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || verification.status === statusFilter;
    const matchesType = typeFilter === 'all' || verification.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
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
        return Clock;
      case 'rejected':
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Security & Compliance</h1>
              <p className="text-gray-600">Manage verification, compliance, and security monitoring</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{verifications.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {verifications.filter(v => v.status === 'verified').length} verified
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {verifications.filter(v => v.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compliance Requests</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{complianceRequests.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {complianceRequests.filter(c => c.status === 'pending').length} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Events</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {auditLogs.filter(a => a.severity === 'high').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    High severity events
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>Verification Center</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Review and verify business documents</p>
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Pending
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Compliance Center</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Handle GDPR and data privacy requests</p>
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Requests
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Audit Logs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Monitor system activity and security events</p>
                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="verification" className="space-y-6">
              <TabsList>
                <TabsTrigger value="verification">Verification ({verifications.length})</TabsTrigger>
                <TabsTrigger value="compliance">Compliance ({complianceRequests.length})</TabsTrigger>
                <TabsTrigger value="audit">Audit Logs ({auditLogs.length})</TabsTrigger>
                <TabsTrigger value="settings">Security Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="verification" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Verification Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search by business name, owner, or email..."
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
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="business_license">Business License</SelectItem>
                          <SelectItem value="identity_verification">Identity Verification</SelectItem>
                          <SelectItem value="kyc_verification">KYC Verification</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" className="w-full md:w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Verifications List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Verification Requests</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredVerifications.length} verification requests found
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredVerifications.map((verification) => {
                        const StatusIcon = getStatusIcon(verification.status);
                        return (
                          <div key={verification.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="font-semibold">{verification.businessName}</h3>
                                    <Badge variant={getStatusBadgeVariant(verification.status)}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {verification.status}
                                    </Badge>
                                    <Badge variant="outline">
                                      {verification.type.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Users className="h-4 w-4" />
                                        <span>Owner: {verification.ownerName}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span>{verification.ownerEmail}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span>Submitted: {new Date(verification.submittedAt).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      {verification.verifiedAt && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                          <CheckCircle className="h-4 w-4" />
                                          <span>Verified: {new Date(verification.verifiedAt).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                      {verification.verifiedBy && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                          <User className="h-4 w-4" />
                                          <span>By: {verification.verifiedBy}</span>
                                        </div>
                                      )}
                                      {verification.expiryDate && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                          <Clock className="h-4 w-4" />
                                          <span>Expires: {new Date(verification.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <p className="text-sm text-gray-700 mb-2">{verification.notes}</p>
                                    <div className="flex flex-wrap gap-2">
                                      {verification.documents.map((doc, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          <FileText className="h-3 w-3 mr-1" />
                                          {doc}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Approve Verification
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject Verification
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Add Notes
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Contact Owner
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Clock className="h-4 w-4 mr-2" />
                                      Request More Info
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Requests</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Handle GDPR, CCPA, and other data privacy requests
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {complianceRequests.map((request) => (
                        <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <FileText className="h-5 w-5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold">{request.type.replace('_', ' ').toUpperCase()}</h3>
                                  <Badge variant={getStatusBadgeVariant(request.status)}>
                                    {request.status}
                                  </Badge>
                                  <Badge variant={getSeverityBadgeVariant(request.priority)}>
                                    {request.priority}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  From: {request.requester} ({request.requesterEmail})
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{request.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                                  <span>Due: {new Date(request.dueDate).toLocaleDateString()}</span>
                                  <span>Assigned: {request.assignedTo}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Process
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Mark Complete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Users className="h-4 w-4 mr-2" />
                                    Reassign
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Contact Requester
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Data
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Request
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audit" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Logs</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Monitor system activity and security events
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Activity className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold">{log.action.replace('_', ' ').toUpperCase()}</h3>
                                  <Badge variant={getSeverityBadgeVariant(log.severity)}>
                                    {log.severity}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  User: {log.user} • Target: {log.target}
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{log.details}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Time: {new Date(log.timestamp).toLocaleString()}</span>
                                  <span>IP: {log.ipAddress}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Log
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Flag className="h-4 w-4 mr-2" />
                                    Flag for Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Analytics
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure security policies and compliance settings
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Security settings configuration coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSecurity;

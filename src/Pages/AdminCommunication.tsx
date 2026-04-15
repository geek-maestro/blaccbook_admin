import React, { useState } from 'react';
import { 
  MessageSquare, 
  Bell, 
  Mail, 
  Send, 
  Users, 
  MapPin, 
  Tag, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  Settings,
  Smartphone,
  Monitor
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

const AdminCommunication = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock notification data
  const notifications = [
    {
      id: '1',
      title: 'Black Business Friday Deals',
      message: 'Special discounts on Black-owned businesses this Friday!',
      type: 'push',
      status: 'sent',
      targetAudience: 'All Users',
      sentAt: '2024-04-05T10:00:00Z',
      recipients: 1250,
      openRate: 78.5,
      clickRate: 12.3,
      createdBy: 'Admin User',
      createdAt: '2024-04-05T09:30:00Z'
    },
    {
      id: '2',
      title: 'New Business Verification',
      message: 'Your business application has been approved!',
      type: 'email',
      status: 'scheduled',
      targetAudience: 'Business Owners',
      sentAt: '2024-04-06T14:00:00Z',
      recipients: 45,
      openRate: null,
      clickRate: null,
      createdBy: 'Admin User',
      createdAt: '2024-04-05T11:15:00Z'
    },
    {
      id: '3',
      title: 'Weekly Newsletter',
      message: 'This week\'s featured businesses and community highlights',
      type: 'email',
      status: 'draft',
      targetAudience: 'Subscribers',
      sentAt: null,
      recipients: 0,
      openRate: null,
      clickRate: null,
      createdBy: 'Admin User',
      createdAt: '2024-04-05T08:45:00Z'
    }
  ];

  // Mock support tickets
  const supportTickets = [
    {
      id: '1',
      ticketNumber: 'SUP-001',
      subject: 'Business verification taking too long',
      user: 'Marcus Johnson',
      userEmail: 'marcus@soulkitchen.com',
      category: 'business_verification',
      priority: 'high',
      status: 'open',
      assignedTo: 'Support Team',
      createdAt: '2024-04-05T09:00:00Z',
      lastMessage: '2 hours ago',
      messages: 3
    },
    {
      id: '2',
      ticketNumber: 'SUP-002',
      subject: 'Payment not processing',
      user: 'Sarah Davis',
      userEmail: 'sarah@techsolutions.com',
      category: 'billing',
      priority: 'urgent',
      status: 'in_progress',
      assignedTo: 'Finance Team',
      createdAt: '2024-04-05T08:30:00Z',
      lastMessage: '1 hour ago',
      messages: 5
    },
    {
      id: '3',
      ticketNumber: 'SUP-003',
      subject: 'Account suspension appeal',
      user: 'James Wilson',
      userEmail: 'james@blackexcellence.com',
      category: 'general',
      priority: 'medium',
      status: 'resolved',
      assignedTo: 'Admin Team',
      createdAt: '2024-04-04T16:20:00Z',
      lastMessage: '1 day ago',
      messages: 8
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent':
        return 'default';
      case 'scheduled':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
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

  const getTicketStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open':
        return 'destructive';
      case 'in_progress':
        return 'secondary';
      case 'resolved':
        return 'default';
      case 'closed':
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
              <h1 className="text-3xl font-bold text-gray-900">Communication & Engagement</h1>
              <p className="text-gray-600">Manage notifications, support tickets, and user communications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notifications.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {notifications.filter(n => n.status === 'sent').length} sent
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{supportTickets.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {supportTickets.filter(t => t.status === 'open').length} open
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78.5%</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Running campaigns
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Push Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Send instant notifications to mobile users</p>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Push Notification
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Email Campaigns</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Create and send email marketing campaigns</p>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Email Campaign
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Support Tickets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Manage customer support requests</p>
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Tickets
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="notifications" className="space-y-6">
              <TabsList>
                <TabsTrigger value="notifications">Notifications ({notifications.length})</TabsTrigger>
                <TabsTrigger value="support">Support Tickets ({supportTickets.length})</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="push">Push</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" className="w-full md:w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications List */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Notifications</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {filteredNotifications.length} notifications found
                        </p>
                      </div>
                      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Notification
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Create New Notification</DialogTitle>
                            <DialogDescription>
                              Create a new push notification or email campaign
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="title">Title</Label>
                              <Input id="title" placeholder="Notification title" />
                            </div>
                            <div>
                              <Label htmlFor="message">Message</Label>
                              <Textarea id="message" placeholder="Notification message" rows={3} />
                            </div>
                            <div>
                              <Label htmlFor="type">Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="push">Push Notification</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="sms">SMS</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="audience">Target Audience</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Users</SelectItem>
                                  <SelectItem value="consumers">Consumers Only</SelectItem>
                                  <SelectItem value="business_owners">Business Owners Only</SelectItem>
                                  <SelectItem value="subscribers">Email Subscribers</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => setIsCreateDialogOpen(false)}>
                              Create Notification
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <div key={notification.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                {notification.type === 'push' ? (
                                  <Smartphone className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <Mail className="h-5 w-5 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold">{notification.title}</h3>
                                  <Badge variant={getStatusBadgeVariant(notification.status)}>
                                    {notification.status}
                                  </Badge>
                                  <Badge variant="outline">
                                    {notification.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Target: {notification.targetAudience}</span>
                                  <span>Recipients: {notification.recipients}</span>
                                  {notification.openRate && (
                                    <span>Open Rate: {notification.openRate}%</span>
                                  )}
                                  {notification.clickRate && (
                                    <span>Click Rate: {notification.clickRate}%</span>
                                  )}
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
                                  <DropdownMenuItem>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Now
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
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

              <TabsContent value="support" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Support Tickets</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage customer support requests and inquiries
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {supportTickets.map((ticket) => (
                        <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold">{ticket.ticketNumber}</h3>
                                  <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                                    {ticket.priority}
                                  </Badge>
                                  <Badge variant={getTicketStatusBadgeVariant(ticket.status)}>
                                    {ticket.status}
                                  </Badge>
                                </div>
                                <h4 className="font-medium mb-1">{ticket.subject}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                  <span>From: {ticket.user} ({ticket.userEmail})</span>
                                  <span>Category: {ticket.category}</span>
                                  <span>Assigned: {ticket.assignedTo}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                  <span>Last message: {ticket.lastMessage}</span>
                                  <span>Messages: {ticket.messages}</span>
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
                                Reply
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
                                    <Users className="h-4 w-4 mr-2" />
                                    Assign to Team
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Resolved
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Clock className="h-4 w-4 mr-2" />
                                    Set Priority
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Close Ticket
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

              <TabsContent value="templates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Templates</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage reusable notification templates
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Template management coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Communication Analytics</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Track engagement and performance metrics
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Analytics dashboard coming soon</p>
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

export default AdminCommunication;

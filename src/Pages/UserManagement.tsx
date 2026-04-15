import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  AlertTriangle,
  Building2,
  ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useUsers, useUpdateUser, useSuspendUser } from '@/services/admin.service';
import { UserRole, UserStatus } from '@/Types/auth';
import AdminSidebar from '@/components/AdminSidebar';

const UserManagement = () => {
  const { data: users, isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const suspendUser = useSuspendUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>('consumer');

  // Filter users based on search and filters
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      (user.firstname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.lastname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || (user.role || user.userType) === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  // Group users by role for tabs
  const usersByRole = {
    all: filteredUsers,
    consumers: filteredUsers.filter(u => (u.role || u.userType) === 'consumer'),
    business_owners: filteredUsers.filter(u => (u.role || u.userType) === 'business_owner'),
    admins: filteredUsers.filter(u => ['admin', 'super_admin', 'support_staff', 'content_moderator', 'finance_manager'].includes(u.role || u.userType || ''))
  };

  const currentUsers = usersByRole[selectedTab as keyof typeof usersByRole] || [];

  const handleSuspendUser = async (userId: string, reason: string) => {
    try {
      await suspendUser.mutateAsync({ userId, reason });
    } catch (error) {
      console.error('Failed to suspend user:', error);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await updateUser.mutateAsync({ 
        userId, 
        updates: { 
          status: 'active' as UserStatus,
          updatedAt: new Date().toISOString()
        } 
      });
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await updateUser.mutateAsync({ 
          userId, 
          updates: { 
            status: 'deleted' as UserStatus,
            updatedAt: new Date().toISOString()
          } 
        });
        alert('User deleted successfully');
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleAssignRole = (user: any) => {
    setSelectedUser(user);
    setNewRole((user.role || user.userType) as UserRole);
    setIsRoleDialogOpen(true);
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser) return;
    
    try {
      await updateUser.mutateAsync({
        userId: selectedUser.userId,
        updates: {
          role: newRole,
          userType: newRole, // Also update userType for backward compatibility
          updatedAt: new Date().toISOString()
        }
      });
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role');
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'business_owner':
        return 'secondary';
      case 'consumer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'suspended':
        return 'destructive';
      case 'pending_verification':
        return 'secondary';
      case 'banned':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'business_owner':
        return Building2;
      case 'consumer':
        return ShoppingBag;
      default:
        return UserCheck;
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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage users, business owners, and administrators</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users?.filter(u => u.status === 'active').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(((users?.filter(u => u.status === 'active').length || 0) / (users?.length || 1)) * 100)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Business Owners</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users?.filter(u => u.role === 'business_owner').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Registered businesses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users?.filter(u => u.status === 'suspended' || u.status === 'banned').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
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
                      placeholder="Search users by name, email, or username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="consumer">Consumers</SelectItem>
                    <SelectItem value="business_owner">Business Owners</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                    <SelectItem value="super_admin">Super Admins</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending_verification">Pending</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full md:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Users ({usersByRole.all.length})</TabsTrigger>
              <TabsTrigger value="consumers">Consumers ({usersByRole.consumers.length})</TabsTrigger>
              <TabsTrigger value="business_owners">Business Owners ({usersByRole.business_owners.length})</TabsTrigger>
              <TabsTrigger value="admins">Admins ({usersByRole.admins.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedTab === 'all' && 'All Users'}
                    {selectedTab === 'consumers' && 'Consumers'}
                    {selectedTab === 'business_owners' && 'Business Owners'}
                    {selectedTab === 'admins' && 'Administrators'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {currentUsers.length} users found
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentUsers.map((user) => {
                      const RoleIcon = getRoleIcon((user.role || user.userType) as UserRole);
                      return (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                {user.avatarUrl ? (
                                  <img 
                                    src={user.avatarUrl} 
                                    alt={user.firstname || 'User'}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-lg font-semibold text-gray-600">
                                    {((user.firstname || user.lastname || 'U')?.[0] || 'U')}
                                  </span>
                                )}
                              </div>
                              <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                                <RoleIcon className="h-3 w-3 text-gray-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">
                                  {`${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unknown User'} 
                                </h3>
                                <Badge variant={getRoleBadgeVariant((user.role || user.userType) as UserRole)}>
                                  {(user.role || user.userType || 'unknown').replace('_', ' ')}
                                </Badge>
                                <Badge variant={getStatusBadgeVariant((user.status || 'active') as UserStatus)}>
                                  {(user.status || 'active').replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center space-x-1">
                                    <Mail className="h-3 w-3" />
                                    <span>{user.email || 'No email'}</span>
                                  </span>
                                  {user.phone && (
                                    <span className="flex items-center space-x-1">
                                      <Phone className="h-3 w-3" />
                                      <span>{user.phone}</span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                  </span>
                                  {user.lastLoginAt && (
                                    <span className="flex items-center space-x-1">
                                      <CheckCircle className="h-3 w-3" />
                                      <span>Last active {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                                    </span>
                                  )}
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
                              <Mail className="h-4 w-4 mr-1" />
                              Email
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
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAssignRole(user)}>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Assign Role
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === 'active' ? (
                                  <DropdownMenuItem 
                                    onClick={() => handleSuspendUser(user.userId, 'Administrative action')}
                                    className="text-orange-600"
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspend User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => handleActivateUser(user.userId)}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activate User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteUser(user.userId)}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Delete Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                    {currentUsers.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No users found matching your criteria</p>
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

      {/* Role Assignment Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role to User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">User</Label>
                <p className="text-sm text-gray-600">
                  {`${selectedUser.firstname || ''} ${selectedUser.lastname || ''}`.trim() || 'Unknown User'}
                </p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Current Role</Label>
                <Badge variant={getRoleBadgeVariant((selectedUser.role || selectedUser.userType) as UserRole)}>
                  {(selectedUser.role || selectedUser.userType || 'unknown').replace('_', ' ')}
                </Badge>
              </div>

              <div>
                <Label htmlFor="role">New Role</Label>
                <Select value={newRole} onValueChange={(value: UserRole) => setNewRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumer">Consumer</SelectItem>
                    <SelectItem value="business_owner">Business Owner</SelectItem>
                    <SelectItem value="support_staff">Support Staff</SelectItem>
                    <SelectItem value="content_moderator">Content Moderator</SelectItem>
                    <SelectItem value="finance_manager">Finance Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Role Permissions:</h4>
                <div className="text-sm text-blue-800">
                  {newRole === 'super_admin' && 'Full system access - can manage everything'}
                  {newRole === 'admin' && 'Can manage users, businesses, orders, and content. Cannot change system settings.'}
                  {newRole === 'support_staff' && 'Can manage orders and handle disputes. Limited access to other features.'}
                  {newRole === 'content_moderator' && 'Can moderate content, reviews, and community posts.'}
                  {newRole === 'finance_manager' && 'Can manage transactions, orders, and payments. Can view analytics.'}
                  {newRole === 'business_owner' && 'Can manage their own businesses, orders, and services.'}
                  {newRole === 'consumer' && 'Can browse businesses, place orders, and manage their account.'}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleUpdate} disabled={updateUser.isPending}>
              {updateUser.isPending ? 'Updating...' : 'Assign Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;

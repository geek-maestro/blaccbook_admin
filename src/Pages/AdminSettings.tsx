import React, { useState } from 'react';
import { 
  Settings, 
  CreditCard, 
  Tag, 
  Percent, 
  Globe, 
  DollarSign, 
  MapPin, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Smartphone, 
  Monitor, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Eye,
  EyeOff,
  Key,
  Lock,
  Users,
  Building2,
  Calendar,
  Clock,
  BarChart3,
  FileText,
  Image,
  Video,
  MessageSquare,
  Star,
  TrendingUp,
  Activity,
  Zap,
  Wifi,
  Server,
  HardDrive,
  Cpu,
  MemoryStick
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
import { Switch } from '@/components/ui/switch';
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

const AdminSettings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Mock settings data
  const appSettings = {
    general: {
      appName: 'BlaccBook',
      appVersion: '1.2.3',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
      phoneVerificationRequired: false,
      defaultLanguage: 'en',
      defaultCurrency: 'USD',
      timezone: 'America/New_York'
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: true,
      defaultCommissionRate: 5.0,
      minimumPayout: 25.00,
      payoutSchedule: 'weekly',
      taxRate: 8.5,
      currency: 'USD'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      adminNotifications: true,
      businessNotifications: true,
      userNotifications: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireStrongPasswords: true,
      ipWhitelist: false,
      auditLogging: true
    }
  };

  // Mock categories
  const categories = [
    { id: '1', name: 'Restaurant', description: 'Food and dining establishments', active: true, businessCount: 45, createdAt: '2024-01-15' },
    { id: '2', name: 'Beauty & Wellness', description: 'Salons, spas, and wellness services', active: true, businessCount: 32, createdAt: '2024-01-15' },
    { id: '3', name: 'Professional Services', description: 'Business and professional services', active: true, businessCount: 28, createdAt: '2024-01-15' },
    { id: '4', name: 'Retail', description: 'Retail stores and shopping', active: true, businessCount: 67, createdAt: '2024-01-15' },
    { id: '5', name: 'Health & Medical', description: 'Healthcare and medical services', active: false, businessCount: 12, createdAt: '2024-01-15' }
  ];

  // Mock promotions
  const promotions = [
    {
      id: '1',
      name: 'Black Business Friday',
      description: 'Monthly promotion for Black-owned businesses',
      type: 'discount',
      value: 20,
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      status: 'active',
      usageCount: 156,
      maxUsage: 1000,
      applicableCategories: ['Restaurant', 'Retail', 'Beauty & Wellness']
    },
    {
      id: '2',
      name: 'New Business Welcome',
      description: 'Welcome discount for new business owners',
      type: 'percentage',
      value: 15,
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      status: 'active',
      usageCount: 23,
      maxUsage: 500,
      applicableCategories: ['All']
    }
  ];

  // Mock system health
  const systemHealth = {
    serverStatus: 'online',
    databaseStatus: 'online',
    apiStatus: 'online',
    uptime: '99.9%',
    responseTime: '120ms',
    activeUsers: 1250,
    totalStorage: '2.5TB',
    usedStorage: '1.8TB',
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 72
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Settings & Configurations</h1>
              <p className="text-gray-600">Manage app settings, categories, promotions, and system configurations</p>
            </div>

            {/* System Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">
                    Uptime: {systemHealth.uptime}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemHealth.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently online
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemHealth.responseTime}</div>
                  <p className="text-xs text-muted-foreground">
                    Average response time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemHealth.diskUsage}%</div>
                  <p className="text-xs text-muted-foreground">
                    {systemHealth.usedStorage} of {systemHealth.totalStorage}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general">General Settings</TabsTrigger>
                <TabsTrigger value="payment">Payment & Billing</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="system">System Health</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Application Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure basic application settings and preferences
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="appName">Application Name</Label>
                          <Input id="appName" defaultValue={appSettings.general.appName} />
                        </div>
                        <div>
                          <Label htmlFor="appVersion">Application Version</Label>
                          <Input id="appVersion" defaultValue={appSettings.general.appVersion} disabled />
                        </div>
                        <div>
                          <Label htmlFor="defaultLanguage">Default Language</Label>
                          <Select defaultValue={appSettings.general.defaultLanguage}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="defaultCurrency">Default Currency</Label>
                          <Select defaultValue={appSettings.general.defaultCurrency}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="CAD">CAD (C$)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select defaultValue={appSettings.general.timezone}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="America/Chicago">Central Time</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                            <Switch id="maintenanceMode" defaultChecked={appSettings.general.maintenanceMode} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="registrationEnabled">Registration Enabled</Label>
                            <Switch id="registrationEnabled" defaultChecked={appSettings.general.registrationEnabled} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="emailVerificationRequired">Email Verification Required</Label>
                            <Switch id="emailVerificationRequired" defaultChecked={appSettings.general.emailVerificationRequired} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="phoneVerificationRequired">Phone Verification Required</Label>
                            <Switch id="phoneVerificationRequired" defaultChecked={appSettings.general.phoneVerificationRequired} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment & Billing Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure payment processors, commission rates, and billing settings
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="defaultCommissionRate">Default Commission Rate (%)</Label>
                          <Input id="defaultCommissionRate" type="number" defaultValue={appSettings.payment.defaultCommissionRate} />
                        </div>
                        <div>
                          <Label htmlFor="minimumPayout">Minimum Payout Amount</Label>
                          <Input id="minimumPayout" type="number" defaultValue={appSettings.payment.minimumPayout} />
                        </div>
                        <div>
                          <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                          <Select defaultValue={appSettings.payment.payoutSchedule}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="taxRate">Tax Rate (%)</Label>
                          <Input id="taxRate" type="number" defaultValue={appSettings.payment.taxRate} />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="stripeEnabled">Stripe Integration</Label>
                            <Switch id="stripeEnabled" defaultChecked={appSettings.payment.stripeEnabled} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="paypalEnabled">PayPal Integration</Label>
                            <Switch id="paypalEnabled" defaultChecked={appSettings.payment.paypalEnabled} />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="stripeApiKey">Stripe API Key</Label>
                          <div className="flex space-x-2">
                            <Input 
                              id="stripeApiKey" 
                              type={showApiKey ? "text" : "password"} 
                              defaultValue="sk_test_..." 
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setShowApiKey(!showApiKey)}
                            >
                              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                          <Input id="paypalClientId" type="password" defaultValue="..." />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Payment Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Business Categories</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Manage business categories and tags
                        </p>
                      </div>
                      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>
                              Add a new business category to the platform
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="categoryName">Category Name</Label>
                              <Input id="categoryName" placeholder="Enter category name" />
                            </div>
                            <div>
                              <Label htmlFor="categoryDescription">Description</Label>
                              <Textarea id="categoryDescription" placeholder="Enter category description" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => setIsCreateDialogOpen(false)}>
                              Create Category
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredCategories.map((category) => (
                        <div key={category.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Tag className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold">{category.name}</h3>
                                  <Badge variant={category.active ? "default" : "secondary"}>
                                    {category.active ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <Building2 className="h-3 w-3" />
                                    <span>{category.businessCount} businesses</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
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
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Businesses
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Category
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Tag className="h-4 w-4 mr-2" />
                                    Manage Tags
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Category
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

              <TabsContent value="promotions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Promotions & Discounts</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage platform-wide promotions and discount campaigns
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {promotions.map((promotion) => (
                        <div key={promotion.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Percent className="h-5 w-5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold">{promotion.name}</h3>
                                  <Badge variant={promotion.status === 'active' ? "default" : "secondary"}>
                                    {promotion.status}
                                  </Badge>
                                  <Badge variant="outline">
                                    {promotion.value}% {promotion.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{promotion.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                                  <span>Start: {new Date(promotion.startDate).toLocaleDateString()}</span>
                                  <span>End: {new Date(promotion.endDate).toLocaleDateString()}</span>
                                  <span>Usage: {promotion.usageCount}/{promotion.maxUsage}</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {promotion.applicableCategories.map((category, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
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
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Promotion
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Promotion
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

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure notification preferences and templates
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Email Notifications</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
                            <Switch id="emailNotifications" defaultChecked={appSettings.notifications.emailNotifications} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="adminNotifications">Admin Notifications</Label>
                            <Switch id="adminNotifications" defaultChecked={appSettings.notifications.adminNotifications} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="businessNotifications">Business Notifications</Label>
                            <Switch id="businessNotifications" defaultChecked={appSettings.notifications.businessNotifications} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Push & SMS Notifications</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="pushNotifications">Push Notifications</Label>
                            <Switch id="pushNotifications" defaultChecked={appSettings.notifications.pushNotifications} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="smsNotifications">SMS Notifications</Label>
                            <Switch id="smsNotifications" defaultChecked={appSettings.notifications.smsNotifications} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="userNotifications">User Notifications</Label>
                            <Switch id="userNotifications" defaultChecked={appSettings.notifications.userNotifications} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Notification Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure security policies and authentication settings
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Input id="sessionTimeout" type="number" defaultValue={appSettings.security.sessionTimeout} />
                        </div>
                        <div>
                          <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                          <Input id="maxLoginAttempts" type="number" defaultValue={appSettings.security.maxLoginAttempts} />
                        </div>
                        <div>
                          <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                          <Input id="passwordMinLength" type="number" defaultValue={appSettings.security.passwordMinLength} />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                            <Switch id="twoFactorAuth" defaultChecked={appSettings.security.twoFactorAuth} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="requireStrongPasswords">Require Strong Passwords</Label>
                            <Switch id="requireStrongPasswords" defaultChecked={appSettings.security.requireStrongPasswords} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                            <Switch id="ipWhitelist" defaultChecked={appSettings.security.ipWhitelist} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auditLogging">Audit Logging</Label>
                            <Switch id="auditLogging" defaultChecked={appSettings.security.auditLogging} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Security Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Server className="h-5 w-5" />
                        <span>Server Status</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">API Status</span>
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database Status</span>
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Uptime</span>
                        <span className="text-sm font-medium">{systemHealth.uptime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Response Time</span>
                        <span className="text-sm font-medium">{systemHealth.responseTime}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Cpu className="h-5 w-5" />
                        <span>System Resources</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">CPU Usage</span>
                        <span className="text-sm font-medium">{systemHealth.cpuUsage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Memory Usage</span>
                        <span className="text-sm font-medium">{systemHealth.memoryUsage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Disk Usage</span>
                        <span className="text-sm font-medium">{systemHealth.diskUsage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Users</span>
                        <span className="text-sm font-medium">{systemHealth.activeUsers.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>System Actions</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Perform system maintenance and administrative tasks
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Cache
                      </Button>
                      <Button variant="outline">
                        <Database className="h-4 w-4 mr-2" />
                        Backup Database
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Logs
                      </Button>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Update System
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
    </div>
  );
};

export default AdminSettings;

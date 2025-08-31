import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  CreditCard, 
  Shield, 
  Bell, 
  MapPin, 
  Star, 
  ShoppingCart,
  Package,
  LogOut,
  User,
  Menu,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useLogout } from '@/services/auth1.service';
import { useUserProfile } from '@/services/profile.service';
import { hasPermission } from '@/services/admin.service';
import { UserRole } from '@/Types/auth';

function AdminSidebar() {
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const { mutate: signOut, isPending } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const userRole = (profile?.role || profile?.userType) as UserRole || 'consumer';
  
  // Debug logging
  console.log('AdminSidebar - Profile:', profile);
  console.log('AdminSidebar - User Role:', userRole);
  console.log('AdminSidebar - Available permissions:', hasPermission(userRole, 'canManageUsers'));


  const handleLogout = () => {
    signOut(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: (error) => {
        console.error("Logout failed:", error);
      }
    });
  };

  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Admin-specific navigation items
  const adminNavItems = [
    { 
      path: '/admin', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      description: 'Overview & Analytics',
      permission: 'canViewAnalytics'
    },
    { 
      path: '/admin/users', 
      icon: Users, 
      label: 'Users',
      description: 'Manage users',
      permission: 'canManageUsers',
      badge: '12' // Mock notification count
    },
    { 
      path: '/admin/businesses/approvals', 
      icon: Building2, 
      label: 'Business Approvals',
      description: 'Review applications',
      permission: 'canManageBusinesses',
      badge: '5' // Mock pending approvals
    },
    { 
      path: '/admin/businesses', 
      icon: Building2, 
      label: 'Business Management',
      description: 'Manage listings',
      permission: 'canManageBusinesses'
    },
    { 
      path: '/admin/transactions', 
      icon: CreditCard, 
      label: 'Transactions',
      description: 'Payment management',
      permission: 'canManageTransactions'
    },
    { 
      path: '/admin/orders', 
      icon: Package, 
      label: 'Order Analytics',
      description: 'Monitor orders & disputes',
      permission: 'canManageOrders'
    },
    { 
      path: '/admin/map', 
      icon: MapPin, 
      label: 'GPS & Maps',
      description: 'Location management',
      permission: 'canManageBusinesses'
    },
    { 
      path: '/admin/communication', 
      icon: MessageSquare, 
      label: 'Communication',
      description: 'Notifications & support',
      permission: 'canManageUsers',
      badge: '8' // Mock support tickets
    },
    { 
      path: '/admin/content', 
      icon: Star, 
      label: 'Content',
      description: 'Content moderation',
      permission: 'canManageContent'
    },
    { 
      path: '/admin/analytics', 
      icon: BarChart3, 
      label: 'Analytics',
      description: 'Reports & insights',
      permission: 'canViewAnalytics'
    },
    { 
      path: '/admin/security', 
      icon: Shield, 
      label: 'Security',
      description: 'Verification & compliance',
      permission: 'canManageUsers'
    },
    { 
      path: '/admin/settings', 
      icon: Settings, 
      label: 'Settings',
      description: 'System configuration',
      permission: 'canManageSettings'
    },
  ];

  // Filter admin items based on permissions
  const filteredAdminItems = adminNavItems.filter(item => 
    hasPermission(userRole, item.permission as any)
  );
  
  // Fallback: if no items are filtered and user is admin, show all items
  const displayItems = filteredAdminItems.length > 0 ? filteredAdminItems : 
    (userRole === 'admin' || userRole === 'super_admin' ? adminNavItems : []);
  
  console.log('AdminSidebar - Filtered Items:', filteredAdminItems);
  console.log('AdminSidebar - Display Items:', displayItems);


  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-300" />
          <div>
            <h2 className="text-xl font-bold tracking-wider text-white">BLACCBOOK</h2>
            <p className="text-xs text-blue-200">Admin Portal</p>
          </div>
        </div>
      </div>

      <Separator className="bg-blue-500/30" />

      {/* User Info Section */}
      <div className="px-6 py-4 border-b border-blue-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            {profile?.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.firstname}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-blue-200" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile?.firstname && profile?.lastname 
                ? `${profile.firstname} ${profile.lastname}`
                : profile?.name || 'Admin User'
              }
            </p>
            <p className="text-xs text-blue-200 truncate">
              {profile?.email}
            </p>
            <Badge variant="secondary" className="text-xs mt-1 bg-blue-500/20 text-blue-200 border-blue-400/30">
              {(profile?.role || profile?.userType)?.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {displayItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center p-3 rounded-lg transition-all duration-200 group",
                    isActivePath(item.path)
                      ? "bg-white/10 text-white"
                      : "text-blue-100 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center flex-1">
                    <span className={cn(
                      "p-2 rounded-lg relative",
                      isActivePath(item.path)
                        ? "bg-blue-500/20 text-blue-200"
                        : "text-blue-300 group-hover:text-blue-200"
                    )}>
                      <Icon className="h-5 w-5" />
                      {item.badge && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </span>
                    <div className="ml-3">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-blue-300/80">{item.description}</p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator className="bg-blue-500/30" />

      {/* System Status */}
      <div className="px-6 py-4 border-b border-blue-500/30">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-200">System Status</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-300">Online</span>
            </div>
          </div>
          <div className="text-xs text-blue-300/80">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="px-6 py-2 text-xs text-blue-200/60">
        <p>Role: {userRole}</p>
        <p>Items: {displayItems.length}</p>
      </div>

      {/* Sign Out Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-100"
          onClick={handleLogout}
          disabled={isPending}
        >
          <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
          <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 p-0 bg-gradient-to-b from-blue-600 to-blue-800 border-r-blue-500/30"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-80 flex-col bg-gradient-to-b from-blue-600 to-blue-800 text-white">
        <SidebarContent />
      </aside>
    </>
  );
}

export default AdminSidebar;

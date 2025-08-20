import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Building2, LayoutDashboard, DollarSign, FileText, MessageSquare, Settings, LogOut, Menu, Store, Wrench, CalendarClock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useLogout } from '@/services/auth1.service';

function Sidebar() {
  const navigate = useNavigate();

  const { mutate: signOut, isPending } = useLogout();

  const handleLogout = () => {
    signOut(undefined, {
      onSuccess: () => {
        // Navigate to login page or handle successful logout
        navigate("/login");
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        // Handle error (show toast, etc.)
      }
    });
  };

  const location = useLocation();
//   const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isActivePath = (path :string) => {
    return location.pathname === path;
  };

 
  const navItems = [
    { 
      path: '/home', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      description: 'Overview & Analytics'
    },
    { 
      path: '/business', 
      icon: Building2, 
      label: 'Businesses',
      description: 'Businesses Onboard'
    },
    {
      path: '/merchants',
      icon: Store,
      label: 'Merchants',
      description: 'Manage merchants'
    },
    {
      path: '/services',
      icon: Wrench,
      label: 'Services',
      description: 'What merchants provide'
    },
    {
      path: '/bookings',
      icon: CalendarClock,
      label: 'Bookings',
      description: 'Calls & bookings'
    },
    { 
      path: '/investments', 
      icon: DollarSign, 
      label: 'Investment',
      description: 'investors & money'
    },
    // { 
    //   path: '/report', 
    //   icon: FileText, 
    //   label: 'Reports',
    //   description: 'Analytics'
    // },
    // { 
    //   path: '/message', 
    //   icon: MessageSquare, 
    //   label: 'Reviews',
    //   description: 'Communications'
    // },
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Settings',
      description: 'Preferences'
    },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-blue-300" />
          <div>
            <h2 className="text-xl font-bold tracking-wider text-white">BLACCBOOK</h2>
            <p className="text-xs text-blue-200">Black Businesses</p>
          </div>
        </div>
      </div>

      <Separator className="bg-blue-500/30" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
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
                      "p-2 rounded-lg",
                      isActivePath(item.path)
                        ? "bg-blue-500/20 text-blue-200"
                        : "text-blue-300 group-hover:text-blue-200"
                    )}>
                      <Icon className="h-5 w-5" />
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

      {/* Sign Out Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-100"
         onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
          <span>Sign Out</span>
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
          className="w-72 p-0 bg-gradient-to-b from-blue-600 to-blue-800 border-r-blue-500/30"
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

export default Sidebar;
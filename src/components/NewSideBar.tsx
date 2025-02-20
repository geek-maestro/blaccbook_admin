import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  WalletCards, 
  ArrowRightLeft, 
  Users, 
  Package, 
  CreditCard, 
  Receipt, 
  BarChart3, 
  MoreHorizontal,
  Code,
  ChevronRight,
  Menu
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const mainNavItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/balances', icon: WalletCards, label: 'Balances' },
    { path: '/transactions', icon: ArrowRightLeft, label: 'Transactions' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/catalogue', icon: Package, label: 'Product catalogue' },
  ];

  const productItems = [
    { 
      label: 'Payments',
      icon: CreditCard,
      items: [
        { path: '/payments/process', label: 'Process Payments' },
        { path: '/payments/history', label: 'Payment History' },
        { path: '/payments/settings', label: 'Payment Settings' }
      ]
    },
    {
      label: 'Billing',
      icon: Receipt,
      items: [
        { path: '/billing/invoices', label: 'Invoices' },
        { path: '/billing/subscriptions', label: 'Subscriptions' },
        { path: '/billing/plans', label: 'Plans' }
      ]
    },
    {
      label: 'Reporting',
      icon: BarChart3,
      items: [
        { path: '/reporting/analytics', label: 'Analytics' },
        { path: '/reporting/exports', label: 'Exports' },
        { path: '/reporting/insights', label: 'Insights' }
      ]
    },
    {
      label: 'More',
      icon: MoreHorizontal,
      items: [
        { path: '/settings', label: 'Settings' },
        { path: '/help', label: 'Help Center' }
      ]
    }
  ];

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg",
          isActivePath(item.path) && "text-purple-600 bg-purple-50"
        )}
      >
        <Icon className="h-4 w-4 mr-3" />
        {item.label}
      </Link>
    );
  };

  const CollapsibleNavItem = ({ item }) => {
    const [isItemOpen, setIsItemOpen] = useState(false);
    const Icon = item.icon;

    return (
      <Collapsible
        open={isItemOpen}
        onOpenChange={setIsItemOpen}
        className="w-full"
      >
        <CollapsibleTrigger className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          <Icon className="h-4 w-4 mr-3" />
          <span className="flex-1">{item.label}</span>
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform duration-200",
            isItemOpen && "rotate-90"
          )} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-9 pr-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.path}
              to={subItem.path}
              className={cn(
                "flex items-center py-2 text-sm text-gray-600 hover:text-purple-600",
                isActivePath(subItem.path) && "text-purple-600"
              )}
            >
              {subItem.label}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Fixed Header */}
      <div className="flex-none px-4 py-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">
            cm
          </div>
          <span className="font-medium">Content-mobbin</span>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <NavItem item={item} />
              </li>
            ))}
          </ul>

          {/* Products Section */}
          <div className="mt-6">
            <div className="px-4 mb-2 text-xs font-medium text-gray-500">
              Products
            </div>
            <ul className="space-y-1">
              {productItems.map((item) => (
                <li key={item.label}>
                  <CollapsibleNavItem item={item} />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Fixed Footer */}
      <div className="flex-none p-4 border-t">
        <NavItem 
          item={{ path: '/developers', icon: Code, label: 'Developers' }}
        />
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
            className="lg:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 border-r">
        <SidebarContent />
      </aside>
    </>
  );
}

export default Sidebar;
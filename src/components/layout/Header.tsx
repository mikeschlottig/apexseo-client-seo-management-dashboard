import React from 'react';
import { useLocation } from "react-router-dom";
import { Search, Bell, Menu, Zap, Plus, FileText, BarChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "../ThemeToggle";
function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/clients/")) return "Client Details";
  const segments = pathname.split("/").filter(Boolean);
  const title = segments[0] || "Dashboard";
  return title.charAt(0).toUpperCase() + title.slice(1);
}
const mockNotifications = [
  { id: '1', title: 'New client added', description: 'Innovate Inc. was added to your clients', time: '5m ago', read: false },
  { id: '2', title: 'Deal won', description: 'Future Systems moved to Won stage', time: '1h ago', read: false },
  { id: '3', title: 'Task completed', description: 'SEO audit completed for GreenLeaf', time: '2h ago', read: true },
];

const quickActions = [
  { icon: Plus, label: 'New Client', href: '/clients' },
  { icon: Plus, label: 'New Lead', href: '/pipeline' },
  { icon: FileText, label: 'Generate Report', href: '/reports' },
  { icon: BarChart, label: 'View Analytics', href: '/dashboard' },
];

export function Header() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-xl shadow-sm px-4 sm:px-6 lg:px-8">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      <h1 className="text-xl font-semibold hidden md:block">{pageTitle}</h1>
      <div className="flex items-center gap-2 md:gap-4 md:ml-auto w-full md:w-auto">
        <div className="relative w-full md:w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform focus-within:scale-110" />
          <Input
            type="search"
            placeholder="Search clients, tasks..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="pl-9 w-full focus-visible:ring-2 focus-visible:ring-primary"
          />
          {searchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-2 py-1">Recent Searches</p>
                <div className="space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded-sm transition-colors">
                    Innovate Inc.
                  </button>
                  <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded-sm transition-colors">
                    SEO audit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:scale-110 transition-transform">
              <Zap className="h-5 w-5" />
              <span className="sr-only">Quick Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem key={action.label} asChild>
                  <a href={action.href} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </a>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle className="relative" />

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative hover:scale-110 transition-transform">
          <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
          <span className="sr-only">Notifications</span>
        </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Notifications</h4>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllRead} className="h-auto p-0 text-xs">
                    Mark all read
                  </Button>
                )}
              </div>
              <Separator />
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((notification, idx) => (
                  <div key={notification.id}>
                    {idx > 0 && <Separator className="my-2" />}
                    <div className={`p-2 rounded-md hover:bg-muted transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:scale-110 transition-transform">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
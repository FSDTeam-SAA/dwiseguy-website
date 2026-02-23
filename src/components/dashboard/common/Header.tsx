"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, KeyIcon, LogOut, Menu, User2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import HeaderTitle from "./Headertitle";
import { useGetUserProfile } from "@/features/account/hooks/usePersonalinfo";

interface Notification {
  _id: string;
  message: string;
  isViewed: boolean;
}

export default function DashboardHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { data: profileResponse, isLoading } = useGetUserProfile();
  
  const user = profileResponse?.data;

  const notifications: Notification[] = [
    { _id: "1", message: "Your order has been shipped.", isViewed: false },
    { _id: "2", message: "New message from support team.", isViewed: false },
    { _id: "3", message: "System update completed.", isViewed: true },
  ];

  const unseenCount = notifications.filter((n) => !n.isViewed).length;

  const handleLogout = () => {
    signOut();
    setLogoutDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4 p-5 bg-white rounded-md">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <header className="w-full h-[100px] bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      {/* Left: Logo + Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-md border hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        <HeaderTitle
          title="My Dashboard"
          subtitle="Welcome back! Here’s what’s happening today...."
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Link href="/notification">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-6 w-6 text-gray-600" />

            {unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unseenCount}
              </span>
            )}
          </button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.avatar?.url || "/images/profile-mini.jpg"}
                  alt="User"
                />
                <AvatarFallback>
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="text-left">
                <p className="text-sm font-medium">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer">
                <User2Icon className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
            </Link>

            <Link href="/profile/changePassword">
              <DropdownMenuItem className="cursor-pointer">
                <KeyIcon className="mr-2 h-4 w-4" /> Change Password
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem
              className="text-[#e5102e] hover:bg-[#feecee] cursor-pointer"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
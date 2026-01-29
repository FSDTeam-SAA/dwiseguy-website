"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, Package, Key } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Menu items for unauthenticated users
const unauthenticatedMenuItems = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About" },
  { href: "/contact-us", label: "Contact Us" },
];

// Menu items for authenticated users
const authenticatedMenuItems = [
  { href: "/", label: "Home" },
  { href: "/introduction", label: "Introduction" },
  { href: "/about-us", label: "About" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/academy", label: "Academy" },
];

import { Session } from "next-auth";

// Reusable User Profile Dropdown Component
const UserProfile = ({ session }: { session: Session | null }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/20 p-0 hover:bg-primary/10">
        <Avatar className="h-9 w-9 bg-white">
          <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {session?.user?.name?.charAt(0) || <User size={18} />}
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
          <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <Link href="/profile/orders">
        {/* <DropdownMenuItem className="cursor-pointer">
          <Package className="mr-2 h-4 w-4" />
          <span>Order History</span>
        </DropdownMenuItem> */}
      </Link>
      <Link href="/profile/change-password">
        <DropdownMenuItem className="cursor-pointer">
          <Key className="mr-2 h-4 w-4" />
          <span>Change Password</span>
        </DropdownMenuItem>
      </Link>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log Out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();



  const isActive = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href));

  // Select menu items based on authentication status
  const menuItems = status === "authenticated" ? authenticatedMenuItems : unauthenticatedMenuItems;

  return (
    // <nav className="sticky top-0 z-50 h-full w-full mx-auto mt-5 border-rounded rounded-md px-4 sm:px-8 flex justify-between bg-primary/80 items-center py-0! mb-15 transition-all duration-300 backdrop-blur-md">
    //   <div className="container ">
    //     {/* Logo */}
    //     <Link href="/" className="flex items-center">
    //       <Image src="/images/footerlogo.png" alt="Logo" width={80} height={80} className="cursor-pointer" priority />
    //     </Link>

    //     {/* Desktop Menu */}
    //     <ul className="hidden md:flex space-x-4 font-medium items-center">
    //       {menuItems.map((item) => (
    //         <li key={item.href} className="relative">
    //           <Link
    //             href={item.href}
    //             className={cn(
    //               "px-6 py-2.5 rounded-md transition-all duration-300 ease-in-out",
    //               "hover:scale-105 hover:shadow-lg hover:shadow-white/10",
    //               "active:scale-95",
    //               isActive(item.href)
    //                 ? "bg-white/20 text-white font-semibold shadow-md shadow-white/10 backdrop-blur-md border border-white/30"
    //                 : "text-white/80 bg-transparent border border-transparent hover:bg-white/15 hover:backdrop-blur-sm hover:border-white/20 hover:text-white"
    //             )}
    //           >
    //             {item.label}
    //           </Link>
    //         </li>
    //       ))}
    //     </ul>

    //     {/* Desktop Actions */}
    //     <div className="hidden md:flex items-center space-x-4">
    //       {status === "unauthenticated" ? (
    //         <Link href="/login">
    //           <Button variant="outline" className="border-primary text-primary-foreground hover:bg-primary/10 hover:text-white px-8 rounded-lg font-semibold transition-all">Log In</Button>
    //         </Link>
    //       ) : (
    //         <UserProfile session={session} />
    //       )}
    //     </div>

    //     {/* Mobile Menu */}
    //     <div className="flex md:hidden items-center space-x-4">
    //       {status === "authenticated" && <UserProfile session={session} />}
    //       <Sheet open={open} onOpenChange={setOpen}>
    //         <SheetTrigger asChild>
    //           <Button variant="ghost" size="icon" className="text-white hover:text-primary transition-colors">
    //             {open ? <X size={28} /> : <Menu size={28} />}
    //           </Button>
    //         </SheetTrigger>

    //         {/* Styled SheetContent with Glassmorphism */}
    //         <SheetContent
    //           side="right"
    //           className="w-[300px] bg-black/60 backdrop-blur-xl border-l border-white/10 text-white"
    //         >
    //           <nav className="flex flex-col space-y-3 mt-12">
    //             {menuItems.map((item) => (
    //               <Link
    //                 key={item.href}
    //                 href={item.href}
    //                 onClick={() => setOpen(false)}
    //                 className={cn(
    //                   "px-5 py-3 rounded-lg font-medium text-lg transition-all duration-200",
    //                   isActive(item.href)
    //                     ? "text-primary bg-primary/20 border border-primary/30 font-semibold shadow-inner"
    //                     : "text-white/80 hover:text-white hover:bg-white/10"
    //                 )}
    //               >
    //                 {item.label}
    //               </Link>
    //             ))}

    //             {status === "unauthenticated" && (
    //               <div className="flex flex-col px-5 pt-6 mt-6 border-t border-white/10">
    //                 <Link href="/login" onClick={() => setOpen(false)}>
    //                   <Button
    //                     variant="outline"
    //                     className="w-full border-primary/50 text-primary hover:bg-primary hover:text-white px-8 rounded-lg font-semibold transition-all shadow-lg shadow-primary/10"
    //                   >
    //                     Log In
    //                   </Button>
    //                 </Link>
    //               </div>
    //             )}
    //           </nav>
    //         </SheetContent>
    //       </Sheet>
    //     </div>
    //   </div>
    // </nav>
    <nav className="sticky top-0 z-50 w-full h-20 px-6 rounded-none py-1 bg-primary/80 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-300">
      <div className="container mx-auto max-w-7xl flex items-center justify-between ">

        {/* 1. LOGO */}
        <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
          <Image src="/images/footerlogo.png" alt="Logo" width={60} height={60} priority />
        </Link>

        {/* 2. DESKTOP MENU */}
        <ul className="hidden md:flex items-center space-x-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-white/20 text-white shadow-inner border border-white/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 3. DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          {status === "unauthenticated" ? (
            <Link href="/login">
              <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-primary font-bold">
                Log In
              </Button>
            </Link>
          ) : (
            <UserProfile session={session} />
          )}
        </div>

        {/* 4. MOBILE MENU & TOGGLE */}
        <div className="flex md:hidden items-center gap-3">
          {status === "authenticated" && <UserProfile session={session} />}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                {open ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-slate-950/95 backdrop-blur-xl border-l border-white/10 text-white p-0">
              <div className="flex flex-col h-full pt-20 px-6">
                <nav className="flex flex-col space-y-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-xl font-semibold py-3 border-b border-white/5",
                        isActive(item.href) ? "text-primary" : "text-white/80"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {status === "unauthenticated" && (
                    <Link href="/login" onClick={() => setOpen(false)} className="pt-4">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg">
                        Log In
                      </Button>
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>

  );
}
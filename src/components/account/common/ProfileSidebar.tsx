"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LogOut,
  User,
  Timer,
  Lock,
} from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "My Profile", href: "/profile/my-profile#personal", icon: User },
  { name: "Progress", href: "/profile/progress", icon: Timer },
  { name: "Change Password", href: "/profile/my-profile#change-password", icon: Lock },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const currentHash = useSyncExternalStore(
    (callback) => {
      globalThis.addEventListener("hashchange", callback);
      return () => globalThis.removeEventListener("hashchange", callback);
    },
    () => globalThis.location.hash,
    () => "" // Server-side snapshot
  );

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
    setOpen(false);
  };

  return (
    // Fixed height h-full (if parent is screen) or h-screen with flex-col
    <div className="flex h-[calc(100vh-100px)] w-full flex-col bg-transparent">

      {/* Navigation Section */}
      <nav className="flex flex-col gap-y-3 space-y-4">
        {navigation.map((item) => {
          // Improved activity logic for hash routes
          const currentPathWithHash = pathname + currentHash;

          let isItemActive = currentPathWithHash === item.href;

          // Special case for initial load without hash on /profile/my-profile
          if (!currentHash && pathname === "/profile/my-profile" && item.href.endsWith("#personal")) {
            isItemActive = true;
          }

          const isProgress = item.name === "Progress";

          // Refactored active classes to avoid nested ternary
          let activeClasses = "text-gray-400 hover:bg-white/5 hover:text-white";
          if (isItemActive && !isProgress) {
            activeClasses = "bg-primary text-white shadow-lg shadow-primary/20";
          } else if (isProgress) {
            activeClasses = "bg-black border border-white/20 text-white hover:bg-white/5";
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[0.5rem] px-5 py-3 text-sm font-semibold transition-all duration-200 w-full",
                activeClasses
              )}
            >
              <item.icon className={cn("h-4 w-4", isItemActive && !isProgress ? "text-white" : "text-white/70")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout pushed to bottom with mt-auto */}
      <div className="mt-auto">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full justify-start gap-3 h-[46px] px-5 cursor-pointer rounded-[0.5rem] font-semibold bg-[#cc1d39] text-white hover:bg-[#b01832] transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Confirm Logout</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to log out of your account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="bg-[#cc1d39] hover:bg-[#b01832]"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import {
//   LogOut,
//   User,
//   LineChart,
// } from "lucide-react";
// import { useState } from "react";
// import { signOut } from "next-auth/react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// const navigation = [
//   { name: "My Profile", href: "/profile/my-profile", icon: User },
//   { name: "Progress", href: "/profile/progress", icon: LineChart },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);

//   const handleLogout = () => {
//     signOut({ callbackUrl: "/login" });
//     setOpen(false);
//   };

//   return (
//     <div className="flex h-screen w-64 flex-col bg-transparent border-r border-gray-200 fixed">
//       {/* Logo */}
//       <div className="flex  items-center py-5 justify-center px-6">
//         <Link href="/profile/my-profile" className="flex items-center ">
//           <Image
//             src="/images/logo.png"
//             alt="Company Logo"
//             width={80}
//             height={80}
//             className="cursor-pointer"
//             priority
//           />
//         </Link>
//       </div>

//       {/* Navigation */}
//       <nav className="space-y-4">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
//           const isProgress = item.name === "Progress";

//           let buttonClasses = "flex items-center gap-3 rounded-[0.5rem] px-5 py-3 text-sm font-semibold transition-all duration-200 ";

//           if (isActive && !isProgress) {
//             buttonClasses += "bg-primary text-white shadow-lg shadow-primary/20";
//           } else if (isProgress) {
//             buttonClasses += "bg-black border border-white/40 text-white hover:bg-white/5";
//           } else {
//             buttonClasses += "text-gray-400 hover:bg-white/5 hover:text-white";
//           }

//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={buttonClasses}
//             >
//               <item.icon className={cn("h-4 w-4", isActive && !isProgress ? "text-white" : "text-white/70")} />
//               {item.name}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout */}
//       <div className="">
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button
//               className="w-full justify-start gap-3 h-[46px] px-5 cursor-pointer rounded-[0.5rem] font-semibold bg-[#cc1d39] text-white hover:bg-[#b01832] transition-all duration-200"
//             >
//               <LogOut className="h-4 w-4" />
//               Logout
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="bg-zinc-900 border-white/10 text-white">
//             <DialogHeader>
//               <DialogTitle className="text-white">Confirm Logout</DialogTitle>
//               <DialogDescription className="text-gray-400">
//                 Are you sure you want to log out of your account?
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 className="bg-transparent border-white/20 text-white hover:bg-white/5"
//                 onClick={() => setOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 className="bg-[#cc1d39] hover:bg-[#b01832]"
//                 onClick={handleLogout}
//               >
//                 Log Out
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }



"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LogOut,
  User,
  Timer,
} from "lucide-react";
import { useState } from "react";
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
  { name: "My Profile", href: "/profile/my-profile", icon: User },
  { name: "Progress", href: "/profile/progress", icon: Timer },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isProgress = item.name === "Progress";

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[0.5rem] px-5 py-3 text-sm font-semibold transition-all duration-200 w-full",
                isActive && !isProgress
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : isProgress
                    ? "bg-black border border-white/20 text-white hover:bg-white/5"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive && !isProgress ? "text-white" : "text-white/70")} />
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
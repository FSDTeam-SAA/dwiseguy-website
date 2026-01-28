import type { Metadata } from "next";
import Sidebar from "@/components/dashboard/common/Sidebar";

export const metadata: Metadata = {
    title: "Bao Music",
    description:
        "Preparation Dedication Elevation",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-6 overflow-auto min-h-screen">
                {children}
            </main>
        </div>
    );
}
import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/website/Common/Navbar";
import Footer from "@/components/website/Common/Footer";

export const metadata: Metadata = {
  title: "Bao Music",
  description:
    "Preparation Dedication Elevation",
  icons: {
    icon: "/images/logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

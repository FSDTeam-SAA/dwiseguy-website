"use client";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { NewsletterSection } from "@/features/newsletter/components/NewsletterSection";

// Extract link data to reduce repetition and improve maintainability
const FOOTER_LINKS = {
  product: [
    { label: "Kids", href: "/kids" },
    { label: "Seniors", href: "/seniors" },
    { label: "Adults", href: "/adults" },
    { label: "Pets", href: "/pets" },
  ],
  resources: [
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
  ],
} as const;

// Extracted sub-components for better code splitting and reusability
const FooterLinkSection = memo(
  ({
    title,
    links,
  }: {
    title: string;
    links: readonly { label: string; href: string }[];
  }) => (
    <div className="md:col-span-2">
      <h3 className="text-white font-semibold mb-6">{title}</h3>
      <nav aria-label={`${title} links`}>
        <ul className="space-y-4">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-white hover:text-primary hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  ),
);

FooterLinkSection.displayName = "FooterLinkSection";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-[#3D3E40]  pt-16 pb-8 border-t border-gray-100"
      role="contentinfo"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Logo and Description */}
          <div className="md:col-span-3 lg:col-span-3">
            <Link
              href="/"
              className="inline-block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              <Image
                src="/images/footerlogo.png"
                alt="Company Logo"
                width={150}
                height={80}
                className="mb-8"
                priority={false}
                loading="lazy"
              />
            </Link>
            <p className="text-white text-lg leading-relaxed max-w-sm mt-0!">
              Your journey to piano starts here, no cost, no pressure. Making piano learning easy and accessible for everyone.
            </p>
          </div>
          <div className="md:col-span-3 lg:col-span-3">

            {/* Product Links */}
            {/* <FooterLinkSection title="Product" links={FOOTER_LINKS.product} /> */}
          </div>
          <div className="md:col-span-3 lg:col-span-3">

            {/* Resources Links */}
            <FooterLinkSection
              title="Quick Links"
              links={FOOTER_LINKS.resources}
            />
          </div>

          {/* Contact Us Section */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">example@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">1112223334455</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">example address</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Untitled UI. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);


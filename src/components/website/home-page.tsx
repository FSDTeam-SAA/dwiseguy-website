"use client";
import React from "react";
import Hero from "../../features/category-page/components/hero";
import { Features } from "@/features/category-page/components/features";
import { FAQ } from "./Common/faq";
import Funsection from "./PageSections/HomePage/Funsection";
import Doublebutton from "./PageSections/HomePage/Doublebutton";
import ReadyToStart from "./PageSections/HomePage/ReadyToStart";
import Howitworks from "./Common/Howitworks";
import FreeForEveryone from "./PageSections/HomePage/FreeForEveryone";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { status } = useSession();

  return (
    <>
      {/* the hero and funsection will appear always */}
      <Hero />
      <Funsection />

      {/* The double button section will appear when not logged in */}
      {status === "unauthenticated" && <Doublebutton />}

      {/* These sections will appear when logged in */}
      {status === "authenticated" && (
        <>
          <ReadyToStart />
          <Howitworks />
          <FreeForEveryone />
        </>
      )}
    </>
  );
}

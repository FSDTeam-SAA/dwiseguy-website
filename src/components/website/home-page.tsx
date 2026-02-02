"use client";
import React from "react";
import Hero from "../../features/category-page/components/hero";
import Funsection from "./PageSections/HomePage/Funsection";
import Doublebutton from "./PageSections/HomePage/Doublebutton";
import ReadyToStart from "./PageSections/HomePage/ReadyToStart";
import Howitworks from "./Common/Howitworks";
import FreeForEveryone from "./PageSections/HomePage/FreeForEveryone";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

export default function HomePage() {
  const { status } = useSession();

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col min-h-screen"
    >
      {/* active sections wrap */}
      <motion.div variants={sectionVariants}>
        <Hero />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Funsection />
      </motion.div>

      <AnimatePresence mode="wait">
        {/* The double button section will appear when not logged in */}
        {status === "unauthenticated" && (
          <motion.div
            key="unauthenticated-content"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Doublebutton />
          </motion.div>
        )}

        {/* These sections will appear when logged in */}
        {status === "authenticated" && (
          <motion.div
            key="authenticated-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col"
          >
            <motion.div variants={sectionVariants}>
              <ReadyToStart />
            </motion.div>
            <motion.div variants={sectionVariants}>
              <Howitworks />
            </motion.div>
            <motion.div variants={sectionVariants}>
              <FreeForEveryone />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

"use client";

import * as z from "zod";
import Image from "next/image";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { motion, Variants } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useContactMutation } from "../hooks/use-contact-mutation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type FormValues = z.infer<typeof formSchema>;

export const ContactForm = memo(() => {
  const { mutate, isPending } = useContactMutation();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  const imageVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 70, damping: 20, delay: 0.4 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 },
    },
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const payload = {
      fullName: values.fullName,
      email: values.email,
      subject: values.subject,
      message: values.message,
    };
    mutate(payload, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <div className="bg-transparent py-16 md:py-24">
      <motion.div
        className="container mx-auto px-4 max-w-4xl border-2 rounded-lg bg-black/65 border-white p-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left side: Form */}
          <motion.div className="order-2 lg:order-1" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-white">
              Get in touch With Bao Music
            </h2>
            <p className="text-white mb-10 text-lg">
              We are here to help you with any questions or concerns you may have.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <motion.div variants={itemVariants}>
                        <FormItem>
                          <FormLabel className="text-white font-medium">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Full Name"
                              {...field}
                              className="h-11 rounded-lg border-white text-white focus:ring-primary focus:border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </motion.div>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <motion.div variants={itemVariants}>
                      <FormItem>
                        <FormLabel className="text-white font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@company.com"
                            {...field}
                            className="h-11 rounded-lg border-white text-white focus:ring-orange-500 focus:border-orange-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </motion.div>
                  )}
                />

                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <motion.div variants={itemVariants}>
                      <FormItem>
                        <FormLabel className="text-white font-medium">
                          Subject
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Subject"
                            {...field}
                            className="h-11 rounded-lg border-white text-white focus:ring-orange-500 focus:border-orange-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </motion.div>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <motion.div variants={itemVariants}>
                      <FormItem>
                        <FormLabel className="text-white font-medium">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Leave us a message..."
                            {...field}
                            className="min-h-[128px] rounded-lg border-white text-white focus:ring-primary focus:border-primary resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </motion.div>
                  )}
                />

                {/* Submit */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary hover:bg-primary/50 text-white rounded-lg h-12 text-base font-semibold shadow-sm transition-all duration-200"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>

          {/* Right side: Image */}
          <motion.div
            className="order-1 lg:order-2 relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl"
            variants={imageVariants}
            whileHover="hover"
          >
            <Image
              src="/images/contact.png"
              alt="Contact us"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
});

ContactForm.displayName = "ContactForm";

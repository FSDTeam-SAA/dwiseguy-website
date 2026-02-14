"use client";

import React from "react";
import Image from "next/image";
import { Loader2, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetAllModules } from "../hooks/useGetAllModules";
import { Module as ModuleType } from "../types/module.types";
import Link from "next/link";

const Module = () => {
    const { id } = useParams();
    const { data: session } = useSession();
    const accessToken = session?.accessToken || "";

    const { data, isLoading, isError, error } = useGetAllModules(
        id as string,
        accessToken
    );

    const modules = data?.data || [];

    if (isLoading) {
        return (
            <div className="container mx-auto min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto min-h-screen flex flex-col items-center justify-center text-white">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-bold">Failed to load modules</p>
                <p className="text-gray-400">
                    {error instanceof Error ? error.message : "Something went wrong"}
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto min-h-screen text-white p-6 md:p-12">
            <div className="bg-black/40 p-6 sm:p-12 md:p-20 rounded-md">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl text-primary font-bold mb-4">Modules</h2>
                        <p className="text-lg font-semibold mb-4">
                            Step-by-step learning for your instrument.
                        </p>
                    </div>
                </div>

                {/* Module Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {modules.map((module: ModuleType) => (
                        <div key={module._id}>
                            <Link href={`/module/single/${module._id}`}>
                                <div className="flex flex-col cursor-pointer hover:scale-105 transition-transform duration-500 hover:border hover:border-primary hover:border-2 rounded-3xl p-2 bg-white/10 border-primary/50 space-y-4 group">
                                    {/* Image Container */}
                                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#2a2d3a] border border-white/5 shadow-2xl">
                                        <Image
                                            src={module?.images?.[0]?.url || "/images/piano.jpg"}
                                            alt={module?.title}
                                            fill
                                            className="object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="px-2 pb-4">
                                        <h3 className="text-xl font-bold mb-2 text-primary">
                                            {module?.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3">
                                            {module?.description}
                                        </p>
                                        <div className="mt-4 inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-white uppercase tracking-wider">
                                            Module {module?.order}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {modules.length === 0 && !isLoading && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl">No modules found for this instrument.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Module;
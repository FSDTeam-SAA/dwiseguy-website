"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Pencil, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useUpdatePersonalInfo, useGetUserProfile } from '@/features/account/hooks/usePersonalinfo';

const PersonalInfo = () => {
    const { data: session } = useSession();
    const { mutate, isPending: isUpdating } = useUpdatePersonalInfo();

    // Fetch real-time user data
    const { data: profileResponse, isLoading, error } = useGetUserProfile();
    const userData = profileResponse?.data;

    // State for local preview (only for newly selected files)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);

    // Determine what image to show: local preview > fetched data > session data > placeholder
    const imageToShow = localPreview || userData?.avatar?.url || session?.user?.image || "/images/profile-placeholder.jpg";

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setLocalPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session?.accessToken) return;

        const formData = new FormData(e.currentTarget);

        // Append image if selected (use set to avoid duplicates)
        if (selectedFile) {
            formData.set("image", selectedFile);
        }

        mutate({
            formData,
            accessToken: session.accessToken
        }, {
            onSuccess: () => {
                setSelectedFile(null);
                setLocalPreview(null);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-white text-center p-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Error Loading Profile</h3>
                <p className="text-gray-400 mb-6 font-medium">We couldn&apos;t fetch your profile details. Please try again later.</p>
                <Button onClick={() => globalThis.location.reload()} variant="outline" className="border-white text-white hover:bg-white/10">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full text-white">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Picture Section */}
                <div className="">
                    <p className="text-sm font-bold mb-4 text-white">Your Profile Picture</p>
                    <div className="relative w-32 h-32">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20 bg-zinc-900 shadow-2xl">
                            <Image
                                src={imageToShow}
                                alt="Profile"
                                fill
                                className="object-cover rounded-full"
                            />
                        </div>
                        <label
                            htmlFor="image-upload"
                            className="absolute bottom-2 right-2 bg-primary p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-all shadow-lg border-2 border-[#111]"
                        >
                            <Pencil className="w-4 h-4 text-white" />
                            <input
                                type="file"
                                id="image-upload"
                                name="image"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                </div>

                <div className="grid gap-8">
                    {/* Full Name */}
                    <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-bold text-white">Full name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={userData?.name || session?.user?.name || ""}
                            placeholder="Maira Adam"
                            className="bg-white text-black h-12 rounded-[0.5rem] border-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-bold text-white">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={userData?.email || session?.user?.email || ""}
                            placeholder="maria@untitledui.com"
                            className="bg-white text-black h-12 rounded-[0.5rem] border-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                            required
                        />
                    </div>

                    {/* Age */}
                    <div className="space-y-3">
                        <Label htmlFor="age" className="text-sm font-bold text-white">Age</Label>
                        <Input
                            id="age"
                            name="age"
                            type="number"
                            defaultValue={userData?.age || 0}
                            placeholder="18"
                            className="bg-white text-black h-12 rounded-[0.5rem] border-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-primary hover:bg-primary/90 text-white px-8 h-[44px] rounded-[0.5rem] font-bold min-w-[140px] text-base"
                    >
                        {isUpdating ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => globalThis.location.reload()}
                        className="bg-black border border-white text-white hover:bg-white/10 px-8 h-[44px] rounded-[0.5rem] font-bold min-w-[100px] text-base"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PersonalInfo;
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useChangePassword } from "@/features/account/hooks/useChangepasswordUser";
import { useSession } from "next-auth/react";

const ChangePassword = () => {
  const { data: session } = useSession();
  const { loading, handleChangePassword } = useChangePassword();

  // Separate states for each password field visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      toast.error("New password cannot be the same as old password.");
      return;
    }

    const res = await handleChangePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });

    if (res) {
      toast.success("Password updated successfully");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <div className="w-full max-w-full text-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8">
          {/* Current Password */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-white">
              Current Password
            </Label>
            <div className="relative">
              <Input
                type={showOldPassword ? "text" : "password"}
                placeholder="********"
                value={formData.oldPassword}
                onChange={(e) =>
                  setFormData({ ...formData, oldPassword: e.target.value })
                }
                required
                className="bg-white text-black h-12 rounded-[0.5rem] border-none focus-visible:ring-2 focus-visible:ring-primary font-medium pr-12"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                aria-label={showOldPassword ? "Hide password" : "Show password"}
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-white">
              New Password
            </Label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="********"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                required
                className="bg-white text-black h-12 rounded-[0.5rem] border-none focus-visible:ring-2 focus-visible:ring-primary font-medium pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-white">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                className="bg-white text-black h-12 rounded-[0.5rem] border-none focus-visible:ring-2 focus-visible:ring-primary font-medium pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons matches PersonalInfo */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-8 h-[44px] rounded-[0.5rem] font-bold min-w-[140px] text-base"
          >
            {loading ? (
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

export default ChangePassword;

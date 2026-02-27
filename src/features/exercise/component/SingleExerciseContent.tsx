"use client";

import React from "react";
import Image from "next/image";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useExerciseContentById } from "../hooks/useExerciseContentById";
import Piano from "@/components/website/Common/piano/piano";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const SingleExerciseContent = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    data: content,
    isLoading,
    isError,
    error,
  } = useExerciseContentById(id as string);

  if (isLoading) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="container mx-auto min-h-screen flex flex-col items-center justify-center text-white">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-xl font-bold">Failed to load practice content</p>
        <p className="text-gray-400">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen text-white p-6 md:p-12">
      <div className=" mx-auto bg-black/40 p-6 sm:p-12 rounded-xl backdrop-blur-md">
        {/* Header Section */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Back</span>
        </button>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {content.title}
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="space-y-10">
          {content.image && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5">
              <Image
                src={content.image.url}
                alt={content.title}
                fill
                className="object-contain bg-[#1a1c23]"
              />
            </div>
          )}

          {content.audio && (
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <audio
                controls
                src={content.audio.url}
                className="w-full filter invert hue-rotate-180 brightness-150"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {content.keyNotes && content.keyNotes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.keyNotes.map((note, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Piano Toggle/Interactive Section */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <h3 className="text-2xl font-bold text-primary mb-8 text-center">
            Interactive Piano Practice
          </h3>
          <div className="bg-white/5 rounded-3xl p-4 md:p-8 border border-white/10 min-h-[400px]">
            <Piano
              targetNotes={content.keyNotes}
              onSuccess={() => setIsSuccess(true)}
            />
          </div>
        </div>

        {/* Success Dialog */}
        <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
          <DialogContent className="sm:max-w-md bg-[#0F5F85] border-white/20 text-white">
            <DialogHeader className="flex flex-col items-center justify-center pt-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-center">
                Exercise Successful!
              </DialogTitle>
              <DialogDescription className="text-white/70 text-center text-lg mt-2">
                Great job! You&apos;ve matched all the required key notes for
                this exercise.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center pb-6">
              <Button
                onClick={() => setIsSuccess(false)}
                className="bg-white text-[#0F5F85] hover:bg-white/90 font-bold px-8 py-6 rounded-xl text-lg transition-transform active:scale-95"
              >
                Continue Practice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SingleExerciseContent;

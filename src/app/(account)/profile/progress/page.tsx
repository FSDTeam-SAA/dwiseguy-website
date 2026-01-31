"use client"
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import { useRouter } from 'next/navigation'
import Leaderboard from '@/features/progress/component/Leaderboard'
import ExcerciseTrack from '@/features/progress/component/ExcerciseTrack'
import QuizeTrack from '@/features/progress/component/QuizeTrack'
import ProgressCard from '@/features/progress/component/ProgressCard'
import { BookOpen, BookText, FileQuestion } from 'lucide-react'

const Page = () => {
    const router = useRouter()

    return (
        <div className="flex flex-col min-h-screen text-white">
            {/* Page Header */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-4xl font-black tracking-tight">My Profile</h1>
                    <Button
                        className="cursor-pointer bg-transparent border border-white text-white hover:bg-white/10 font-bold px-6 h-10 rounded-lg"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Back
                    </Button>
                </div>
                <p className="text-gray-300 text-lg font-medium">Manage your account</p>
            </div>

            {/* Progress Overview Cards */}
            <div className="flex flex-wrap gap-6 mb-12">
                <ProgressCard
                    title="Lesson Completed"
                    value="85%"
                    icon={BookOpen}
                    bgColor="bg-[#E5E7FF]"
                    iconBgColor="bg-[#8B93FF]"
                    percentageColor="text-[#8B93FF]"
                />
                <ProgressCard
                    title="Exercises Completed"
                    value="80%"
                    icon={BookText}
                    bgColor="bg-[#2D114B]"
                    iconBgColor="bg-[#C644F2]"
                    percentageColor="text-[#C644F2]"
                />
                <ProgressCard
                    title="Quizzes Completed"
                    value="90%"
                    icon={FileQuestion}
                    bgColor="bg-[#FFE9E5]"
                    iconBgColor="bg-[#FF8A7A]"
                    percentageColor="text-[#FF8A7A]"
                />
            </div>

            <Tabs defaultValue="Leaderboard" className="w-full">
                <TabsList className="bg-transparent w-full justify-start h-auto p-0 mb-10 rounded-none gap-4">
                    <TabsTrigger
                        value="Leaderboard"
                        className="rounded-[0.5rem] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 text-gray-400 hover:text-white text-lg font-bold py-3 px-8 transition-all cursor-pointer"
                    >
                        Leaderboard
                    </TabsTrigger>
                    <TabsTrigger
                        value="ExcerciseTrack"
                        className="rounded-[0.5rem] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 text-gray-400 hover:text-white text-lg font-bold py-3 px-8 transition-all cursor-pointer"
                    >
                        Excercise Track
                    </TabsTrigger>
                    <TabsTrigger
                        value="QuizeTrack"
                        className="rounded-[0.5rem] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 text-gray-400 hover:text-white text-lg font-bold py-3 px-8 transition-all cursor-pointer"
                    >
                        Quize Track
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="Leaderboard" className="mt-0">
                    <Leaderboard />
                </TabsContent>

                <TabsContent value="ExcerciseTrack" className="mt-0">
                    <ExcerciseTrack />
                </TabsContent>
                <TabsContent value="QuizeTrack" className="mt-0">
                    <QuizeTrack />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Page
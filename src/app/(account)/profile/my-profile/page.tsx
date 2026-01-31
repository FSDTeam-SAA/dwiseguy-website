"use client"
import ChangePassword from '@/components/account/pages/ChangePassword'
import PersonalInfo from '@/components/account/pages/PersonalInfo'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'

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

            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="bg-transparent w-full justify-start h-auto p-0 mb-10 rounded-none gap-4">
                    <TabsTrigger
                        value="personal"
                        className="rounded-[0.5rem] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 text-gray-400 hover:text-white text-lg font-bold py-3 px-8 transition-all cursor-pointer"
                    >
                        Personal Information
                    </TabsTrigger>
                    <TabsTrigger
                        value="change-password"
                        className="rounded-[0.5rem] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 text-gray-400 hover:text-white text-lg font-bold py-3 px-8 transition-all cursor-pointer"
                    >
                        Changes Password
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-0">
                    <PersonalInfo />
                </TabsContent>

                <TabsContent value="change-password" className="mt-0">
                    <ChangePassword />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Page

import SingleLesson from '@/features/lesson/component/SingleLesson'
import React from 'react'

const page = () => {
    return (
        <div className="min-h-screen w-full bg-[url('/images/login.jpg')] bg-cover bg-center bg-fixed pt-24">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            <div className="relative z-10">
                <SingleLesson />
            </div>
        </div>
    )
}

export default page
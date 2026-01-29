import Image from 'next/image'
import React from 'react'

const Introduction = () => {
    return (
        <main className="bg-black text-white">
            {/* HERO SECTION */}
            <section className="relative min-h-[60vh] flex flex-col justify-center overflow-hidden">

                {/* 1. Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/introduction.png" // Replace with your actual path
                        alt="Academy Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* 2. Dark Gradient Overlay (Crucial for text readability) */}
                    <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* 3. Content Layer */}
                <div className="container mx-auto text-center relative z-10 pt-20 pb-10 px-6">
                    {/* Large Background Decorative Text */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 select-none -z-10 pointer-events-none">
                        <h1 className="text-[12vw] font-black leading-none text-white uppercase tracking-tighter">
                            Bailey Academy
                        </h1>
                    </div>

                    {/* Main Title Overlay */}
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight py-12 drop-shadow-2xl">
                        Introduction to The Bailey Academy of Music
                    </h2>
                </div>

                {/* 4. Triple Pillar Bar */}
                <div className="relative z-10 bg-black/40 backdrop-blur-md border-y border-white/10 mt-auto">
                    <div className="container mx-auto py-6">
                        <div className="flex justify-between items-center text-gray-300 font-bold tracking-[0.2em] text-xs md:text-xl px-4 lg:px-20 uppercase">
                            <span>Preparation.</span>
                            <span>Dedication.</span>
                            <span>Elevation.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CONTENT SECTION */}
            <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto">
                <div className="space-y-8 text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg">
                    <p>
                        The Bailey Academy of Music is a national music education and participation initiative established by The United House of Prayer For All People, under the leadership of The Honorable Bishop A. D. Cunningham. The academy honors the life and legacy of the late Bishop C. M. &quot;Sweet Daddy&quot; Bailey (2008–2023), whose leadership helped preserve and elevate one of the most dynamic sacred music traditions in American history.
                    </p>

                    <p>
                        For more than a century, the United House of Prayer has been known for its powerful, spirit-filled worship music—especially its iconic shout bands, featuring vibrant brass and percussion instruments such as trombones, trumpets, and drums. These bands have been central to worship services, national convocations, parades, and community outreach, expressing praise through sound, movement, and joy.
                    </p>

                    <p>
                        The Bailey Academy of Music was created to preserve, teach, and expand this rich musical heritage by providing structured, hands-on learning opportunities for musicians of all ages and skill levels. Through formal instruction and active participation, the academy ensures that the shout band tradition continues to grow, inspire, and unite future generations.
                    </p>

                    <div>
                        <p className="mb-4 text-white font-medium">Participants are invited to engage with the academy in a variety of roles:</p>
                        <ul className="list-none space-y-2 pl-2">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Students learn instruments, technique, and the distinctive shout band style</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Instructors mentor and train developing musicians</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Composers create new sacred music rooted in tradition</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Administrators help organize and sustain academy programs</span>
                            </li>
                        </ul>
                    </div>

                    <p className="pt-6 border-t border-white/10 italic text-gray-400">
                        Whether you are just beginning your musical journey or bringing years of experience, The Bailey Academy of Music offers a place to learn, serve, and celebrate through music—continuing a legacy of praise that has shaped worship and community life for generations.
                    </p>
                </div>
            </section>
        </main>
    )
}

export default Introduction
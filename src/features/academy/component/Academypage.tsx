import React from 'react';
import Image from 'next/image';
import { Lock, Loader2 } from 'lucide-react'; // Using lucide for icons
import { Button } from "@/components/ui/button";

const instrumentData = [
    { id: 1, name: "Piano", desc: "Play the virtual piano and visualize notes, chords and scales.", status: "active", image: "/images/piano.jpg" },
    { id: 2, name: "Drums", desc: "Play the virtual drums and playing drum beats.", status: "upcoming", image: "/images/drums.jpg" },
    // { id: 3, name: "Bass Guitar", desc: "Play the virtual bass guitar and visualize notes and scales.", status: "locked", image: "/images/bass.png" },
    // { id: 4, name: "Ukulele", desc: "Play the virtual ukulele and visualize notes, chords and scales.", status: "locked", image: "/images/ukulele.png" },
    // { id: 5, name: "Guitar", desc: "Play the virtual guitar and visualize notes, chords and scales.", status: "locked", image: "/images/guitar.png" },
    // { id: 6, name: "Drums machine", desc: "Create and listen to your own drum beats, Drums machine.", status: "locked", image: "/images/drum-machine.png" },
    // { id: 7, name: "Glockenspiel", desc: "Play the virtual Glockenspiel and visualize notes, scales.", status: "locked", image: "/images/glockenspiel.png" },
    // { id: 8, name: "Xylophone", desc: "Play the virtual Xylophone and visualize notes, scales.", status: "locked", image: "/images/xylophone.png" },
];

const Academypage = () => {
    return (
        <div className="container mx-auto  min-h-screen text-white p-6 md:p-12">

            <div className="bg-black/40 p-6 sm:p-12 md:p-20 rounded-md">

                {/* Header / Band Stand Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                    <div className="">
                        <h2 className="text-4xl text-primary font-bold mb-4">Academy</h2>
                        <p className="text-lg font-semibold mb-4">Explore the world of music with our virtual instruments.</p>
                    </div>
                    <Button className="bg-[#7059bc] hover:bg-[#5e4aa3] text-white px-10 py-6 rounded-lg font-bold text-lg shadow-lg w-full sm:w-auto">
                        Band Stand
                    </Button>
                </div>

                {/* Instrument Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {instrumentData.map((item) => (
                        <div key={item.id} className="flex flex-col space-y-4 group">

                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#2a2d3a] border border-white/5 shadow-2xl">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className={`object-cover transition-transform duration-500 group-hover:scale-110 ${item.status === 'active' ? '' : 'opacity-40 grayscale-[0.5]'}`}
                                />

                                {/* Overlay for Upcoming/Locked */}
                                {item.status !== 'active' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                        {item.status === 'upcoming' ? (
                                            <>
                                                <span className="text-[#8b76d1] font-bold text-2xl mb-2">Upcoming</span>
                                                <Loader2 className="text-white animate-spin w-10 h-10" />
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-[#8b76d1] font-bold text-2xl mb-2">Locked</span>
                                                <div className="bg-yellow-500 p-3 rounded-xl">
                                                    <Lock className="text-black fill-current w-8 h-8" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="px-2">
                                <h3 className={`text-xl font-bold mb-2 ${item.status === 'active' ? 'text-primary' : 'text-white'}`}>
                                    {item.name}
                                </h3>
                                <p className="text-white text-sm md:text-base leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Academypage;
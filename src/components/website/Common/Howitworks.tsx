import React from "react";
import { Award, Music, Video } from "lucide-react";
import WhyLearn from "./WhyLearn";

const Howitworks = () => {
    return (
        <section className="bg-white py-16 md:py-24 px-6 lg:px-12">
            <div className="container mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight pb-2">
                        Why choose this platform
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    <WhyLearn
                        title="Interactive Lessons"
                        description="Watch video demonstrations and read clear explanations of piano concepts"
                        icon={<Video size={24} color="white" />}
                    />
                    <WhyLearn
                        title="Virtual Practice"
                        description="Practice directly in your browser with our responsive virtual piano keyboard."
                        icon={<Music size={24} color="white" />}
                    />
                    <WhyLearn
                        title="Certificate"
                        description="Take quizzes after each lesson to validate your understanding and unlock new content. Then get professional Cirtificate"
                        icon={<Award size={24} color="white" />}
                    />
                </div>
            </div>
        </section>
    );
};

export default Howitworks;

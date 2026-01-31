import React from 'react'
import { Lightbulb } from 'lucide-react'

const QuizeTrack = () => {
    return (
        <div className='bg-white/5 border border-white/10 rounded-[1rem] p-8 flex flex-col items-center justify-center min-h-[300px] text-center'>
            <Lightbulb className="w-12 h-12 text-[#FF8A7A] mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2 text-white">Quiz Track</h2>
            <p className="text-gray-400">Track your quiz performance and see where you excel.</p>
        </div>
    )
}

export default QuizeTrack
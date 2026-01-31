import React from 'react'
import { Activity } from 'lucide-react'

const ExcerciseTrack = () => {
    return (
        <div className='bg-white/5 border border-white/10 rounded-[1rem] p-8 flex flex-col items-center justify-center min-h-[300px] text-center'>
            <Activity className="w-12 h-12 text-[#C644F2] mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2 text-white">Exercise Track</h2>
            <p className="text-gray-400">Your exercise history and detailed statistics will appear here.</p>
        </div>
    )
}

export default ExcerciseTrack
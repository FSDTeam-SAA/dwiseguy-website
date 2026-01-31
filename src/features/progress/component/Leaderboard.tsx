import React from 'react'
import { Trophy } from 'lucide-react'

const Leaderboard = () => {
    return (
        <div className='bg-white/5 border border-white/10 rounded-[1rem] p-8 flex flex-col items-center justify-center min-h-[300px] text-center'>
            <Trophy className="w-12 h-12 text-primary mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2 text-white">Leaderboard</h2>
            <p className="text-gray-400">Coming soon! Compete with others and climb the ranks.</p>
        </div>
    )
}

export default Leaderboard
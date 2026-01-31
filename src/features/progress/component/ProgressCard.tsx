import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    bgColor: string;
    iconBgColor: string;
    percentageColor: string;
    className?: string;
}

const ProgressCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    iconBgColor,
    percentageColor,
    className
}: ProgressCardProps) => {
    return (
        <div
            className={cn(
                "flex flex-col p-6 rounded-[1rem] min-w-[280px] flex-1 transition-all duration-300 hover:scale-[1.02]",
                bgColor,
                className
            )}
        >
            <div className="flex items-center gap-4 mb-8">
                <div className={cn("p-4 rounded-full flex items-center justify-center", iconBgColor)}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-400 text-lg font-medium whitespace-nowrap">{title}</h3>
            </div>
            <div className={cn("text-5xl font-black text-center mt-auto", percentageColor)}>
                {value}
            </div>
        </div>
    );
};

export default ProgressCard;

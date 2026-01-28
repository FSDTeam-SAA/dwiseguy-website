import React from "react";

interface WhyLearnProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WhyLearn: React.FC<WhyLearnProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white">
      {/* Icon */}
      <div className="w-16 h-16 bg-primary/90 rounded-xl flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default WhyLearn;

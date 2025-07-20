import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
        <span className="text-white font-bold text-lg">Y</span>
      </div>
      <span className="text-white text-xl ml-2 font-semibold">YaaraLabs</span>
    </div>
  );
};

export { Logo };
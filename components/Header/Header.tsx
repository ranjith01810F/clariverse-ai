import Link from 'next/link';
import React from 'react';

interface HeaderProps {
  className?: string;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  className = "",
  transparent = true
}) => {
  return (
    <nav className={`fixed top-0 w-full z-50 px-6 py-4 ${transparent ? 'bg-transparent backdrop-blur-sm' : 'bg-gray-900'
      } ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Y</span>
          </div>
          <span className="text-white text-xl ml-2 font-semibold">YaaraLabs</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#solutions" className="text-white hover:text-pink-400 transition-colors">
            Solutions
          </a>
          <a href="#expertise" className="text-white hover:text-pink-400 transition-colors">
            Our Expertise
          </a>
          <a href="#contact" className="text-white hover:text-pink-400 transition-colors ">
            Contact Us
          </a>
          <Link href="/login">
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium">
              Login
            </button>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export { Header };
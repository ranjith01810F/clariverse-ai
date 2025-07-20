'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
          <span className="text-white text-lg font-semibold">U</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-700">
                <p className="text-sm font-medium text-white">Demo User</p>
                <p className="text-xs text-gray-400">user@demo.com</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile; 
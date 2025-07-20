"use client";

import React, { useState } from 'react';
import { Header } from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';

const ChatHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <Header 
        transparent={true} 
        isLoggedIn={true}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30" onClick={closeSidebar} />
      )}

      {/* Background */}
      <div 
        className="fixed inset-0 z-0" 
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a1a 100%)' }} 
      />
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(185, 10, 189, 0.3) 0%, rgba(83, 50, 255, 0.3) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Main Content */}
      <div className={`relative z-20 pt-[72px] transition-all duration-300 ${isSidebarOpen ? 'filter blur-sm' : ''}`}>
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Chat Dashboard
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Interactively analyze chat data with advanced visualizations and topic modeling insights.
              </p>
            </div>
            {/* Placeholder for chat dashboard content */}
            <div className="bg-gray-800 rounded-lg p-8 shadow-lg text-center text-gray-400 italic">
              [Chat dashboard content will appear here]
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatHomePage;

"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';

const AlertTicketTopicAnalysis = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40" onClick={closeSidebar} />
      )}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-2 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg text-white hover:bg-gray-700 transition-colors duration-200"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
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
      <div className={`relative z-20 transition-all duration-300 ${isSidebarOpen ? 'filter blur-sm' : ''}`}>
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Alert Ticket Topic Analysis</h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore and filter alert ticket topics and subtopics to gain actionable insights.
              </p>
            </div>
            {/* Placeholder for alert ticket topic analysis content */}
            <div className="bg-gray-800 rounded-lg p-8 shadow-lg text-center text-gray-400 italic">
              [Alert ticket topic analysis content will appear here]
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AlertTicketTopicAnalysis;

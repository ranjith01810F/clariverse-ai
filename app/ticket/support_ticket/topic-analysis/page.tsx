"use client";

import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';

const TopicAnalysis: React.FC = () => {
  const [selectedDominantTopics, setSelectedDominantTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [dominantDropdownOpen, setDominantDropdownOpen] = useState(false);
  const [subtopicDropdownOpen, setSubtopicDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock data for UI placeholder
  const dominantTopics = [
    { id: '1', display_name: 'Customer Support' },
    { id: '2', display_name: 'Billing Issues' },
    { id: '3', display_name: 'Technical Problems' },
    { id: '4', display_name: 'Product Inquiries' },
    { id: '5', display_name: 'Service Requests' },
  ];

  const subtopics = [
    { id: '1-1', display_name: 'Account Access', dominant_id: '1' },
    { id: '1-2', display_name: 'Response Time', dominant_id: '1' },
    { id: '1-3', display_name: 'Service Quality', dominant_id: '1' },
    { id: '2-1', display_name: 'Payment Disputes', dominant_id: '2' },
    { id: '2-2', display_name: 'Refund Requests', dominant_id: '2' },
    { id: '3-1', display_name: 'Software Bugs', dominant_id: '3' },
    { id: '3-2', display_name: 'Performance Issues', dominant_id: '3' },
    { id: '4-1', display_name: 'Feature Requests', dominant_id: '4' },
    { id: '5-1', display_name: 'Installation Help', dominant_id: '5' },
  ];

  const availableSubtopics = subtopics.filter((subtopic) =>
    selectedDominantTopics.includes(subtopic.dominant_id)
  );

  const handleDominantTopicToggle = (topicId: string) => {
    setSelectedDominantTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSubtopicToggle = (subtopicId: string) => {
    setSelectedSubtopics(prev => 
      prev.includes(subtopicId) 
        ? prev.filter(id => id !== subtopicId)
        : [...prev, subtopicId]
    );
  };

  // Sidebar toggle logic
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
        {/* Analysis Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Topic Analysis Dashboard
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Explore and filter support tickets by topics and subtopics to gain actionable insights
              </p>
            </div>
            {/* Enhanced Filter Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                Select Dominant Topics
              </h3>
              <div className="relative">
                <button
                  onClick={() => setDominantDropdownOpen(!dominantDropdownOpen)}
                  className="w-full bg-gray-800 text-white rounded-lg p-4 border border-gray-700 focus:border-pink-400 focus:outline-none flex items-center justify-between hover:bg-gray-750 transition-colors"
                >
                  <span className="text-left">
                    {selectedDominantTopics.length > 0 
                      ? `${selectedDominantTopics.length} topic${selectedDominantTopics.length > 1 ? 's' : ''} selected`
                      : 'Choose dominant topics...'
                    }
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${dominantDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dominantDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {dominantTopics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => handleDominantTopicToggle(topic.id)}
                        className={`p-3 cursor-pointer hover:bg-gray-700 transition-colors flex items-center justify-between ${
                          selectedDominantTopics.includes(topic.id) ? 'bg-pink-600 bg-opacity-20' : ''
                        }`}
                      >
                        <span className="text-gray-200">{topic.display_name}</span>
                        {selectedDominantTopics.includes(topic.id) && (
                          <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Subtopics Dropdown */}
              <div className="relative mt-8">
                <label className="text-gray-200 font-semibold mb-2 block">
                  Select Subtopics
                </label>
                <div className="relative">
                  <button
                    onClick={() => setSubtopicDropdownOpen(!subtopicDropdownOpen)}
                    disabled={availableSubtopics.length === 0}
                    className="w-full bg-gray-800 text-white rounded-lg p-4 border border-gray-700 focus:border-pink-400 focus:outline-none flex items-center justify-between hover:bg-gray-750 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-left">
                      {selectedSubtopics.length > 0 
                        ? `${selectedSubtopics.length} subtopic${selectedSubtopics.length > 1 ? 's' : ''} selected`
                        : availableSubtopics.length === 0 
                          ? 'Select dominant topics first...'
                          : 'Choose subtopics...'
                      }
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${subtopicDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {subtopicDropdownOpen && availableSubtopics.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {availableSubtopics.map((subtopic) => (
                        <div
                          key={subtopic.id}
                          onClick={() => handleSubtopicToggle(subtopic.id)}
                          className={`p-3 cursor-pointer hover:bg-gray-700 transition-colors flex items-center justify-between ${
                            selectedSubtopics.includes(subtopic.id) ? 'bg-purple-600 bg-opacity-20' : ''
                          }`}
                        >
                          <span className="text-gray-200">{subtopic.display_name}</span>
                          {selectedSubtopics.includes(subtopic.id) && (
                            <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Selected Filters Display */}
              {(selectedDominantTopics.length > 0 || selectedSubtopics.length > 0) && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h4 className="text-white font-semibold mb-3">Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDominantTopics.map((topicId) => {
                      const topic = dominantTopics.find(t => t.id === topicId);
                      return (
                        <span
                          key={topicId}
                          className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {topic?.display_name}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => handleDominantTopicToggle(topicId)}
                          />
                        </span>
                      );
                    })}
                    {selectedSubtopics.map((subtopicId) => {
                      const subtopic = subtopics.find(s => s.id === subtopicId);
                      return (
                        <span
                          key={subtopicId}
                          className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {subtopic?.display_name}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => handleSubtopicToggle(subtopicId)}
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TopicAnalysis;
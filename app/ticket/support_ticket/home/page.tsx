"use client"

import React, { useState, useEffect, useRef } from 'react';
import { BarChart, PieChart, Cloud, ChevronDown, ChevronUp, Search, Filter, TrendingUp, Users, FileText, Clock, Target, Layers } from 'lucide-react';
import { Header } from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';

interface Subtopic {
  name: string;
  frequency: number;
}

interface Topic {
  name: string;
  frequency: number;
  id: string;
  subtopics: Subtopic[];
}

const SupportHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedViz, setSelectedViz] = useState('WordCloud');
  const [expandedStats, setExpandedStats] = useState(true);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [dataSource, setDataSource] = useState<Topic[]>([]);
  const [expandedRows, setExpandedRows] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    // Enhanced mock data matching Streamlit functionality
    const initialData: Topic[] = [
      {
        name: "Customer Support",
        frequency: 1200,
        id: "1",
        subtopics: [
          { name: "Login Issues", frequency: 300 },
          { name: "Account Recovery", frequency: 200 },
          { name: "Password Reset", frequency: 150 },
          { name: "Email Verification", frequency: 120 },
          { name: "Two-Factor Authentication", frequency: 80 },
        ]
      },
      {
        name: "Technical Issues",
        frequency: 850,
        id: "2",
        subtopics: [
          { name: "Bug Reports", frequency: 250 },
          { name: "System Crashes", frequency: 180 },
          { name: "Performance Issues", frequency: 150 },
          { name: "API Errors", frequency: 120 },
          { name: "Browser Compatibility", frequency: 90 },
        ]
      },
      {
        name: "Billing Queries",
        frequency: 600,
        id: "3",
        subtopics: [
          { name: "Payment Processing", frequency: 200 },
          { name: "Refund Requests", frequency: 180 },
          { name: "Subscription Changes", frequency: 120 },
          { name: "Invoice Issues", frequency: 100 },
        ]
      },
      {
        name: "Product Feedback",
        frequency: 400,
        id: "4",
        subtopics: [
          { name: "Feature Requests", frequency: 150 },
          { name: "User Experience", frequency: 120 },
          { name: "Design Suggestions", frequency: 80 },
          { name: "Performance Feedback", frequency: 50 },
        ]
      },
      {
        name: "Integration Support",
        frequency: 320,
        id: "5",
        subtopics: [
          { name: "API Integration", frequency: 120 },
          { name: "Webhook Issues", frequency: 80 },
          { name: "Third-party Tools", frequency: 70 },
          { name: "Database Connections", frequency: 50 },
        ]
      },
    ];
    setDataSource(initialData);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get all searchable topics
  const getAllSearchItems = () => {
    return dataSource.map(topic => ({
      name: topic.name
    }));
  };

  // Filter search items based on search term
  const getFilteredSearchItems = () => {
    const items = getAllSearchItems();
    if (!searchTerm) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle search item selection
  const handleSearchItemSelect = (topicName: string) => {
    setSearchTerm(topicName);
    setIsSearchFocused(false);
  };

  const statsData = [
    { metric: "Data Size", value: "10,000", icon: <FileText className="w-5 h-5" />, color: "from-blue-500 to-blue-600" },
    { metric: "Total Documents with Keyphrases", value: "8,500", icon: <Target className="w-5 h-5" />, color: "from-green-500 to-green-600" },
    { metric: "Keyphrases After Filtering", value: "6,200", icon: <Filter className="w-5 h-5" />, color: "from-purple-500 to-purple-600" },
    { metric: "Unique Keyphrases", value: "1,200", icon: <Layers className="w-5 h-5" />, color: "from-yellow-500 to-yellow-600" },
    { metric: "Last Run Date", value: "2025-07-15", icon: <Clock className="w-5 h-5" />, color: "from-red-500 to-red-600" },
    { metric: "Dominant Topics", value: "50", icon: <TrendingUp className="w-5 h-5" />, color: "from-indigo-500 to-indigo-600" },
    { metric: "Subtopics", value: "250", icon: <Users className="w-5 h-5" />, color: "from-pink-500 to-pink-600" },
  ];

  const vizOptions = [
    { value: 'WordCloud', label: 'WordCloud', icon: <Cloud className="w-5 h-5" /> },
    { value: 'CircularBarPlot', label: 'Circular Bar Plot', icon: <PieChart className="w-5 h-5" /> },
    { value: 'BarPlot', label: 'Bar Plot', icon: <BarChart className="w-5 h-5" /> },
  ];

  const handleVizChange = (viz: string) => setSelectedViz(viz);
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const SubtopicPill = ({ subtopic, onClick }: { subtopic: Subtopic; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm px-3 py-1 rounded-full transition-all duration-300 transform hover:scale-105 mr-2 mb-2"
    >
      {subtopic.name} ({subtopic.frequency})
    </button>
  );

  const VisualizationPlaceholder = ({ type }: { type: string }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-12 mb-8 border border-gray-700">
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-purple-400">
            {vizOptions.find(opt => opt.value === type)?.icon}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{type} Visualization</h3>
          <p className="text-gray-400">Interactive {type} of dominant topics</p>
          <div className="mt-4 text-sm text-gray-500">
            Placeholder for {type} - Connect your data source to see real visualizations
          </div>
        </div>
      </div>
    </div>
  );

  // Filter and sort topics
  const filteredTopics = dataSource
    .filter(topic => {
      if (searchTerm === '') return true;
      
      // Search in topic name
      const matchesTopicName = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Search in subtopics
      const matchesSubtopics = topic.subtopics.some(subtopic => 
        subtopic.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return matchesTopicName || matchesSubtopics;
    })
    .sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.frequency - a.frequency;
      }
      return a.frequency - b.frequency;
    });

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
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Background */}
      <div 
        className="fixed inset-0 z-0" 
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a1a 100%)' }} 
      />
      
      {/* Gradient Overlay */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(185, 10, 189, 0.3) 0%, rgba(83, 50, 255, 0.3) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Main Content */}
      <div className={`relative z-20 pt-[72px] transition-all duration-300 ${isSidebarOpen ? 'filter blur-sm' : ''}`}>
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Support Tickets Dashboard
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Interactively analyze support ticket data with advanced visualizations and topic modeling insights.
              </p>
            </div>

            {/* Basic Statistics Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Basic Statistics
                </h2>
                <button
                  onClick={() => setExpandedStats(!expandedStats)}
                  className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors duration-300"
                >
                  {expandedStats ? (
                    <>
                      <ChevronUp className="w-6 h-6" />
                      <span className="font-medium">Collapse</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-6 h-6" />
                      <span className="font-medium">Expand</span>
                    </>
                  )}
                </button>
              </div>
              
              {expandedStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {statsData.map((stat, statIndex) => (
                    <div 
                      key={statIndex} 
                      className="relative group overflow-hidden bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${stat.color}`} />
                      
                      <div className="relative z-10">
                        {/* Icon and Value */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                            <div className="text-white">
                              {stat.icon}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                              {stat.value}
                            </div>
                          </div>
                        </div>
                        
                        {/* Metric Name */}
                        <h3 className="text-sm font-medium text-gray-300">
                          {stat.metric}
                        </h3>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 border border-purple-500/0 group-hover:border-purple-500/50 rounded-xl transition-all duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visualization Section */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <h2 className="text-3xl font-bold text-white">Dominant Topics</h2>
                <div className="flex flex-wrap gap-3">
                  {vizOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleVizChange(option.value)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        selectedViz === option.value 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                          : 'bg-gray-700 bg-opacity-50 text-gray-200 hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visualization Content */}
              <VisualizationPlaceholder type={selectedViz} />

              {/* Topics Table Section */}
              <div className="bg-gray-900 bg-opacity-70 rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Dominant Topics and Subtopics Overview</h3>
                
                {/* Controls */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div ref={searchRef} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search topics or subtopics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                      
                      {/* Search Dropdown */}
                      {isSearchFocused && (
                        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                          {getFilteredSearchItems().length > 0 ? (
                            getFilteredSearchItems().map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                onClick={() => handleSearchItemSelect(item.name)}
                                className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-200 group"
                              >
                                <span className="text-white group-hover:text-purple-400 transition-colors duration-200">
                                  {item.name}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-400">
                              No matches found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-800 rounded-t-lg border-b border-gray-700">
                  <div className="col-span-3 font-semibold text-gray-200">Dominant Topic</div>
                  <div className="col-span-6 font-semibold text-gray-200">Subtopics</div>
                  <div 
                    className="col-span-2 font-semibold text-gray-200 cursor-pointer group flex items-center justify-start gap-2 hover:text-purple-400 transition-colors duration-300"
                    onClick={toggleSortOrder}
                  >
                    Frequency
                    <span className="text-gray-400 group-hover:text-purple-400">
                      {sortOrder === 'desc' ? '↓' : '↑'}
                    </span>
                  </div>
                  <div className="col-span-1 font-semibold text-gray-200 text-center">Show</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-700">
                  {filteredTopics.map((topic) => (
                    <div key={topic.id}>
                      {/* Main Row */}
                      <div className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-200">
                        <div className="col-span-3 text-gray-300 font-medium">
                          {topic.name}
                        </div>
                        
                        <div className="col-span-6">
                          <div className="flex flex-wrap gap-2">
                            {topic.subtopics.slice(0, 5).map((subtopic, subtopicIdx) => (
                              <SubtopicPill 
                                key={subtopicIdx} 
                                subtopic={subtopic} 
                                onClick={() => {
                                  // Handle subtopic click - for now just a placeholder
                                  console.log(`Clicked subtopic: ${subtopic.name}`);
                                }}
                              />
                            ))}
                            {topic.subtopics.length > 5 && (
                              <span className="text-gray-500 text-sm italic self-center">
                                + {topic.subtopics.length - 5} more subtopics
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="col-span-2 text-gray-300 font-semibold">
                          {topic.frequency}
                        </div>
                        
                        <div className="col-span-1 text-center">
                          <button
                            onClick={() => toggleRowExpansion(topic.id)}
                            className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-110"
                          >
                            {expandedRows[topic.id] ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Row Content */}
                      {expandedRows[topic.id] && (
                        <div className="bg-gray-800 bg-opacity-30 p-6 border-l-4 border-purple-500">
                          <div className="mb-6">
                            <h4 className="text-xl font-bold text-white mb-4">
                              Subtopics Analysis for {topic.name}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div className="bg-gray-700 rounded-lg p-4">
                                <div className="text-gray-400 text-sm">Total Frequency</div>
                                <div className="text-white text-2xl font-bold">{topic.frequency}</div>
                              </div>
                              <div className="bg-gray-700 rounded-lg p-4">
                                <div className="text-gray-400 text-sm">Total Subtopics</div>
                                <div className="text-white text-2xl font-bold">{topic.subtopics.length}</div>
                              </div>
                            </div>
                          </div>

                          {/* Subtopics Visualization Selection */}
                          <div className="mb-6">
                            <h5 className="text-lg font-semibold text-gray-200 mb-4">
                              Choose visualization type for {topic.name} subtopics:
                            </h5>
                            <div className="flex gap-3 mb-4">
                              {vizOptions.map((option) => (
                                <button
                                  key={`${topic.id}-${option.value}`}
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-purple-600 text-gray-200 rounded-lg transition-all duration-300"
                                  onClick={() => {
                                    // Handle visualization selection - for now just a placeholder
                                    console.log(`Selected ${option.value} for ${topic.name}`);
                                  }}
                                >
                                  {option.icon}
                                  {option.label}
                                </button>
                              ))}
                            </div>
                            <VisualizationPlaceholder type="WordCloud" />
                          </div>

                          {/* Subtopics Detailed Table */}
                          <div className="overflow-x-auto">
                            <div className="bg-gray-900 rounded-lg">
                              <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-gray-800 rounded-t-lg border-b border-gray-700">
                                <div className="font-semibold text-gray-200 text-center">Subtopic Name</div>
                                <div className="font-semibold text-gray-200 text-center">Frequency</div>
                              </div>
                              {topic.subtopics.map((subtopic, subtopicDetailIdx) => (
                                <div key={subtopicDetailIdx} className="grid grid-cols-2 gap-4 px-4 py-3 border-b border-gray-800 hover:bg-gray-800 hover:bg-opacity-50 transition-all">
                                  <div className="text-gray-300 text-center">{subtopic.name}</div>
                                  <div className="text-gray-300 text-center">{subtopic.frequency}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredTopics.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No topics found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupportHomePage;
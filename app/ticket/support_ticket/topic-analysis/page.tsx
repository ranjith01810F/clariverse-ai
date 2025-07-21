"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';
import { Header } from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';

type Ticket = {
  _id: string;
  ticket_number: string;
  title: string;
  description: string;
  mapped_dominant_topic_id: string;
  mapped_dominant_topic_name: string;
  mapped_subtopic_id?: string;
  mapped_subtopic_name: string;
  // Add any other fields as needed
};

const TopicAnalysis: React.FC = () => {
  const [selectedDominantTopics, setSelectedDominantTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [dominantDropdownOpen, setDominantDropdownOpen] = useState(false);
  const [subtopicDropdownOpen, setSubtopicDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const RECORDS_PER_PAGE = 10;

  const dominantDropdownRef = useRef<HTMLDivElement>(null);
  const subtopicDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dominantDropdownOpen &&
        dominantDropdownRef.current &&
        !dominantDropdownRef.current.contains(event.target as Node)
      ) {
        setDominantDropdownOpen(false);
      }
      if (
        subtopicDropdownOpen &&
        subtopicDropdownRef.current &&
        !subtopicDropdownRef.current.contains(event.target as Node)
      ) {
        setSubtopicDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dominantDropdownOpen, subtopicDropdownOpen]);

  // Mock data
  const dominantTopics = [
    { id: '1', display_name: 'Customer Support', name: 'Customer Support' },
    { id: '2', display_name: 'Billing Issues', name: 'Billing Issues' },
    { id: '3', display_name: 'Technical Problems', name: 'Technical Problems' },
    { id: '4', display_name: 'Product Inquiries', name: 'Product Inquiries' },
    { id: '5', display_name: 'Service Requests', name: 'Service Requests' },
    { id: '6', display_name: 'Account Management', name: 'Account Management' },
    { id: '7', display_name: 'Feature Requests', name: 'Feature Requests' },
  ];

  const subtopics = [
    { id: '1-1', display_name: 'Account Access', dominant_id: '1', name: 'Account Access' },
    { id: '1-2', display_name: 'Response Time', dominant_id: '1', name: 'Response Time' },
    { id: '1-3', display_name: 'Service Quality', dominant_id: '1', name: 'Service Quality' },
    { id: '2-1', display_name: 'Payment Disputes', dominant_id: '2', name: 'Payment Disputes' },
    { id: '2-2', display_name: 'Refund Requests', dominant_id: '2', name: 'Refund Requests' },
    { id: '2-3', display_name: 'Invoice Issues', dominant_id: '2', name: 'Invoice Issues' },
    { id: '3-1', display_name: 'Software Bugs', dominant_id: '3', name: 'Software Bugs' },
    { id: '3-2', display_name: 'Performance Issues', dominant_id: '3', name: 'Performance Issues' },
    { id: '3-3', display_name: 'Integration Problems', dominant_id: '3', name: 'Integration Problems' },
    { id: '4-1', display_name: 'Product Features', dominant_id: '4', name: 'Product Features' },
    { id: '4-2', display_name: 'Pricing Information', dominant_id: '4', name: 'Pricing Information' },
    { id: '5-1', display_name: 'Installation Help', dominant_id: '5', name: 'Installation Help' },
    { id: '5-2', display_name: 'Configuration Support', dominant_id: '5', name: 'Configuration Support' },
    { id: '6-1', display_name: 'Profile Updates', dominant_id: '6', name: 'Profile Updates' },
    { id: '6-2', display_name: 'Security Settings', dominant_id: '6', name: 'Security Settings' },
    { id: '7-1', display_name: 'New Features', dominant_id: '7', name: 'New Features' },
    { id: '7-2', display_name: 'Enhancement Requests', dominant_id: '7', name: 'Enhancement Requests' },
  ];

  const allTickets = [
    { _id: '1', ticket_number: 'TK-001', title: 'Unable to access dashboard', description: 'Customer reports inability to log into the main dashboard after recent update. Error message shows "Invalid credentials" despite correct password.', mapped_dominant_topic_id: '1', mapped_dominant_topic_name: 'Customer Support', mapped_subtopic_id: '1-1', mapped_subtopic_name: 'Account Access' },
    { _id: '2', ticket_number: 'TK-002', title: 'Payment not processed', description: 'Monthly subscription payment failed to process. Customer\'s card was charged but subscription status shows as inactive.', mapped_dominant_topic_id: '2', mapped_dominant_topic_name: 'Billing Issues', Mapped_subtopic_id: '2-1', mapped_subtopic_name: 'Payment Disputes' },
    { _id: '3', ticket_number: 'TK-003', title: 'Application crashes on startup', description: 'Desktop application crashes immediately after launch. Error occurs on Windows 10 systems with latest updates installed.', mapped_dominant_topic_id: '3', mapped_dominant_topic_name: 'Technical Problems', mapped_subtopic_id: '3-1', mapped_subtopic_name: 'Software Bugs' },
    { _id: '4', ticket_number: 'TK-004', title: 'Refund request for duplicate charge', description: 'Customer was charged twice for the same service. Requesting refund for the duplicate transaction from last month.', mapped_dominant_topic_id: '2', mapped_dominant_topic_name: 'Billing Issues', mapped_subtopic_id: '2-2', mapped_subtopic_name: 'Refund Requests' },
    { _id: '5', ticket_number: 'TK-005', title: 'Feature request: Dark mode', description: 'Multiple customers have requested a dark mode option for the web application to reduce eye strain during extended use.', mapped_dominant_topic_id: '7', mapped_dominant_topic_name: 'Feature Requests', mapped_subtopic_id: '7-1', mapped_subtopic_name: 'New Features' },
    { _id: '6', ticket_number: 'TK-006', title: 'Slow loading times', description: 'Reports indicate significant performance degradation in the application, particularly when loading large datasets.', mapped_dominant_topic_id: '3', mapped_dominant_topic_name: 'Technical Problems', mapped_subtopic_id: '3-2', mapped_subtopic_name: 'Performance Issues' },
    { _id: '7', ticket_number: 'TK-007', title: 'Installation wizard fails', description: 'New users unable to complete software installation. Process stops at 75% with generic error message.', mapped_dominant_topic_id: '5', mapped_dominant_topic_name: 'Service Requests', mapped_subtopic_id: '5-1', mapped_subtopic_name: 'Installation Help' },
    { _id: '8', ticket_number: 'TK-008', title: 'Profile picture upload not working', description: 'Users cannot update their profile pictures. Upload process completes but image does not appear in the interface.', mapped_dominant_topic_id: '6', mapped_dominant_topic_name: 'Account Management', mapped_subtopic_id: '6-1', mapped_subtopic_name: 'Profile Updates' },
    { _id: '9', ticket_number: 'TK-009', title: 'API integration documentation', description: 'Developer requesting comprehensive documentation for REST API endpoints and authentication methods.', mapped_dominant_topic_id: '4', mapped_dominant_topic_name: 'Product Inquiries', mapped_subtopic_id: '4-1', mapped_subtopic_name: 'Product Features' },
    { _id: '10', ticket_number: 'TK-010', title: 'Two-factor authentication setup', description: 'Customer needs assistance setting up 2FA for enhanced account security. Current process is unclear.', mapped_dominant_topic_id: '6', mapped_dominant_topic_name: 'Account Management', mapped_subtopic_id: '6-2', mapped_subtopic_name: 'Security Settings' },
    { _id: '11', ticket_number: 'TK-011', title: 'Invoice generation error', description: 'Automated invoice generation is failing for premium accounts. Manual intervention required for each billing cycle.', mapped_dominant_topic_id: '2', mapped_dominant_topic_name: 'Billing Issues', mapped_subtopic_id: '2-3', mapped_subtopic_name: 'Invoice Issues' },
    { _id: '12', ticket_number: 'TK-012', title: 'Third-party service connection', description: 'Issues connecting to external CRM system. Authentication tokens appear to be expiring unexpectedly.', mapped_dominant_topic_id: '3', mapped_dominant_topic_name: 'Technical Problems', mapped_subtopic_id: '3-3', mapped_subtopic_name: 'Integration Problems' },
    { _id: '13', ticket_number: 'TK-013', title: 'Support response time inquiry', description: 'Customer feedback regarding extended response times for support tickets during peak hours.', mapped_dominant_topic_id: '1', mapped_dominant_topic_name: 'Customer Support', mapped_subtopic_id: '1-2', mapped_subtopic_name: 'Response Time' },
    { _id: '14', ticket_number: 'TK-014', title: 'Bulk data export feature', description: 'Enterprise customer requesting ability to export large datasets in multiple formats (CSV, JSON, XML).', mapped_dominant_topic_id: '7', mapped_dominant_topic_name: 'Feature Requests', mapped_subtopic_id: '7-2', mapped_subtopic_name: 'Enhancement Requests' },
    { _id: '15', ticket_number: 'TK-015', title: 'Configuration backup restore', description: 'Need assistance restoring application configuration from backup file after system migration.', mapped_dominant_topic_id: '5', mapped_dominant_topic_name: 'Service Requests', mapped_subtopic_id: '5-2', mapped_subtopic_name: 'Configuration Support' },
  ];

  const availableSubtopics = subtopics.filter((subtopic) =>
    selectedDominantTopics.includes(subtopic.dominant_id)
  );

  const getFilteredTickets = () => {
    if (selectedDominantTopics.length === 0) {
      return allTickets;
    }
    
    let filtered = allTickets.filter(ticket => 
      selectedDominantTopics.includes(ticket.mapped_dominant_topic_id)
    );

    if (selectedSubtopics.length > 0) {
      filtered = filtered.filter(ticket => 
        typeof ticket.mapped_subtopic_id === 'string' && selectedSubtopics.includes(ticket.mapped_subtopic_id)
      );
    }

    return filtered;
  };

  const filteredTickets = getFilteredTickets();
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / RECORDS_PER_PAGE));
  const startIdx = currentPage * RECORDS_PER_PAGE;
  const endIdx = Math.min(startIdx + RECORDS_PER_PAGE, filteredTickets.length);
  const currentPageTickets = filteredTickets.slice(startIdx, endIdx);

  const handleDominantTopicToggle = (topicId: string) => {
    setSelectedDominantTopics(prev => {
      const newSelection = prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId];
      setSelectedSubtopics([]);
      setCurrentPage(0);
      setSelectedTicket(null);
      return newSelection;
    });
  };

  const handleSubtopicToggle = (subtopicId: string) => {
    setSelectedSubtopics(prev => {
      const newSelection = prev.includes(subtopicId) 
        ? prev.filter(id => id !== subtopicId)
        : [...prev, subtopicId];
      setCurrentPage(0);
      setSelectedTicket(null);
      return newSelection;
    });
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const clearAllFilters = () => {
    setSelectedDominantTopics([]);
    setSelectedSubtopics([]);
    setCurrentPage(0);
    setSelectedTicket(null);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
    setSelectedTicket(null);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    setSelectedTicket(null);
  };

  // Sidebar toggle logic
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
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
      {/* Sidebar Drawer - z-40, below header */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar onClose={closeSidebar} />
      </div>
      {/* Sidebar Overlay (z-30, below header) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30" onClick={closeSidebar} />
      )}
      {/* Background (z-0) */}
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
      <div className={`relative z-20 transition-all duration-300 ${isSidebarOpen ? 'filter blur-sm' : ''} pt-[72px]`}>
        {/* Header Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Topic Analysis Dashboard</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Explore and filter support tickets by topics and subtopics to gain actionable insights
              </p>
            </div>

            <div className="flex flex-col w-full">
              {/* Filter Bar */}
              <div className="sticky top-0 z-30 bg-gray-900 bg-opacity-95 border border-gray-700 rounded-lg shadow-lg p-4 mb-4 flex flex-wrap gap-4 items-center justify-between transition-all duration-300">
                {/* Dominant Topics Filter */}
                <div className="relative min-w-[220px]" ref={dominantDropdownRef}>
                  <label className="text-sm font-semibold text-gray-200 mb-1 block">Dominant Topics</label>
                  <button
                    aria-label="Select dominant topics"
                    onClick={() => setDominantDropdownOpen(!dominantDropdownOpen)}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 flex items-center justify-between hover:bg-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                  >
                    <span className="text-sm">
                      {selectedDominantTopics.length > 0 
                        ? `${selectedDominantTopics.length} topic${selectedDominantTopics.length > 1 ? 's' : ''} selected`
                        : 'Select topics...'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dominantDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dominantDropdownOpen && (
                    <div className="absolute z-50 w-64 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fade-in">
                      {dominantTopics.map((topic) => (
                        <div
                          key={topic.id}
                          onClick={() => handleDominantTopicToggle(topic.id)}
                          className={`p-3 cursor-pointer hover:bg-pink-600/20 flex items-center justify-between transition-all ${
                            selectedDominantTopics.includes(topic.id) ? 'bg-pink-600/30' : ''
                          }`}
                          tabIndex={0}
                          role="option"
                          aria-selected={selectedDominantTopics.includes(topic.id)}
                        >
                          <span className="text-gray-200 text-sm">{topic.display_name}</span>
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
                {/* Subtopics Filter */}
                <div className="relative min-w-[220px]" ref={subtopicDropdownRef}>
                  <label className="text-sm font-semibold text-gray-200 mb-1 block">Subtopics</label>
                  <button
                    aria-label="Select subtopics"
                    onClick={() => setSubtopicDropdownOpen(!subtopicDropdownOpen)}
                    disabled={availableSubtopics.length === 0}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 flex items-center justify-between hover:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-sm">
                      {selectedSubtopics.length > 0 
                        ? `${selectedSubtopics.length} subtopic${selectedSubtopics.length > 1 ? 's' : ''} selected`
                        : availableSubtopics.length === 0 
                          ? 'Select dominant topics first...'
                          : 'Select subtopics...'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${subtopicDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {subtopicDropdownOpen && availableSubtopics.length > 0 && (
                    <div className="absolute z-50 w-64 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fade-in">
                      {availableSubtopics.map((subtopic) => (
                        <div
                          key={subtopic.id}
                          onClick={() => handleSubtopicToggle(subtopic.id)}
                          className={`p-3 cursor-pointer hover:bg-purple-600/20 flex items-center justify-between transition-all ${
                            selectedSubtopics.includes(subtopic.id) ? 'bg-purple-600/30' : ''
                          }`}
                          tabIndex={0}
                          role="option"
                          aria-selected={selectedSubtopics.includes(subtopic.id)}
                        >
                          <span className="text-gray-200 text-sm">{subtopic.display_name}</span>
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
                {/* Clear Filters Button */}
                <div className="flex-1 flex items-end justify-end">
                  <button
                    onClick={clearAllFilters}
                    className="bg-red-600 text-white rounded-lg p-3 hover:bg-red-700 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              {/* Active Filters Summary Chips */}
              {(selectedDominantTopics.length > 0 || selectedSubtopics.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedDominantTopics.map((topicId) => {
                    const topic = dominantTopics.find(t => t.id === topicId);
                    return (
                      <span
                        key={topicId}
                        className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm animate-fade-in"
                      >
                        {topic?.display_name}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => handleDominantTopicToggle(topicId)}
                          aria-label={`Remove filter ${topic?.display_name}`}
                        />
                      </span>
                    );
                  })}
                  {selectedSubtopics.map((subtopicId) => {
                    const subtopic = subtopics.find(s => s.id === subtopicId);
                    return (
                      <span
                        key={subtopicId}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm animate-fade-in"
                      >
                        {subtopic?.display_name}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => handleSubtopicToggle(subtopicId)}
                          aria-label={`Remove filter ${subtopic?.display_name}`}
                        />
                      </span>
                    );
                  })}
                </div>
              )}
              <hr className="border-gray-700 mb-4" />

              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="bg-gray-800 bg-opacity-80 border-b border-gray-700 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        className="pl-10 pr-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    Showing {filteredTickets.length} tickets
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Ticket List */}
                  <div className={`${selectedTicket ? 'w-1/3' : 'w-full'} border-r border-gray-700 bg-gray-800 bg-opacity-50 overflow-y-auto`}>
                    {filteredTickets.length === 0 ? (
                      <div className="p-4 text-center text-gray-300">
                        No tickets match the selected criteria. Try adjusting your filters.
                      </div>
                    ) : (
                      <>
                        {currentPageTickets.map((ticket) => (
                          <div
                            key={ticket._id}
                            onClick={() => handleTicketClick(ticket)}
                            className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${
                              selectedTicket?._id === ticket._id ? 'bg-pink-600 bg-opacity-20' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-white">{ticket.title}</div>
                                <div className="text-sm text-gray-400">{ticket.ticket_number}</div>
                              </div>
                              <div className="text-xs text-gray-300">
                                {ticket.mapped_dominant_topic_name}
                              </div>
                            </div>
                          </div>
                        ))}
                        {totalPages > 1 && (
                          <div className="p-4 flex justify-between items-center bg-gray-800 bg-opacity-80 border-t border-gray-700">
                            <button
                              onClick={handlePreviousPage}
                              disabled={currentPage <= 0}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Previous
                            </button>
                            <div className="text-sm text-gray-300">
                              Page {currentPage + 1} of {totalPages}
                            </div>
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage >= totalPages - 1}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Ticket Details */}
                  {selectedTicket && (
                    <div className="w-2/3 bg-gray-800 bg-opacity-80 overflow-y-auto p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">{selectedTicket.title}</h2>
                        <button
                          onClick={() => setSelectedTicket(null)}
                          className="p-1 hover:bg-gray-700 rounded-full"
                        >
                          <X className="w-5 h-5 text-gray-300" />
                        </button>
                      </div>
                      <div className="border-b border-gray-600 pb-4 mb-4">
                        <div className="text-sm text-gray-300">Ticket Number: {selectedTicket.ticket_number}</div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium text-gray-300">Description</label>
                          <div className="mt-1 p-4 bg-gray-900 rounded-lg text-gray-200">
                            {selectedTicket.description}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-300">Dominant Topic</label>
                            <div className="mt-1 text-pink-400 font-medium">{selectedTicket.mapped_dominant_topic_name}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-300">Subtopic</label>
                            <div className="mt-1 text-purple-400 font-medium">{selectedTicket.mapped_subtopic_name}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TopicAnalysis;
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileText, ArrowRight, Layers, ListChecks, Trash2, RefreshCw, ChevronDown, GripVertical, AlertCircle, CheckCircle2 } from "lucide-react";
import { Header } from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';

interface Topic {
  _id: string;
  name: string;
  keywords: string[];
  llm_dominant_topic_list: string[];
}

interface Subtopic {
  _id: string;
  name: string;
  keywords: string[];
  llm_dominant_topic_id: string;
}

const ManualAnalysisPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [versions, setVersions] = useState<number[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [subtopicVisibility, setSubtopicVisibility] = useState<{ [key: string]: boolean }>({});
  const [showAllSubtopics, setShowAllSubtopics] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTopic1, setSelectedTopic1] = useState<string | null>(null);
  const [selectedTopic2, setSelectedTopic2] = useState<string | null>(null);
  const [mergeTopicCustomName, setMergeTopicCustomName] = useState("");
  const [useCustomTopicName, setUseCustomTopicName] = useState(false);
  const [selectedSubtopic1, setSelectedSubtopic1] = useState<string | null>(null);
  const [selectedSubtopic2, setSelectedSubtopic2] = useState<string | null>(null);
  const [selectedDominantTopic, setSelectedDominantTopic] = useState<string | null>(null);
  const [mergeSubtopicCustomName, setMergeSubtopicCustomName] = useState("");
  const [useCustomSubtopicName, setUseCustomSubtopicName] = useState(false);
  const [moveSubtopic, setMoveSubtopic] = useState<string | null>(null);
  const [moveDominantTopic, setMoveDominantTopic] = useState<string | null>(null);
  const [moveKeywordsSubtopic, setMoveKeywordsSubtopic] = useState<string | null>(null);
  const [moveKeywords, setMoveKeywords] = useState<string[]>([]);
  const [createNewSubtopic, setCreateNewSubtopic] = useState(false);
  const [newSubtopicName, setNewSubtopicName] = useState("");
  const [deleteKeywordsSubtopic, setDeleteKeywordsSubtopic] = useState<string | null>(null);
  const [deleteKeywords, setDeleteKeywords] = useState<string[]>([]);
  const [draggedSubtopic, setDraggedSubtopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Sidebar toggle logic
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Mock API calls with error handling
  const fetchVersions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setVersions([1, 2, 3]);
      setSelectedVersion(1);
    } catch (_error) {
      showNotification('error', 'Failed to fetch versions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTopicsAndSubtopics = useCallback(async () => {
    if (selectedVersion) {
      setIsLoading(true);
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setTopics([
          { _id: "1", name: "Login Issues", keywords: ["login", "authentication"], llm_dominant_topic_list: ["11", "12"] },
          { _id: "2", name: "Payment Problems", keywords: ["payment", "billing"], llm_dominant_topic_list: ["21", "22"] },
        ]);
        setSubtopics([
          { _id: "11", name: "Forgot Password", keywords: ["reset", "forgot", "password"], llm_dominant_topic_id: "11" },
          { _id: "12", name: "Account Locked", keywords: ["locked", "security"], llm_dominant_topic_id: "12" },
          { _id: "21", name: "Card Declined", keywords: ["card", "declined", "payment"], llm_dominant_topic_id: "21" },
          { _id: "22", name: "Refund Request", keywords: ["refund", "return"], llm_dominant_topic_id: "22" },
        ]);
      } catch (_error) {
        showNotification('error', 'Failed to fetch topics and subtopics');
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedVersion]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  useEffect(() => {
    fetchTopicsAndSubtopics();
  }, [fetchTopicsAndSubtopics]);

  const getKeywords = (subtopicId: string) => {
    const subtopic = subtopics.find(s => s._id === subtopicId);
    return subtopic ? subtopic.keywords : [];
  };

  const recordsPerPage = 10;
  const totalPages = Math.ceil(topics.length / recordsPerPage);
  const pageData = topics.slice(currentPage * recordsPerPage, (currentPage + 1) * recordsPerPage);

  const handleDragStart = (id: string) => setDraggedSubtopic(id);
  const handleDrop = (targetTopicId: string) => {
    if (draggedSubtopic) {
      showNotification('success', `Moved subtopic ${draggedSubtopic} to topic ${targetTopicId}`);
      setDraggedSubtopic(null);
    }
  };

  const toggleSubtopicVisibility = (topicId: string) => {
    setSubtopicVisibility(prev => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const toggleAllSubtopics = () => {
    const newState = !showAllSubtopics;
    setShowAllSubtopics(newState);
    const newVisibility = topics.reduce((acc, topic) => ({
      ...acc,
      [topic._id]: newState,
    }), {});
    setSubtopicVisibility(newVisibility);
  };

  const handleMergeTopics = async () => {
    if (!selectedTopic1 || !selectedTopic2) return;
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showNotification('success', 'Topics merged successfully');
      setSelectedTopic1(null);
      setSelectedTopic2(null);
      setMergeTopicCustomName('');
      setUseCustomTopicName(false);
    } catch (_error) {
      showNotification('error', 'Failed to merge topics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMergeSubtopics = async () => {
    if (!selectedSubtopic1 || !selectedSubtopic2 || !selectedDominantTopic) return;
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showNotification('success', 'Subtopics merged successfully');
      setSelectedSubtopic1(null);
      setSelectedSubtopic2(null);
      setSelectedDominantTopic(null);
      setMergeSubtopicCustomName('');
      setUseCustomSubtopicName(false);
    } catch (_error) {
      showNotification('error', 'Failed to merge subtopics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveSubtopic = async () => {
    if (!moveSubtopic || !moveDominantTopic) return;
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showNotification('success', 'Subtopic moved successfully');
      setMoveSubtopic(null);
      setMoveDominantTopic(null);
    } catch (_error) {
      showNotification('error', 'Failed to move subtopic');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveKeywords = async () => {
    if (!moveKeywordsSubtopic || !moveKeywords.length || (!createNewSubtopic && !moveSubtopic) || (createNewSubtopic && (!moveDominantTopic || !newSubtopicName))) return;
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showNotification('success', 'Keywords moved successfully');
      setMoveKeywordsSubtopic(null);
      setMoveKeywords([]);
      setMoveSubtopic(null);
      setMoveDominantTopic(null);
      setNewSubtopicName('');
      setCreateNewSubtopic(false);
    } catch (_error) {
      showNotification('error', 'Failed to move keywords');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKeywords = async () => {
    if (!deleteKeywordsSubtopic || !deleteKeywords.length) return;
    if (window.confirm('Are you sure you want to delete these keywords?')) {
      setIsLoading(true);
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));
        showNotification('success', 'Keywords deleted successfully');
        setDeleteKeywordsSubtopic(null);
        setDeleteKeywords([]);
      } catch (_error) {
        showNotification('error', 'Failed to delete keywords');
      } finally {
        setIsLoading(false);
      }
    }
  };

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
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
              >
                Manual Analysis
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Effortlessly manage, merge, and map topics and subtopics for support tickets with an intuitive interface.
              </p>
            </div>
            {/* Notification */}
            {notification && (
              <div
                className={`fixed top-20 right-4 p-4 rounded-lg flex items-center gap-2 ${
                  notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                } text-white shadow-lg`}
              >
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                {notification.message}
              </div>
            )}
            {/* Version Selection */}
            <div
              className="mb-10 flex flex-col md:flex-row items-center justify-center gap-4"
            >
              <div className="bg-gray-800 rounded-lg px-6 py-4 flex items-center gap-4 shadow-lg">
                <FileText className="w-6 h-6 text-pink-400" />
                <span className="text-white font-semibold">Select Version:</span>
                <div className="relative">
                  <select
                    className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none appearance-none disabled:opacity-50"
                    value={selectedVersion ?? ''} 
                    onChange={e => setSelectedVersion(Number(e.target.value))}
                    disabled={isLoading}
                    aria-label="Select version"
                  >
                    <option value="" disabled>Select a Version</option>
                    {versions.map(v => (
                      <option key={v} value={v}>Version {v}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
            {/* Global Subtopics Toggle */}
            <div
              className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <ListChecks className="w-7 h-7 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Global Subtopics Toggle</h2>
              </div>
              <button 
                onClick={toggleAllSubtopics}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                disabled={isLoading}
                aria-label={showAllSubtopics ? 'Hide all subtopics' : 'Show all subtopics'}
              >
                {showAllSubtopics ? '✓ Hide All Subtopics' : '☐ Show All Subtopics'}
              </button>
            </div>
            {/* Topics Table */}
            <div
              className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <ListChecks className="w-7 h-7 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Topics & Subtopics Table</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-gray-200">
                  <thead>
                    <tr className="bg-gray-900">
                      <th className="py-3 px-4">Subtopics</th>
                      <th className="py-3 px-4 text-center">Current Name</th>
                      <th className="py-3 px-4 text-center">Keywords</th>
                      <th className="py-3 px-4 text-center">Rename</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map(topic => (
                      <React.Fragment key={topic._id}>
                        <tr
                          className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleSubtopicVisibility(topic._id)}
                              className="text-white hover:text-pink-400 transition-colors"
                              aria-label={subtopicVisibility[topic._id] ? 'Hide subtopics' : 'Show subtopics'}
                            >
                              {subtopicVisibility[topic._id] ? '✓' : '☐'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center font-medium">{topic.name}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                              {topic.keywords.join(', ')}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Enter new name"
                                className="bg-gray-900 text-white rounded-lg px-3 py-1 border border-gray-700 focus:border-pink-400 focus-outline-none w-full max-w-xs"
                                onChange={(_e) => {
                                  // Mock rename logic
                                }}
                                disabled={isLoading}
                                aria-label={`Rename topic ${topic.name}`}
                              />
                              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
                                disabled={isLoading}
                              >
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>
                        {subtopicVisibility[topic._id] && (
                          <tr>
                            <td colSpan={4} className="py-4 px-4">
                              <div className="bg-gray-900 rounded-lg p-4">
                                <h3 className="text-lg font-bold text-white mb-3">Subtopics for {topic.name}</h3>
                                <table className="min-w-full text-left text-gray-200">
                                  <thead>
                                    <tr className="bg-gray-800">
                                      <th className="py-2 px-4 text-center">Name</th>
                                      <th className="py-2 px-4 text-center">Keywords</th>
                                      <th className="py-2 px-4 text-center">Rename</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {subtopics
                                      .filter(sub => topic.llm_dominant_topic_list.includes(sub.llm_dominant_topic_id))
                                      .map(sub => (
                                        <tr
                                          key={sub._id}
                                          className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                                        >
                                          <td className="py-2 px-4 text-center font-medium">{sub.name}</td>
                                          <td className="py-2 px-4 text-center">
                                            <div className="max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                              {sub.keywords.join(', ')}
                                            </div>
                                          </td>
                                          <td className="py-2 px-4 text-center">
                                            <div className="flex flex-col gap-2 items-center">
                                              <input
                                                type="text"
                                                placeholder="Enter new name"
                                                className="bg-gray-900 text-white rounded-lg px-3 py-1 border border-gray-700 focus:border-pink-400 focus:outline-none w-full max-w-xs"
                                                onChange={(_e) => {
                                                  // Mock rename logic
                                                }}
                                                disabled={isLoading}
                                                aria-label={`Rename subtopic ${sub.name}`}
                                              />
                                              <button
                                                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
                                                disabled={isLoading}
                                              >
                                                Save
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0 || isLoading}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
                  aria-label="Previous page"
                >
                  ⬅️ Previous
                </button>
                <span className="text-white font-bold">Page {currentPage + 1} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                  disabled={currentPage === totalPages - 1 || isLoading}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
                  aria-label="Next page"
                >
                  Next ➡️
                </button>
              </div>
            </div>
            {/* Merge Topics Section */}
            <div
              className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <Layers className="w-7 h-7 text-pink-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Merge Dominant Topics</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full md:w-auto"
                  value={selectedTopic1 ?? 'Select a Topic'}
                  onChange={e => setSelectedTopic1(e.target.value)}
                  disabled={isLoading}
                  aria-label="Select first topic to merge"
                >
                  <option value="Select a Topic">Select a Topic</option>
                  {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full md:w-auto"
                  value={selectedTopic2 ?? 'Select a Topic'}
                  onChange={e => setSelectedTopic2(e.target.value)}
                  disabled={isLoading}
                  aria-label="Select second topic to merge"
                >
                  <option value="Select a Topic">Select a Topic</option>
                  {topics.filter(t => t._id !== selectedTopic1).map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={useCustomTopicName}
                      onChange={() => setUseCustomTopicName(!useCustomTopicName)}
                      className="form-checkbox text-pink-400" disabled={isLoading}
                    />
                    Use Custom Name
                  </label>
                  {useCustomTopicName && (
                    <input
                      type="text"
                      placeholder="Enter New Topic Name"
                      value={mergeTopicCustomName}
                      onChange={e => setMergeTopicCustomName(e.target.value)}
                      className="bg-gray-900 text-white rounded-lg px-3 py-1 border border-gray-700 focus:border-pink-400 focus:outline-none w-full"
                      disabled={isLoading}
                      aria-label="Custom topic name"
                    />
                  )}
                </div>
                <button
                  onClick={handleMergeTopics}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 w-full md:w-auto"
                  disabled={!selectedTopic1 || !selectedTopic2 || selectedTopic1 === 'Select a Topic' || selectedTopic2 === 'Select a Topic' || isLoading}
                  aria-label="Merge topics"
                >
                  {isLoading ? 'Merging...' : 'Merge'}
                </button>
              </div>
            </div>
            {/* Merge Subtopics Section */}
            <div
              className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <Layers className="w-7 h-7 text-pink-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Merge Subtopics</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full md:w-auto"
                  value={selectedDominantTopic ?? 'Select a Dominant Topic'}
                  onChange={e => setSelectedDominantTopic(e.target.value)} 
                  disabled={isLoading}
                  aria-label="Select dominant topic"
                >
                  <option value="Select a Dominant Topic">Select a Dominant Topic</option>
                  {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full md:w-auto"
                  value={selectedSubtopic1 ?? 'Select a Subtopic'}
                  onChange={e => setSelectedSubtopic1(e.target.value)}
                  disabled={isLoading}
                  aria-label="Select first subtopic to merge"
                >
                  <option value="Select a Subtopic">Select a Subtopic</option>
                  {selectedDominantTopic && selectedDominantTopic !== 'Select a Dominant Topic' ? 
                    subtopics
                      .filter(sub => topics.find(t => t._id === selectedDominantTopic)?.llm_dominant_topic_list.includes(sub.llm_dominant_topic_id))
                      .map(s => <option key={s._id} value={s._id}>{s.name}</option>) : []
                  }
                </select>
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full md:w-auto"
                  value={selectedSubtopic2 ?? 'Select a Subtopic'}
                  onChange={e => setSelectedSubtopic2(e.target.value)}
                  disabled={isLoading}
                  aria-label="Select second subtopic to merge"
                >
                  <option value="Select a Subtopic">Select a Subtopic</option>
                  {selectedDominantTopic && selectedDominantTopic !== 'Select a Dominant Topic' ? 
                    subtopics
                      .filter(sub => sub._id !== selectedSubtopic1 && topics.find(t => t._id === selectedDominantTopic)?.llm_dominant_topic_list.includes(sub.llm_dominant_topic_id))
                      .map(s => <option key={s._id} value={s._id}>{s.name}</option>) : []
                  }
                </select>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={useCustomSubtopicName}
                      onChange={() => setUseCustomSubtopicName(!useCustomSubtopicName)}
                      className="form-checkbox text-pink-400" disabled={isLoading}
                    />
                    Use Custom Name
                  </label>
                  {useCustomSubtopicName && (
                    <input
                      type="text"
                      placeholder="Enter New Subtopic Name"
                      value={mergeSubtopicCustomName}
                      onChange={e => setMergeSubtopicCustomName(e.target.value)}
                      className="bg-gray-900 text-white rounded-lg px-3 py-1 border border-gray-700 focus:border-pink-400 focus:outline-none w-full"
                      disabled={isLoading}
                      aria-label="Custom subtopic name"
                    />
                  )}
                </div>
                <button
                  onClick={handleMergeSubtopics}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 w-full md:w-auto"
                  disabled={!selectedSubtopic1 || !selectedSubtopic2 || selectedSubtopic1 === 'Select a Subtopic' || selectedSubtopic2 === 'Select a Subtopic' || isLoading}
                  aria-label="Merge subtopics"
                >
                  {isLoading ? 'Merging...' : 'Merge'}
                </button>
              </div>
            </div>
            {/* Move Subtopics Section */}
            <div
              className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <ArrowRight className="w-7 h-7 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Move Subtopics (Drag & Drop)</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full md:w-auto"
                  value={moveSubtopic ?? 'Select a Subtopic'}
                  onChange={e => setMoveSubtopic(e.target.value)}
                  disabled={isLoading}
                  aria-label="Select subtopic to move"
                >
                  <option value="Select a Subtopic">Select a Subtopic</option>
                  {subtopics.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} {subtopics.filter(sub => sub.name === s.name).length > 1 ? `(ID: ${s._id.slice(-8)})` : ''}
                    </option>
                  ))}
                </select>
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full md:w-auto"
                  value={moveDominantTopic ?? 'Select a Dominant Topic'}
                  onChange={e => setMoveDominantTopic(e.target.value)}
                  disabled={isLoading}
                  aria-label="Select target dominant topic"
                >
                  <option value="Select a Dominant Topic">Select a Dominant Topic</option>
                  {topics
                    .filter(t => {
                      const moveSubtopicObj = subtopics.find(s => s._id === moveSubtopic);
                      const moveSubtopicDominantId = moveSubtopicObj?.llm_dominant_topic_id;
                      return !moveSubtopicDominantId || !t.llm_dominant_topic_list.includes(moveSubtopicDominantId);
                    })
                    .map(t => <option key={t._id} value={t.llm_dominant_topic_list[0]}>{t.name}</option>)}
                </select>
                <button
                  onClick={handleMoveSubtopic}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 w-full md:w-auto"
                  disabled={!moveSubtopic || !moveDominantTopic || moveSubtopic === 'Select a Subtopic' || moveDominantTopic === 'Select a Dominant Topic' || isLoading}
                  aria-label="Move subtopic"
                >
                  {isLoading ? 'Moving...' : 'Move'}
                </button>
              </div>
              <div className="flex flex-wrap gap-8 items-start justify-center">
                {topics.map(topic => (
                  <div
                    key={topic._id}
                    className="bg-gray-900 rounded-lg p-4 w-64 min-h-[120px] shadow-inner"
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(topic._id)}
                  >
                    <div className="font-bold text-pink-400 mb-2">{topic.name}</div>
                    <div className="flex flex-col gap-2">
                      {subtopics
                        .filter(sub => topic.llm_dominant_topic_list.includes(sub.llm_dominant_topic_id))
                        .map(sub => (
                          <div
                            key={sub._id}
                            className="bg-gray-700 px-3 py-2 rounded flex items-center gap-2 cursor-move hover:bg-gray-600 transition-colors"
                            draggable
                            onDragStart={() => handleDragStart(sub._id)}
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            {sub.name}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Move Keywords Section */}
            <div
              className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <RefreshCw className="w-7 h-7 text-pink-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Move Keywords</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full md:w-auto"
                  value={moveKeywordsSubtopic ?? 'Select Subtopic'}
                  onChange={e => setMoveKeywordsSubtopic(e.target.value)}
                  disabled={isLoading}
                  aria-label="Select subtopic for keywords"
                >
                  <option value="Select Subtopic">Select Subtopic</option>
                  {subtopics.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} {subtopics.filter(sub => sub.name === s.name).length > 1 ? `(ID: ${s._id.slice(-8)})` : ''}
                    </option>
                  ))}
                </select>
                <select
                  multiple
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 min-w-[160px] h-24"
                  value={moveKeywords}
                  onChange={e => setMoveKeywords(Array.from(e.target.selectedOptions, o => o.value))}
                  disabled={isLoading}
                  aria-label="Select keywords to move"
                >
                  {getKeywords(moveKeywordsSubtopic ?? '').map((k: string) => <option key={k} value={k}>{k}</option>)}
                </select>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={createNewSubtopic}
                      onChange={() => setCreateNewSubtopic(!createNewSubtopic)}
                      className="form-checkbox text-pink-400"
                      disabled={isLoading}
                    />
                    Create New Subtopic
                  </label>
                  {createNewSubtopic ? (
                    <>
                      <select
                        className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full"
                        value={moveDominantTopic ?? 'Select a Dominant Topic'}
                        onChange={e => setMoveDominantTopic(e.target.value)}
                        disabled={isLoading}
                        aria-label="Select dominant topic for new subtopic"
                      >
                        <option value="Select a Dominant Topic">Select a Dominant Topic</option>
                        {topics.map(t => <option key={t._id} value={t.llm_dominant_topic_list[0]}>{t.name}</option>)}
                      </select>
                      <input
                        type="text"
                        placeholder="Enter New Subtopic Name"
                        value={newSubtopicName}
                        onChange={e => setNewSubtopicName(e.target.value)}
                        className="bg-gray-900 text-white rounded-lg px-3 py-1 border border-gray-700 focus:border-pink-400 focus:outline-none w-full"
                        disabled={isLoading}
                        aria-label="New subtopic name"
                      />
                    </>
                  ) : (
                    <select
                      className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full"
                      value={moveSubtopic ?? 'Select Target Subtopic'}
                      onChange={e => setMoveSubtopic(e.target.value)}
                      disabled={isLoading}
                      aria-label="Select target subtopic"
                    >
                      <option value="Select Target Subtopic">Select Target Subtopic</option>
                      {subtopics
                        .filter(s => s._id !== moveKeywordsSubtopic && s.llm_dominant_topic_id === subtopics.find(sub => sub._id === moveKeywordsSubtopic)?.llm_dominant_topic_id)
                        .map(s => (
                          <option key={s._id} value={s._id}>
                            {s.name} {subtopics.filter(sub => sub.name === s.name).length > 1 ? `(ID: ${s._id.slice(-8)})` : ''}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <button
                  onClick={handleMoveKeywords}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 w-full md:w-auto"
                  disabled={!moveKeywordsSubtopic || !moveKeywords.length || (!createNewSubtopic && !moveSubtopic) || (createNewSubtopic && (!moveDominantTopic || !newSubtopicName)) || isLoading}
                  aria-label="Move keywords"
                >
                  {isLoading ? 'Moving...' : 'Move'}
                </button>
              </div>
            </div>
            {/* Delete Keywords Section */}
            <div
              className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <Trash2 className="w-7 h-7 text-pink-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Delete Keywords</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 w-full md:w-auto"
                  value={deleteKeywordsSubtopic ?? 'Select Subtopic'}
                  onChange={e => setDeleteKeywordsSubtopic(e.target.value)}
                  disabled={isLoading}
                  aria-label="Select subtopic for keyword deletion"
                >
                  <option value="Select Subtopic">Select Subtopic</option>
                  {subtopics.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} {subtopics.filter(sub => sub.name === s.name).length > 1 ? `(ID: ${s._id.slice(-8)})` : ''}
                    </option>
                  ))}
                </select>
                <select
                  multiple
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none disabled:opacity-50 min-w-[160px] h-24"
                  value={deleteKeywords}
                  onChange={e => setDeleteKeywords(Array.from(e.target.selectedOptions, o => o.value))}
                  disabled={isLoading}
                  aria-label="Select keywords to delete"
                >
                  {getKeywords(deleteKeywordsSubtopic ?? '').map((k: string) => <option key={k} value={k}>{k}</option>)}
                </select>
                <button
                  onClick={handleDeleteKeywords}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 w-full md:w-auto"
                  disabled={!deleteKeywordsSubtopic || !deleteKeywords.length || isLoading}
                  aria-label="Delete keywords"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            {/* Document Topic Mapping Section */}
            <div
              className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <FileText className="w-7 h-7 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Document Topic Mapping</h2>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  disabled={isLoading}
                  aria-label="Map topics"
                >
                  {isLoading ? 'Mapping...' : 'MAP'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManualAnalysisPage;
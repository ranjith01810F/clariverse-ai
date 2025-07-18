"use client";

import React, { useState } from "react";
import { Menu, X, FileText, ArrowRight, Layers, ListChecks, Trash2, RefreshCw, ChevronDown, GripVertical } from "lucide-react";
import Sidebar from '@/components/Sidebar/Sidebar';

const mockVersions = [1, 2, 3];
const mockTopics = [
  { id: 1, name: "Login Issues", subtopics: [
    { id: 11, name: "Forgot Password", keywords: ["reset", "forgot", "password"] },
    { id: 12, name: "Account Locked", keywords: ["locked", "security"] },
  ] },
  { id: 2, name: "Payment Problems", subtopics: [
    { id: 21, name: "Card Declined", keywords: ["card", "declined", "payment"] },
    { id: 22, name: "Refund Request", keywords: ["refund", "return"] },
  ] },
];

const ManualAnalysisPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(mockVersions[0]);
  const [selectedTopic1, setSelectedTopic1] = useState(mockTopics[0].id);
  const [selectedTopic2, setSelectedTopic2] = useState(mockTopics[1].id);
  const [moveKeywordsSubtopic, setMoveKeywordsSubtopic] = useState(mockTopics[0].subtopics[0].id);
  const [moveKeywords, setMoveKeywords] = useState<string[]>([]);
  const [deleteKeywordsSubtopic, setDeleteKeywordsSubtopic] = useState(mockTopics[0].subtopics[0].id);
  const [deleteKeywords, setDeleteKeywords] = useState<string[]>([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Helper to get keywords by subtopic id
  const getKeywords = (subtopicId: number) => {
    for (const topic of mockTopics) {
      const sub = topic.subtopics.find(s => s.id === subtopicId);
      if (sub) return sub.keywords;
    }
    return [];
  };

  // Drag and drop mock logic
  const [draggedSubtopic, setDraggedSubtopic] = useState<number|null>(null);
  const handleDragStart = (id: number) => setDraggedSubtopic(id);
  const handleDrop = (targetTopicId: number) => {
    if (draggedSubtopic != null) {
      // Just a mock: show an alert or update state visually
      alert(`Mock: Move subtopic ${draggedSubtopic} to topic ${targetTopicId}`);
      setDraggedSubtopic(null);
    }
  };

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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Manual Analysis</h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Manage, merge, and map topics and subtopics for support tickets. (UI Mockup)
              </p>
            </div>
            {/* Version Selection */}
            <div className="mb-10 flex flex-col md:flex-row items-center gap-4 justify-center">
              <div className="bg-gray-800 rounded-lg px-6 py-4 flex items-center gap-4 shadow">
                <FileText className="w-6 h-6 text-pink-400" />
                <span className="text-white font-semibold">Select Version:</span>
                <div className="relative">
                  <select
                    className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none appearance-none"
                    value={selectedVersion}
                    onChange={e => setSelectedVersion(Number(e.target.value))}
                  >
                    {mockVersions.map(v => (
                      <option key={v} value={v}>Version {v}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
            {/* Table Placeholder */}
            <div className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg">
              <div className="flex items-center mb-6">
                <ListChecks className="w-7 h-7 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Topics & Subtopics Table</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4">Topic</th>
                      <th className="py-2 px-4">Subtopics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTopics.map(topic => (
                      <tr key={topic.id} className="border-b border-gray-700">
                        <td className="py-2 px-4 font-semibold">{topic.name}</td>
                        <td className="py-2 px-4">
                          <div className="flex flex-wrap gap-2">
                            {topic.subtopics.map(sub => (
                              <span key={sub.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                <GripVertical className="w-3 h-3 text-gray-400 inline-block" />
                                {sub.name}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Merge Topics Section */}
            <div className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg">
              <div className="flex items-center mb-6">
                <Layers className="w-7 h-7 text-pink-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Merge Dominant Topics</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none"
                  value={selectedTopic1}
                  onChange={e => setSelectedTopic1(Number(e.target.value))}
                >
                  {mockTopics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none"
                  value={selectedTopic2}
                  onChange={e => setSelectedTopic2(Number(e.target.value))}
                >
                  {mockTopics.filter(t => t.id !== selectedTopic1).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300">Merge</button>
              </div>
            </div>
            {/* Move Subtopics Section (Drag and Drop Mock) */}
            <div className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg">
              <div className="flex items-center mb-6">
                <ArrowRight className="w-7 h-7 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Move Subtopics (Drag & Drop)</h2>
              </div>
              <div className="flex flex-wrap gap-8 items-start justify-center">
                {mockTopics.map(topic => (
                  <div
                    key={topic.id}
                    className="bg-gray-900 rounded-lg p-4 w-64 min-h-[120px] shadow-inner"
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(topic.id)}
                  >
                    <div className="font-bold text-pink-400 mb-2">{topic.name}</div>
                    <div className="flex flex-col gap-2">
                      {topic.subtopics.map(sub => (
                        <div
                          key={sub.id}
                          className="bg-gray-700 px-3 py-2 rounded flex items-center gap-2 cursor-move"
                          draggable
                          onDragStart={() => handleDragStart(sub.id)}
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
            <div className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg">
              <div className="flex items-center mb-6">
                <RefreshCw className="w-7 h-7 text-pink-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Move Keywords</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none"
                  value={moveKeywordsSubtopic}
                  onChange={e => setMoveKeywordsSubtopic(Number(e.target.value))}
                >
                  {mockTopics.flatMap(t => t.subtopics).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select
                  multiple
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none min-w-[160px]"
                  value={moveKeywords}
                  onChange={e => setMoveKeywords(Array.from(e.target.selectedOptions, o => o.value))}
                >
                  {getKeywords(moveKeywordsSubtopic).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300">Move</button>
              </div>
            </div>
            {/* Delete Keywords Section */}
            <div className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg">
              <div className="flex items-center mb-6">
                <Trash2 className="w-7 h-7 text-pink-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Delete Keywords</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <select
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none"
                  value={deleteKeywordsSubtopic}
                  onChange={e => setDeleteKeywordsSubtopic(Number(e.target.value))}
                >
                  {mockTopics.flatMap(t => t.subtopics).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select
                  multiple
                  className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-pink-400 focus:outline-none min-w-[160px]"
                  value={deleteKeywords}
                  onChange={e => setDeleteKeywords(Array.from(e.target.selectedOptions, o => o.value))}
                >
                  {getKeywords(deleteKeywordsSubtopic).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300">Delete</button>
              </div>
            </div>
            {/* Document Topic Mapping Section */}
            <div className="bg-gray-800 rounded-lg p-8 mb-10 shadow-lg">
              <div className="flex items-center mb-6">
                <FileText className="w-7 h-7 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Document Topic Mapping</h2>
              </div>
              <div className="flex items-center justify-center">
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2">
                  MAP
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

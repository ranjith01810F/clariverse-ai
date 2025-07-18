"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart, PieChart, Cloud, ChevronDown, ChevronUp } from 'lucide-react';
import Select, { SingleValue } from 'react-select';
import { Dialog, Transition } from '@headlessui/react';
import { Table, Button } from 'antd';
import Sidebar from '@/components/Sidebar/Sidebar';
import type { ColumnsType } from 'antd/es/table';

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
  const [selectedTopic, setSelectedTopic] = useState<SingleValue<{ value: string; label: string }>>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [sortOrder, setSortOrder] = useState<'descend' | 'ascend'>('descend');
  const [dataSource, setDataSource] = useState<Topic[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    // Initial mock data
    const initialData: Topic[] = [
      {
        name: "Customer Support",
        frequency: 1200,
        id: "1",
        subtopics: [
          { name: "Login Issues", frequency: 300 },
          { name: "Account Recovery", frequency: 200 },
          { name: "Password Reset", frequency: 150 },
        ]
      },
      {
        name: "Technical Issues",
        frequency: 850,
        id: "2",
        subtopics: [
          { name: "Bug Reports", frequency: 250 },
          { name: "System Crashes", frequency: 180 },
        ]
      },
      {
        name: "Billing Queries",
        frequency: 600,
        id: "3",
        subtopics: [
          { name: "Payment Processing", frequency: 200 },
          { name: "Refund Requests", frequency: 100 },
        ]
      },
      {
        name: "Product Feedback",
        frequency: 400,
        id: "4",
        subtopics: [
          { name: "Feature Requests", frequency: 150 },
          { name: "User Experience", frequency: 90 },
        ]
      },
    ];
    setDataSource(initialData);
  }, []);

  const statsData = [
    { metric: "Data Size", value: "10,000" },
    { metric: "Total Document with Keyphrases", value: "8,500" },
    { metric: "Keyphrases After Filtering", value: "6,200" },
    { metric: "Unique Keyphrases after filtering", value: "1,200" },
    { metric: "Last Run Date", value: "2025-07-15" },
    { metric: "Dominant Topics", value: "50" },
    { metric: "Subtopics", value: "250" },
  ];

  const vizOptions = [
    { value: 'WordCloud', label: 'WordCloud', icon: <Cloud className="w-5 h-5" /> },
    { value: 'CircularBarPlot', label: 'Circular Bar Plot', icon: <PieChart className="w-5 h-5" /> },
    { value: 'BarPlot', label: 'Bar Plot', icon: <BarChart className="w-5 h-5" /> },
  ];

  const topicOptions = [
    { value: '', label: 'Choose an option' },
    ...dataSource.map(topic => ({ value: topic.id, label: topic.name })),
  ];

  const handleVizChange = (viz: string) => setSelectedViz(viz);
  const handleTopicChange = (selected: SingleValue<{ value: string; label: string }>) => setSelectedTopic(selected);
  const openSubtopicModal = (subtopic: Subtopic) => {
    setSelectedSubtopic(subtopic);
    setIsModalOpen(true);
  };
  const closeSubtopicModal = () => {
    setIsModalOpen(false);
    setSelectedSubtopic(null);
  };
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'descend' ? 'ascend' : 'descend');
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]
    );
  };

  const subtopicColumns: ColumnsType<Subtopic> = [
    {
      title: 'Subtopic Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="text-gray-200">{text}</span>,
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (text) => <span className="text-gray-200">{text}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          onClick={() => openSubtopicModal(record)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none hover:from-pink-600 hover:to-purple-700"
        >
          View Details
        </Button>
      ),
    },
  ];

  const columns: ColumnsType<Topic> = [
    {
      title: 'Topic Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="text-white font-semibold">{text}</span>,
    },
    {
      title: 'Subtopics',
      dataIndex: 'subtopics',
      key: 'subtopics',
      render: (subtopics: Subtopic[]) => (
        <div className="flex flex-wrap gap-2">
          {subtopics.slice(0, 5).map((subtopic, index) => (
            <button
              key={index}
              onClick={() => openSubtopicModal(subtopic)}
              className="bg-gray-600 text-white text-sm px-3 py-1 rounded-full hover:bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
            >
              {subtopic.name} ({subtopic.frequency})
            </button>
          ))}
          {subtopics.length > 5 && (
            <span className="text-gray-400 text-sm italic">+ {subtopics.length - 5} more subtopics</span>
          )}
        </div>
      ),
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      sorter: (a, b) => a.frequency - b.frequency,
      render: (text) => <span className="text-white">{text}</span>,
    },
    {
      title: '',
      key: 'expand',
      render: (_, record) => (
        <button
          onClick={() => toggleRowExpansion(record.id)}
          className="text-pink-400 hover:text-purple-400 transition-colors"
        >
          {expandedRowKeys.includes(record.id) ? (
            <ChevronUp className="w-6 h-6" />
          ) : (
            <ChevronDown className="w-6 h-6" />
          )}
        </button>
      ),
    },
  ];

  const filteredTopics = selectedTopic ? dataSource.filter(t => t.id === selectedTopic.value) : dataSource;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40" onClick={closeSidebar} />
      )}

      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-2 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg text-white hover:bg-gray-700 transition-colors duration-200"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Static Background */}
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
      <div className={`relative z-20 transition-all duration-300 ${isSidebarOpen ? 'filter blur-sm' : ''}`}>
        <div className="bg-gray-900 bg-opacity-95 backdrop-blur-sm">
          {/* Header Section */}
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Support Tickets Dashboard</h1>
              <p className="text-xl text-gray-300 max-w-3xl">Interactively analyze support ticket data with advanced visualizations and topic modeling insights.</p>
              
              {/* Only render Select when component is mounted */}
              {mounted && (
                <Select
                  instanceId="topic-select-header"
                  key="topic-select"
                  options={topicOptions}
                  value={selectedTopic}
                  onChange={handleTopicChange}
                  placeholder="Search & Select Dominant Topic"
                  className="text-gray-900 mt-4"
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: '#1f2937',
                      borderColor: '#374151',
                      '&:hover': {
                        borderColor: '#4b5563'
                      }
                    }),
                    option: (baseStyles, state) => ({
                      ...baseStyles,
                      backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#4b5563' : '#1f2937',
                      color: '#f3f4f6'
                    }),
                    singleValue: (baseStyles) => ({
                      ...baseStyles,
                      color: '#f3f4f6'
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: '#1f2937'
                    }),
                    placeholder: (baseStyles) => ({
                      ...baseStyles,
                      color: '#9ca3af'
                    })
                  }}
                />
              )}
            </div>
          </section>

          {/* Basic Statistics Section */}
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Basic Statistics</h2>
                <button
                  onClick={() => setExpandedStats(!expandedStats)}
                  className="text-pink-400 hover:text-purple-400 transition-colors"
                >
                  {expandedStats ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
              </div>
              {expandedStats && (
                <div className="grid md:grid-cols-3 gap-4">
                  {statsData.map((stat, index) => (
                    <div key={index} className="group bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 hover:scale-105">
                      <p className="text-gray-300 text-sm">{stat.metric}</p>
                      <p className="text-white text-xl font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Dominant Topics Section */}
          <section className="py-12 px-4 bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">Dominant Topics</h2>
              
              {/* Visualization Tabs */}
              <div className="flex gap-2 mb-8">
                {vizOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleVizChange(option.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedViz === option.value 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Visualization Placeholder */}
              <div className="bg-gray-800 rounded-lg p-8 mb-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  {vizOptions.find(opt => opt.value === selectedViz)?.icon}
                  <h3 className="text-xl font-bold text-white mb-2">{selectedViz} Visualization</h3>
                  <p className="text-gray-300">Interactive {selectedViz} of dominant topics</p>
                </div>
              </div>

              {/* Topics Table */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 mr-4">
                    {mounted && (
                      <Select
                        instanceId="topic-select-table"
                        key="topic-select-table"
                        options={topicOptions}
                        value={selectedTopic}
                        onChange={handleTopicChange}
                        placeholder="Search & Select Dominant Topic"
                        className="text-gray-900"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: '#2d3748',
                            borderColor: '#4a5568',
                            color: '#e2e8f0',
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: '#e2e8f0',
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: '#2d3748',
                            color: '#e2e8f0',
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected ? '#4a5568' : '#2d3748',
                            color: '#e2e8f0',
                            '&:hover': {
                              backgroundColor: '#4a5568',
                            },
                          }),
                        }}
                      />
                    )}
                  </div>
                  <Button 
                    onClick={toggleSortOrder}
                    className="text-white bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Frequency {sortOrder === 'descend' ? '↓' : '↑'}
                  </Button>
                </div>

                <Table
                  columns={columns}
                  dataSource={filteredTopics}
                  rowKey="id"
                  pagination={false}
                  className="custom-table"
                  expandable={{
                    expandedRowKeys,
                    onExpand: (expanded, record) => toggleRowExpansion(record.id),
                    expandedRowRender: (record) => (
                      <div className="bg-gray-700 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">
                          Subtopics under {record.name}
                        </h3>
                        <p className="text-gray-300 mb-2">
                          No. of times {record.name} present: {record.frequency}
                        </p>
                        <p className="text-gray-300 mb-4">
                          Total No of subtopics for {record.name}: {record.subtopics.length}
                        </p>
                        <Table
                          columns={subtopicColumns}
                          dataSource={record.subtopics}
                          rowKey="name"
                          pagination={false}
                          className="custom-subtable"
                        />
                        <div className="flex gap-2 mb-4 mt-4">
                          {vizOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleVizChange(option.value)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                selectedViz === option.value 
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                                  : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                              }`}
                            >
                              {option.icon}
                              {option.label}
                            </button>
                          ))}
                        </div>
                        <div className="bg-gray-600 rounded-lg h-64 flex items-center justify-center">
                          <div className="text-center">
                            {vizOptions.find(opt => opt.value === selectedViz)?.icon}
                            <p className="text-gray-300">Subtopics {selectedViz}</p>
                          </div>
                        </div>
                      </div>
                    ),
                  }}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Subtopic Details Modal */}
        <Transition appear show={isModalOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeSubtopicModal}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md bg-gray-800 rounded-lg p-6">
                    <Dialog.Title className="text-xl font-bold text-white mb-4">
                      Subtopic Details
                    </Dialog.Title>
                    {selectedSubtopic && (
                      <div className="space-y-4">
                        <p className="text-gray-300"><strong>Name:</strong> {selectedSubtopic.name}</p>
                        <p className="text-gray-300"><strong>Frequency:</strong> {selectedSubtopic.frequency}</p>
                        <p className="text-gray-300"><strong>Description:</strong> Placeholder description for {selectedSubtopic.name}.</p>
                      </div>
                    )}
                    <button
                      onClick={closeSubtopicModal}
                      className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
                    >
                      Close
                    </button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>

      {/* Custom Table Styles */}
      <style jsx>{`
        .custom-table :global(.ant-table) {
          background: #2d3748 !important;
        }
        .custom-table :global(.ant-table-thead > tr > th) {
          background: #4a5568 !important;
          color: #e2e8f0 !important;
          border-bottom: 1px solid #4a5568 !important;
        }
        .custom-table :global(.ant-table-tbody > tr > td) {
          background: #2d3748 !important;
          color: #e2e8f0 !important;
          border-bottom: 1px solid #4a5568 !important;
        }
        .custom-table :global(.ant-table-tbody > tr:hover > td) {
          background: #4a5568 !important;
        }
        .custom-subtable :global(.ant-table) {
          background: #374151 !important;
        }
        .custom-subtable :global(.ant-table-thead > tr > th) {
          background: #4a5568 !important;
          color: #e2e8f0 !important;
          border-bottom: 1px solid #4a5568 !important;
        }
        .custom-subtable :global(.ant-table-tbody > tr > td) {
          background: #374151 !important;
          color: #e2e8f0 !important;
          border-bottom: 1px solid #4a5568 !important;
        }
        .custom-subtable :global(.ant-table-tbody > tr:hover > td) {
          background: #4a5568 !important;
        }
      `}</style>
    </div>
  );
};

export default SupportHomePage;
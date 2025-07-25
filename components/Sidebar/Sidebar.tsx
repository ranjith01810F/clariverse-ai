'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Ticket, Mail, MessageCircle, Home, BarChart3, FileText, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TreeNode {
  key: string;
  title: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '', onClose }) => {
  const router = useRouter();
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['ticket', 'email', 'chat']);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const treeData: TreeNode[] = [
    {
      key: 'ticket',
      title: 'Ticket',
      icon: <Ticket className="w-4 h-4" />,
      children: [
        {
          key: 'ticket-support',
          title: 'Support ticket',
          children: [
            {
              key: 'ticket-support-home',
              title: 'Home',
              icon: <Home className="w-4 h-4" />,
            },
            {
              key: 'ticket-support-topic',
              title: 'Topic analysis',
              icon: <BarChart3 className="w-4 h-4" />,
            },
            {
              key: 'ticket-support-manual',
              title: 'Manual Analysis',
              icon: <FileText className="w-4 h-4" />,
            },
          ],
        },
        {
          key: 'ticket-alert',
          title: 'Alert ticket',
          children: [
            {
              key: 'ticket-alert-home',
              title: 'Home',
              icon: <Home className="w-4 h-4" />,
            },
            {
              key: 'ticket-alert-topic',
              title: 'Topic analysis',
              icon: <BarChart3 className="w-4 h-4" />,
            },
          ],
        },
      ],
    },
    {
      key: 'email',
      title: 'Email',
      icon: <Mail className="w-4 h-4" />,
      children: [
        {
          key: 'email-home',
          title: 'Home',
          icon: <Home className="w-4 h-4" />,
        },
        {
          key: 'email-topic',
          title: 'Topic analysis',
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          key: 'email-manual',
          title: 'Manual Analysis',
          icon: <FileText className="w-4 h-4" />,
        },
      ],
    },
    {
      key: 'chat',
      title: 'Chat',
      icon: <MessageCircle className="w-4 h-4" />,
      children: [
        {
          key: 'chat-home',
          title: 'Home',
          icon: <Home className="w-4 h-4" />,
        },
        {
          key: 'chat-topic',
          title: 'Topic analysis',
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          key: 'chat-manual',
          title: 'Manual Analysis',
          icon: <FileText className="w-4 h-4" />,
        },
      ],
    },
  ];

  const toggleExpanded = (key: string) => {
    setExpandedKeys(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const handleSelect = (key: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleExpanded(key);
    } else {
      setSelectedKeys([key]);
      if (key === 'ticket-support-home') {
        router.push('/ticket/support_ticket/home');
      }
      if (key === 'ticket-support-topic') {
        router.push('/ticket/support_ticket/topic-analysis');
      }
      if (key === 'ticket-support-manual') {
        router.push('/ticket/support_ticket/manual_analysis');
      }
      if (key === 'email-home') {
        router.push('/email/home');
      }
      if (key === 'email-topic') {
        router.push('/email/topic-analysis');
      }
      if (key === 'email-manual') {
        router.push('/email/manual-analysis');
      }
      if (key === 'chat-home') {
        router.push('/chat/home');
      }
      if (key === 'chat-topic') {
        router.push('/chat/topic-analysis');
      }
      if (key === 'chat-manual') {
        router.push('/chat/manual-analysis');
      }
      if (key === 'ticket-alert-home') {
        router.push('/ticket/alert_ticket/home');
      }
      if (key === 'ticket-alert-topic') {
        router.push('/ticket/alert_ticket/topic-analysis');
      }
      // You can add more routes for other keys here if needed
      console.log('selected', key);
    }
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedKeys.includes(node.key);
    const isSelected = selectedKeys.includes(node.key);
    const hasChildren = Boolean(node.children && node.children.length > 0);
    
    return (
      <div key={node.key} className="select-none">
        <div
          className={`flex items-center gap-3 py-2.5 px-4 cursor-pointer rounded-md transition-colors duration-200 ${
            isSelected && !hasChildren
              ? 'bg-purple-900 text-purple-200 border-l-4 border-purple-500' 
              : 'hover:bg-gray-800 text-gray-300'
          } ${node.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ paddingLeft: `${16 + level * 20}px` }}
          onClick={() => !node.disabled && handleSelect(node.key, hasChildren)}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <span className="flex-shrink-0 text-gray-400">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </span>
          )}
          
          {/* Node Icon */}
          {node.icon && (
            <span className="flex-shrink-0 text-purple-400">
              <div className="w-5 h-5">{node.icon}</div>
            </span>
          )}
          
          {/* Node Title */}
          <span className="flex-1 text-sm font-medium tracking-wide">
            {node.title}
          </span>
        </div>
        
        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`w-64 bg-gray-900 border-r border-gray-800 h-full overflow-y-auto ${className}`}>
      {/* Header Section */}
      <div className="h-[72px] flex items-center justify-between px-6 border-b border-gray-800">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation items */}
      <div className="p-6">
        <div className="space-y-2">
          {treeData.map(node => renderTreeNode(node))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
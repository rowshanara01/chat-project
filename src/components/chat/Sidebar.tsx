'use client';

import { useState } from 'react';
import { Conversation, User } from '@/types/chat';
import { Search, Users, LogOut, MessageSquare, Check, X } from 'lucide-react';

interface SidebarProps {
  currentUser: User | null;
  conversations: Conversation[];
  activeConv: Conversation | null;
  searchResults: User[];
  onSelectConversation: (conv: Conversation) => void;
  onSearch: (query: string) => void;
  onStartDirectChat: (userId: string) => void;
  onCreateGroup: (name: string, userIds: string[]) => void;
  onLogout: () => void;
  onClose?: () => void;
}

export const Sidebar = ({
  currentUser,
  conversations,
  activeConv,
  searchResults,
  onSelectConversation,
  onSearch,
  onStartDirectChat,
  onCreateGroup,
  onLogout,
  onClose,
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const toggleUserSelection = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleGroupSubmit = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    if (selectedUserIds.length < 2) {
      alert('Please search and select at least 2 users for the group');
      return;
    }

    onCreateGroup(groupName, selectedUserIds);
    setGroupName('');
    setSelectedUserIds([]);
    setIsCreatingGroup(false);
    setSearchQuery('');
  };

  return (
    <div className="flex h-full w-full md:w-80 flex-col border-r border-gray-200 bg-white overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 shrink-0">
        {/* User Info */}
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="font-semibold text-gray-800 truncate">{currentUser?.name}</h3>
          <p className="text-xs text-gray-500 truncate">{currentUser?.phone}</p>
        </div>
        
        {/* Action Buttons Container - Separated with gap-4 */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Logout Button */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation(); 
              onLogout();
            }} 
            className="flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition" 
            title="Logout"
          >
            <span>Logout</span>
            <LogOut size={14} />
          </button>

          {/* Sidebar Close / Collapse Button - Placed distinctly on the right */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) {
                onClose();
              }
            }}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition active:scale-95"
            title="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Search Input Section */}
      <div className="p-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={isCreatingGroup ? "Search users to add to group..." : "Search users..."}
            className="w-full rounded-lg bg-gray-100 py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Group Toggle Action */}
      <div className="px-3 pb-2 shrink-0">
        <button
          onClick={() => {
            setIsCreatingGroup(!isCreatingGroup);
            setSelectedUserIds([]);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <Users size={14} />
          {isCreatingGroup ? 'Cancel Group Creation' : 'New Group'}
        </button>
      </div>

      {/* Group Creation Panel */}
      {isCreatingGroup && (
        <div className="border-b border-gray-200 bg-gray-50 p-3 space-y-2 shrink-0">
          <input
            type="text"
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full rounded border px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="text-[11px] text-gray-500">
            Selected Users: <span className="font-bold text-blue-600">{selectedUserIds.length}</span> (Min 2 required)
          </div>
          <button
            onClick={handleGroupSubmit}
            className="w-full rounded bg-blue-600 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Create Group
          </button>
        </div>
      )}

      {/* Scrollable Conversation / Search List Container */}
      <div className="flex-1 overflow-y-auto">
        {searchResults.length > 0 ? (
          <div className="p-2">
            <p className="px-2 pb-1 text-xs font-semibold text-gray-400 uppercase">
              {isCreatingGroup ? "Click to select members" : "Search Results"}
            </p>
            {searchResults.map((user) => {
              const isSelected = selectedUserIds.includes(user._id);
              return (
                <div
                  key={user._id}
                  onClick={() => {
                    if (isCreatingGroup) {
                      toggleUserSelection(user._id);
                    } else {
                      onStartDirectChat(user._id);
                      setSearchQuery('');
                      onSearch('');
                    }
                  }}
                  className={`flex cursor-pointer items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.phone}</p>
                  </div>
                  {isCreatingGroup && isSelected && (
                    <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : searchQuery.trim() !== '' ? (
          <div className="flex flex-col items-center justify-center h-48 px-4 text-center text-gray-400">
            <Search className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-xs font-medium">No users found</p>
            <p className="text-[11px] mt-1 text-gray-400">
              No match for "{searchQuery}". Try a different phone number.
            </p>
          </div>
        ) : Array.isArray(conversations) && conversations.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => onSelectConversation(conv)}
                className={`flex cursor-pointer items-center gap-3 p-3 transition hover:bg-gray-100 ${
                  activeConv?._id === conv._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                  {conv.isGroup ? <Users size={18} /> : <MessageSquare size={18} />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-medium text-gray-800 truncate">
                    {conv.type === 'group' || conv.isGroup
                      ? conv.name
                      : conv.participant?.name ||
                        conv.participants?.find(
                          (p) => String(typeof p === 'object' ? p._id : p) !== String(currentUser?._id)
                        )?.name ||
                        'Chat'}
                  </h4>
                  
                  <p className="text-xs text-gray-400 truncate">
                    {conv.lastMessage?.text || 'No messages yet'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 px-4 text-center text-gray-400">
            <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-xs font-medium">No conversations yet</p>
            <p className="text-[11px] mt-1 text-gray-400">
              Search a phone number above to start a chat!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
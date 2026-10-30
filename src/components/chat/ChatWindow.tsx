'use client';

import { useState, useRef, useEffect } from 'react';
import { Conversation, Message, User } from '@/types/chat';
import { MessageItem } from './MessageItem';
import { Send, Settings, UserPlus, Shield, UserMinus, LogOut, Edit2, Check, X, ArrowLeft } from 'lucide-react';

interface ChatWindowProps {
  activeConv: Conversation | null;
  messages: Message[];
  currentUser: User | null;
  allUsers?: User[];
  onSendMessage: (text: string) => Promise<void>;
  onAddMembers?: (groupId: string, userIds: string[]) => Promise<void>;
  onRemoveMemberOrLeave?: (groupId: string, userId: string) => Promise<void>;
  onPromoteToAdmin?: (groupId: string, userId: string) => Promise<void>;
  onRenameGroup?: (groupId: string, newName: string) => Promise<void>;
  onSearchUsers?: (query: string) => Promise<User[] | any>;
  onBack?: () => void;
}

export const ChatWindow = ({
  activeConv,
  messages,
  currentUser,
  allUsers = [],
  onSendMessage,
  onAddMembers,
  onRemoveMemberOrLeave,
  onPromoteToAdmin,
  onRenameGroup,
  onSearchUsers,
  onBack,
}: ChatWindowProps) => {
  const [text, setText] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const isGroup = activeConv?.type === 'group' || activeConv?.isGroup;
  
  /* Safely check if current logged in user is admin */
  const isAdmin = isGroup && Array.isArray(activeConv?.admins) && currentUser?._id
    ? activeConv.admins.includes(currentUser._id)
    : false;

  useEffect(() => {
    if (activeConv) {
      setNewGroupName(activeConv.name || '');
      setIsEditingName(false);
      setIsSettingsOpen(false);
      console.log('Active Conversation Object Structure:', activeConv);
    }
  }, [activeConv]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isAtBottom);
  };

  useEffect(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const currentText = text;
    setText('');
    await onSendMessage(currentText);
  };

  /* Rename Action Handlers */
  const handleRename = async () => {
    if (!newGroupName.trim() || !activeConv?._id || !onRenameGroup) return;
    await onRenameGroup(activeConv._id, newGroupName.trim());
    setIsEditingName(false);
  };

  /* Search user by name/username and add member using ID */
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      alert('Only group admins can add new members!');
      return;
    }

    const inputVal = newMemberId.trim();
    if (!inputVal) return;

    let targetUserId = inputVal;
    let matchedUserObj: any = null;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(inputVal);

    if (!isObjectId) {
      /* 1. First search in local allUsers array */
      if (allUsers && allUsers.length > 0) {
        matchedUserObj = allUsers.find(
          (u: any) =>
            u.name?.toLowerCase() === inputVal.toLowerCase() ||
            u.username?.toLowerCase() === inputVal.toLowerCase()
        );
      }

      /* 2. If not found locally, search live users from server via API */
      if (!matchedUserObj && onSearchUsers) {
        try {
          const searchResults = await onSearchUsers(inputVal);
          if (Array.isArray(searchResults) && searchResults.length > 0) {
            matchedUserObj = searchResults.find(
              (u: any) =>
                u.name?.toLowerCase() === inputVal.toLowerCase() ||
                u.username?.toLowerCase() === inputVal.toLowerCase()
            ) || searchResults[0]; // fallback to first result
          }
        } catch (err) {
          console.error('Error searching user:', err);
        }
      }

      if (matchedUserObj) {
        targetUserId = matchedUserObj._id || matchedUserObj.id;
      } else {
        alert(`User "${inputVal}" not found! Please check the name or ID.`);
        return;
      }
    } else if (allUsers) {
      matchedUserObj = allUsers.find(
        (u: any) => (u._id || u.id) === targetUserId
      );
    }

    if (!activeConv?._id || !onAddMembers) return;

    /* Check duplicate member */
    const isAlreadyMember = activeConv.participants?.some(
      (p: any) => (p._id || p.id) === targetUserId
    );

    if (isAlreadyMember) {
      alert(`User "${matchedUserObj?.name || inputVal}" is already in this group!`);
      return;
    }

    await onAddMembers(activeConv._id, [targetUserId]);

    const newParticipant = matchedUserObj || {
      _id: targetUserId,
      name: inputVal,
    };

    if (activeConv.participants) {
      activeConv.participants = [...activeConv.participants, newParticipant];
    }

    alert(`User "${newParticipant.name}" added to the group successfully!`);
    setNewMemberId('');
  };

  /* Remove Member */
  const handleRemoveMember = async (userId: string) => {
    if (!isAdmin) {
      alert('Only group admins can remove members!');
      return;
    }

    if (!activeConv?._id || !onRemoveMemberOrLeave) return;

    if (confirm('Are you sure you want to remove this member?')) {
      try {
        await onRemoveMemberOrLeave(activeConv._id, userId);

        if (activeConv && activeConv.participants) {
          activeConv.participants = activeConv.participants.filter(
            (p: any) => (p._id || p.id) !== userId
          );
        }

        alert('Member removed successfully!');
      } catch (err) {
        alert('Failed to remove member.');
      }
    }
  };

  /* Promote member to admin with confirm dialog & instant UI update */
  const handlePromoteAdmin = async (userId: string) => {
    if (!isAdmin) {
      alert('Only group admins can promote members!');
      return;
    }

    if (!activeConv?._id || !onPromoteToAdmin) return;
    
    if (confirm('Are you sure you want to promote this member to Admin?')) {
      try {
        await onPromoteToAdmin(activeConv._id, userId);

        if (activeConv) {
          const currentAdmins = activeConv.groupAdmins || [];
          const isAlreadyAdmin = currentAdmins.some(
            (admin: any) => (admin._id || admin.id || admin) === userId
          );

          if (!isAlreadyAdmin) {
            activeConv.groupAdmins = [...currentAdmins, userId];
          }
        }

        alert('Member promoted to Admin successfully!');
      } catch (err) {
        alert('Failed to promote member.');
      }
    }
  };

  /* Leave Group */
  const handleLeaveGroup = async () => {
    if (!activeConv?._id || !currentUser?._id || !onRemoveMemberOrLeave) return;

    if (confirm('Are you sure you want to leave this group?')) {
      try {
        await onRemoveMemberOrLeave(activeConv._id, currentUser._id);
        alert('You have left the group.');
        setIsSettingsOpen(false);
      } catch (err) {
        alert('Failed to leave the group.');
      }
    }
  };

  if (!activeConv) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center text-gray-500">
        <p className="mb-4 text-sm font-medium">Select a conversation to start messaging</p>
        
        {/* Mobile view */}
        <button
          onClick={onBack}
          className="md:hidden flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700 transition"
        >
          Open Chats
        </button>
      </div>
    );
  }
  
  // console.log('Participants Data:', activeConv?.participants);
  // console.log('Current User ID:', currentUser?._id);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      {/* Header Container */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-1.5 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition active:scale-95"
              title="Back to conversations"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-800 truncate">
              {activeConv?.isGroup || activeConv?.type === 'group'
                ? activeConv?.name
                : activeConv?.participant?.name ||
                  activeConv?.participants?.find(
                    (p) => String(typeof p === 'object' ? p._id : p) !== String(currentUser?._id)
                  )?.name ||
                  'Chat'}
            </h3>

            {/* Group members list rendering */}
            {isGroup && activeConv.participants && (
              <p className="text-xs text-gray-500 truncate max-w-xs sm:max-w-md">
                {activeConv.participants.map((p: any) => p.name).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Group Settings Toggle Button */}
        {isGroup && (
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition shrink-0"
            title="Group Settings"
          >
            <Settings size={20} />
          </button>
        )}
      </div>

      {/* Group Settings Sidebar Modal */}
      {isSettingsOpen && isGroup && (
        <div className="absolute right-0 top-16 z-30 h-[calc(100%-4rem)] w-80 border-l border-gray-200 bg-white p-4 shadow-xl overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-semibold text-gray-800">Group Settings</h4>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* 1. Group Rename Section */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase">Group Name</label>
              <div className="mt-1 flex items-center gap-2">
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="flex-1 rounded border p-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button onClick={handleRename} className="text-green-600 hover:text-green-700">
                      <Check size={18} />
                    </button>
                    <button onClick={() => setIsEditingName(false)} className="text-red-500">
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{activeConv.name}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Add Member Section */}
            {isAdmin && onAddMembers && (
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase">Add Member</label>
                <form onSubmit={handleAddMember} className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    placeholder="Enter User ID or Name"
                    className="flex-1 rounded border px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                  >
                    <UserPlus size={14} /> Add
                  </button>
                </form>
              </div>
            )}

            {/* 3. Members List Section */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
                Members ({activeConv.participants?.length || 0})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeConv.participants?.map((member: any) => {
                  const isMemberAdmin = activeConv.admins?.includes(member._id);
                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between rounded p-1.5 hover:bg-gray-50 text-xs"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">{member.name}</span>
                        {isMemberAdmin && (
                          <span className="text-[10px] text-blue-600 font-semibold">Admin</span>
                        )}
                      </div>

                      {isAdmin && member._id !== currentUser?._id && (
                        <div className="flex items-center gap-1">
                          {!isMemberAdmin && onPromoteToAdmin && (
                            <button
                              onClick={() => handlePromoteAdmin(member._id)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Make Admin"
                            >
                              <Shield size={14} />
                            </button>
                          )}
                          {onRemoveMemberOrLeave && (
                            <button
                              onClick={() => handleRemoveMember(member._id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove Member"
                            >
                              <UserMinus size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Leave Group */}
          {onRemoveMemberOrLeave && (
            <button
              onClick={handleLeaveGroup}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
            >
              <LogOut size={16} /> Leave Group
            </button>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => {
            const uniqueKey = msg._id || msg.id || `temp-msg-${index}-${msg.createdAt || Date.now()}`;
            return (
              <MessageItem
                key={uniqueKey}
                message={msg}
                currentUserId={currentUser?._id}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs">Send a message to start the conversation!</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form - Fixed at Bottom */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700 disabled:opacity-50 transition shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
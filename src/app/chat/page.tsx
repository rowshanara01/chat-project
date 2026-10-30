'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useChat } from '@/hooks/useChat';
import { useSocket } from '@/hooks/useSocket';
import { User, Message, Conversation } from '@/types/chat';
import { LoginModal } from '@/components/auth/LoginModal';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatPage() {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const {
    conversations,
    activeConv,
    setActiveConv,
    messages,
    setMessages,
    searchResults,
    fetchConversations,
    fetchMessages,
    searchUsers,
    startDirectChat,
    createGroup,
    addMembersToGroup,
    removeMemberOrLeaveGroup,
    promoteToAdmin,
    renameGroup,
  } = useChat(token);

  /* Persist active conversation in localStorage so refresh doesn't reset chat window */
  const handleSelectConversation = (conv: Conversation | null) => {
    setActiveConv(conv);
    if (conv) {
      localStorage.setItem('activeConvId', conv._id);
    } else {
      localStorage.removeItem('activeConvId');
    }

    setIsSidebarOpen(false);
  };

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUser(res.data);
      const convs = await fetchConversations();

      /* Restore active conversation after page refresh */
      const savedConvId = localStorage.getItem('activeConvId');
      if (savedConvId && convs) {
        const matched = convs.find((c: Conversation) => c._id === savedConvId);
        if (matched) setActiveConv(matched);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      handleLogout();
    }
  }, [fetchConversations, setActiveConv]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser();
    }
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv._id);
    }
  }, [activeConv, fetchMessages]);

  /* Real-time incoming message */
  const handleNewMessage = useCallback(
    (newMessage: Message | any) => {
      if (!newMessage) return;

      const msgConvId =
        typeof newMessage.conversationId === 'object'
          ? newMessage.conversationId?._id
          : newMessage.conversationId ||
            (typeof newMessage.conversation === 'object'
              ? newMessage.conversation?._id
              : newMessage.conversation);

      const currentActiveId = activeConv?._id;

      /* Match IDs strictly as strings */
      if (currentActiveId && String(msgConvId) === String(currentActiveId)) {
        setMessages((prev) => {
          /* Check duplicate using _id or temp id */
          const exists = prev.some(
            (m) => String(m._id) === String(newMessage._id)
          );
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }

      /* Always trigger conversation list update for sidebar preview */
      fetchConversations();
    },
    [activeConv?._id, fetchConversations, setMessages]
  );

  useSocket({
    token,
    activeConversationId: activeConv?._id,
    onNewMessage: handleNewMessage,
    onConversationUpdated: fetchConversations,
  });

  const handleLogin = async (phone: string, name: string) => {
    try {
      setAuthLoading(true);
      const res = await api.post('/auth/login', { phone, name });
      const authToken = res.data.token || res.data.accessToken;
      if (authToken) {
        localStorage.setItem('token', authToken);
        setToken(authToken);
        fetchCurrentUser();
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  /* Send message */
  const handleSendMessage = async (text: string) => {
    if (!activeConv || !text.trim()) return;

    const payload = { conversationId: activeConv._id, text };

    try {
      const res = await api.post('/messages', payload);
      const savedMessage = res.data;

      if (savedMessage) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === savedMessage._id);
          return exists ? prev : [...prev, savedMessage];
        });
        
        const socket = getSocket();
        if (socket && socket.connected) {
          socket.emit('sendMessage', savedMessage);
          socket.emit('message:send', savedMessage);
        }
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('activeConvId');
    setToken(null);
    setCurrentUser(null);
    setActiveConv(null);
  };

  if (!token) {
    return <LoginModal onLogin={handleLogin} loading={authLoading} />;
  }

  const allAvailableUsers = conversations?.flatMap((c: any) => c.participants || []) || [];

  /* Back to conversation list on mobile */
  const handleBackToList = () => {
    handleSelectConversation(null);
    setIsSidebarOpen(true);
  };


  return (
    <div className="flex h-screen bg-gray-50 ">
      {/* Sidebar Container */}
      <div
       className={`h-full w-full md:w-80 md:flex-shrink-0 transition-all duration-300 ${
          isSidebarOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <Sidebar
          currentUser={currentUser}
          conversations={conversations}
          activeConv={activeConv}
          searchResults={searchResults}
          onSelectConversation={handleSelectConversation} 
          onSearch={searchUsers}
          onStartDirectChat={startDirectChat}
          onCreateGroup={createGroup}
          onLogout={handleLogout}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* ChatWindow Container */}
      <div
        className={`h-full flex-1 w-full ${
          !isSidebarOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <ChatWindow
          activeConv={activeConv}
          messages={messages}
          currentUser={currentUser}
          allUsers={allAvailableUsers}
          onSendMessage={handleSendMessage}
          onAddMembers={addMembersToGroup}
          onRemoveMemberOrLeave={removeMemberOrLeaveGroup}
          onPromoteToAdmin={promoteToAdmin}
          onRenameGroup={renameGroup}
          onBack={handleBackToList}
        />
      </div>
    </div>
  );
}
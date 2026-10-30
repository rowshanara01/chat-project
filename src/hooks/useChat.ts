import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { Conversation, Message, User } from '@/types/chat';

export const useChat = (token: string | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const fetchConversations = useCallback(async () => {
    if (!token) return null;
    try {
      const res = await api.get('/conversations');
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.conversations || res.data?.data || [];
      setConversations(list);
      return list;
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations([]);
      return [];
    }
  }, [token]);

  /* Ensure ascending order (Oldest top -> Newest bottom) */
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await api.get(`/conversations/${conversationId}/messages`);
      const msgList: Message[] = Array.isArray(res.data)
        ? res.data
        : res.data?.messages || [];

      const sortedMessages = [...msgList].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setMessages(sortedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    }
  }, []);

  /* API-based search without frontend filtering */
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await api.get(`/users/search?q=${query}`);
      const usersList = Array.isArray(res.data)
        ? res.data
        : res.data?.users || res.data?.data || [];

      // console.log('API Search Response:', usersList);

      setSearchResults(usersList);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    }
  };

  const startDirectChat = async (targetUserId: string) => {
    try {
      const res = await api.post('/conversations', { userId: targetUserId });
      setActiveConv(res.data);
      localStorage.setItem('activeConvId', res.data._id);
      setSearchResults([]);
      fetchConversations();
    } catch (err) {
      console.error('Error starting direct chat:', err);
    }
  };

  /* group creation */
  const createGroup = async (name: string, participantIds: string[]) => {
    if (!name.trim() || !participantIds || participantIds.length === 0) return;

    try {
      const cleanIds = Array.from(
        new Set(
          participantIds.map((item: any) =>
            typeof item === 'object' ? item._id || item.id : String(item)
          )
        )
      );

      let loggedInUserId: string | null = null;
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          loggedInUserId = parsed._id || parsed.id || null;
        }
      } catch (e) {
        console.warn('Could not parse stored user from localStorage');
      }

      if (loggedInUserId && !cleanIds.includes(String(loggedInUserId))) {
        cleanIds.push(String(loggedInUserId));
      }

      const payload = {
        name: name.trim(),
        participantIds: cleanIds,
        participants: cleanIds,
      };

      const res = await api.post('/conversations/group', payload);
      const newGroup = res.data?.conversation || res.data?.data || res.data;

      if (newGroup && newGroup._id) {
        console.log(' Group Created Successfully:', newGroup);
        setActiveConv(newGroup);
        localStorage.setItem('activeConvId', newGroup._id);
        
        /* Reset search states so sidebar renders the conversation list */
        setSearchResults([]);
        
        /* Refetch all active conversations to show the new group */
        await fetchConversations();
      }
    } catch (err: any) {
      console.error(' Error creating group details:', err?.response?.data || err);
    }
  };

  /* Add members to group (Admin only) */
  const addMembersToGroup = async (groupId: string, userIds: string[]) => {
    try {
      const cleanUserIds = Array.from(
        new Set(
          userIds.map((id: any) =>
            typeof id === 'object' ? id._id || id.id : String(id).trim()
          )
        )
      ).filter(Boolean);

      const res = await api.post(`/conversations/${groupId}/participants`, {
        userIds: cleanUserIds,
      });

      // console.log(' Members added successfully:', res.data);

      /* Fetch all conversations in background */
      await fetchConversations();

      /* Instant UI Update: activeConv ke updated response ba updated conversation diye sync koro */
      const updatedConversation = res.data?.conversation || res.data;
      if (updatedConversation && activeConv?._id === groupId) {
        setActiveConv(updatedConversation);
      }

      return updatedConversation;
    } catch (err: any) {
      console.error(
        ' Error adding members:',
        err?.response?.data?.message || err?.response?.data || err?.message || err
      );
      throw err;
    }
  };

  /* Remove member or leave group */
  const removeMemberOrLeaveGroup = async (groupId: string, userId: string) => {
    try {
      const res = await api.delete(`/conversations/${groupId}/participants/${userId}`);
      console.log(' Removed/Left group successfully:', res.data);
      await fetchConversations();
    } catch (err: any) {
      console.error(' Error leaving/removing member:', err?.response?.data?.message || err?.message || err);
    }
  };

  /* Promote member to admin (Admin only) */
  const promoteToAdmin = async (groupId: string, userId: string) => {
    try {
      const res = await api.post(`/conversations/${groupId}/admins`, { userId });
      console.log('Promoted to admin successfully:', res.data);

      await fetchConversations();

      /* Instant State Update for Active Conversation */
      const updatedConv = res.data?.conversation || res.data;
      
      if (updatedConv && updatedConv._id) {
        setActiveConv(updatedConv);
      } else if (activeConv && activeConv._id === groupId) {
        const currentAdmins = activeConv.groupAdmins || [];
        const isAlreadyAdmin = currentAdmins.some(
          (admin: any) => (typeof admin === 'object' ? admin._id : admin) === userId
        );

        if (!isAlreadyAdmin) {
          setActiveConv({
            ...activeConv,
            groupAdmins: [...currentAdmins, userId],
          });
        }
      }
    } catch (err: any) {
      console.error(
        'Error promoting to admin:',
        err?.response?.data?.message || err?.message || err
      );
      throw err; 
    }
  };

  /* Rename group (Admin only) */
  const renameGroup = async (groupId: string, newName: string) => {
    try {
      const payload = { name: newName.trim() };
      console.log(`Renaming Group (${groupId}) with payload:`, payload);

      const res = await api.patch(`/conversations/${groupId}`, payload);
      console.log('Group renamed successfully:', res.data);
      
      /* Sync local active conversation state if current group is renamed */
      if (activeConv?._id === groupId) {
        setActiveConv((prev: any) => (prev ? { ...prev, name: newName.trim() } : prev));
      }

      await fetchConversations();
    } catch (err: any) {
      console.error(
        ' Error renaming group:',
        err?.response?.data || err?.message || err
      );
    }
  };

  return {
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
  };
};
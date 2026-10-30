import { useEffect } from 'react';
import { initSocket, disconnectSocket } from '@/lib/socket';
import { Message } from '@/types/chat';

interface UseSocketProps {
  token: string | null;
  activeConversationId?: string;
  onNewMessage: (message: Message) => void;
  onConversationUpdated?: () => void;
}

export const useSocket = ({
  token,
  activeConversationId,
  onNewMessage,
  onConversationUpdated,
}: UseSocketProps) => {
  useEffect(() => {
    if (!token) return;

    const socket = initSocket(token);

    const handleNewMessage = (message: Message) => {
      onNewMessage(message);
    };

    const handleConversationUpdated = () => {
      if (onConversationUpdated) {
        onConversationUpdated();
      }
    };

    /* Common Socket Listeners */
    socket.on('message:new', handleNewMessage);
    socket.on('message:received', handleNewMessage);
    socket.on('receive_message', handleNewMessage);
    socket.on('conversation:updated', handleConversationUpdated);

    /* Real-Time Room Join Logic */
    if (activeConversationId && socket.connected) {
      // Backend structured socket room join
      socket.emit('join:conversation', activeConversationId);
      socket.emit('join_room', activeConversationId);
    }

    return () => {
      if (activeConversationId && socket.connected) {
        socket.emit('leave:conversation', activeConversationId);
        socket.emit('leave_room', activeConversationId);
      }

      socket.off('message:new', handleNewMessage);
      socket.off('message:received', handleNewMessage);
      socket.off('receive_message', handleNewMessage);
      socket.off('conversation:updated', handleConversationUpdated);
    };
  }, [token, activeConversationId, onNewMessage, onConversationUpdated]);
};
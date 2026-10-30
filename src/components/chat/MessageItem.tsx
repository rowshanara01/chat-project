import { Message } from '@/types/chat';

interface MessageItemProps {
  message: Message;
  currentUserId?: string;
}

export const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
  const isMe = senderId === currentUserId;

  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-xs rounded-2xl px-4 py-2 text-sm md:max-w-md ${
          isMe ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-sm'
        }`}
      >
        <p>{message.text}</p>
        <span className={`block mt-1 text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};
// User model
export interface User {
  _id: string;
  name: string;
  phone: string;
}

// Message model
export interface Message {
  _id: string;
  id?: string;
  conversationId: string;
  sender: User | string;
  text: string;
  createdAt: string;
}

// Conversation model (1-on-1 or Group)
export interface Conversation {
  _id: string;
  name?: string;
  isGroup: boolean;
  type?: 'direct' | 'group' | string;
  participant?: User;
  groupAdmins?: string[];
  participants: User[];
  admins?: string[];
  lastMessage?: Message;
  updatedAt: string;
}
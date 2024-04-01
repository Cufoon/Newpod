import React, { useContext } from 'react';

interface Message {
  content: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  key?: string;
  onClose?: () => void;
  closable?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
  prefixCls?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

interface MessageContextType {
  messages: Message[];
}

// 创建一个context，不进行初始化
const MessageContext = React.createContext<MessageContextType>({
  messages: []
});

const useMessages = () => {
  const context = useContext(MessageContext);
  return context.messages;
};

const MessageManager: React.FC = () => {
  const messages = useMessages();
  return (
    <>
      {messages.map((message) => {
        return <div>{message.content}</div>;
      })}
    </>
  );
};

export default MessageManager;

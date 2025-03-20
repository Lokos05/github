import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, WebSocketMessage } from '../types/auth';

interface WebSocketContextType {
  socket: WebSocket | null;
  user: User | null;
  setUser: (user: User | null) => void;
  isConnected: boolean;
  sendMessage: (event: string, data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      setSocket(null);
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log('Received message:', message);

      if (message.data.user) {
        setUser(message.data.user);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (event: string, data: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({ event, data }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, user, setUser, isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 
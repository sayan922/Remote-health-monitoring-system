import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { ConnectionStatus } from '../types';

interface WebSocketContextType {
  connectionStatus: ConnectionStatus;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  websocket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  connectionStatus: { connected: false, error: null, lastUpdated: null },
  connect: () => {},
  disconnect: () => {},
  sendMessage: () => {},
  websocket: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

// ✅ Your Elastic IP + endpoint path
const WEBSOCKET_URL = 'wss://remote-health-monitoring-system-b1jt.onrender.com';

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    error: null,
    lastUpdated: null,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket]);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
        setConnectionStatus({
          connected: true,
          error: null,
          lastUpdated: Date.now(),
        });
        setWebsocket(ws);
      };

      ws.onclose = () => {
        setConnectionStatus({
          connected: false,
          error: 'Connection closed',
          lastUpdated: Date.now(),
        });
        setWebsocket(null);
      };

      ws.onerror = (error) => {
        setConnectionStatus({
          connected: false,
          error: 'Connection error',
          lastUpdated: Date.now(),
        });
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      setConnectionStatus({
        connected: false,
        error: 'Failed to connect',
        lastUpdated: Date.now(),
      });
      console.error('WebSocket connection error:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (websocket) {
      websocket.close();
      setWebsocket(null);
      setConnectionStatus({
        connected: false,
        error: null,
        lastUpdated: Date.now(),
      });
    }
  }, [websocket]);

  const sendMessage = useCallback(
    (message: string) => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(message);
      } else {
        console.error('WebSocket is not connected');
      }
    },
    [websocket]
  );

  return (
    <WebSocketContext.Provider
      value={{
        connectionStatus,
        connect,
        disconnect,
        sendMessage,
        websocket,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

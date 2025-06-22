
import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
  raceId?: string;
  timestamp?: string;
}

export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const reconnectTimeoutRef = useRef<number>();

  const connect = () => {
    try {
      setConnectionStatus('connecting');
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnectionStatus('disconnected');
        setSocket(null);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('disconnected');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socket) {
      socket.close();
    }
  };

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    connect,
    disconnect,
    sendMessage,
    lastMessage,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
  };
};

// Specific hook for F1 live race updates
export const useF1LiveUpdates = () => {
  const WS_URL = "wss://wcgrdwsndxjkpfgcnbhx.supabase.co/functions/v1/websocket-live";
  const { connect, disconnect, sendMessage, lastMessage, connectionStatus, isConnected } = useWebSocket(WS_URL);

  const subscribeToRace = (raceId: string) => {
    sendMessage({
      type: 'subscribe',
      raceId
    });
  };

  const unsubscribeFromRace = () => {
    sendMessage({
      type: 'unsubscribe'
    });
  };

  return {
    connect,
    disconnect,
    subscribeToRace,
    unsubscribeFromRace,
    lastMessage,
    connectionStatus,
    isConnected,
  };
};
